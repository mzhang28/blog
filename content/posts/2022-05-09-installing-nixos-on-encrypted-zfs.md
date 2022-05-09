+++
title = "Installing NixOS on ZFS with encryption"
date = 2022-05-09
tags = ["nixos", "linux", "setup"]
draft = true
toc = true
+++

This is mostly to serve as a reference for how I set up my machine, so I can
look back on it later. I'll be installing NixOS on my desktop, with the
following specs:

- CPU: AMD Ryzen 7 3700X
- GPU: NVIDIA GeForce RTX 3080 Ti
- RAM: 80GB
- Storage:
  - SSD1: 1TB Samsung SSD 860 (encrypted), which I'm migrating off of
  - SSD2: 2TB Crucial MX500 (encrypted), which I'm migrating to
  - HDD: 3TB HITACHI HUA72303 (unencrypted), which serves as storage for music
      and games.

I already have my [Nix flake][1] setup for my other machines, but of those only
my server runs NixOS. Instead, all my other machines use Arch Linux with just
the Nix package manager installed on top.

[1]: https://git.sr.ht/~mzhang/flake

## Installation Media

Since I'm using two SSDs, I don't bother with flashing the installation media on
a USB stick and rebooting into that. I can just use Nix to get the tools that I
need:

```
nix shell nixpkgs#nixos-install-tools
```

This will get me scripts like `nixos-generate-config` and `nixos-install` which
I'll need for my setup.

## Disk Setup

First, I identified my disks. This can be done using `ls -l /dev/disk/by-id` and
identifying the one corresponding to your disk.

```
export SSD1=/dev/disk/by-id/ata-Samsung_SSD_860_EVO_1TB_[...]
export SSD2=/dev/disk/by-id/ata-CT2000MX500SSD1_[...]
export HDD=/dev/disk/by-id/ata-HITACHI_HUA723030ALA640_[...]
```

Then, using some of the other references out there, I carefully used `sgdisk` to
construct the partition tables. I want to dual boot NixOS with Windows, so I'm
purposefully leaving out around 40% of the disk for that partition. (Note: use
`sgdisk -L` to get the IDs for the `-t` parameter)

```
# Zap the disk
sgdisk --zap $SSD2

# 1: Boot partition
sgdisk -n1:1M:+512M -t1:ef00 $SSD2

# 2: NixOS partition
# Note: bf01 is "Solaris /usr & Mac ZFS"
sgdisk -n2:0:+1000G -t2:bf01 $SSD2
```

We'll let Windows create its own partitions using its installer later.

## ZFS Setup

```
zpool create \
  -o ashift=12              `# 2^12 = 4096 sector size, note small o` \
  -o autotrim=on \
  -O acltype=posixacl       `# needed for some things` \
  -O atime=off              `# turn off access time` \
  -O mountpoint=none        `# turn off automatic mounting` \
  -O compression=lz4        `# sure, why not` \
  -O xattr=sa \
  -O encryption=aes-256-gcm `# disk encryption` \
  -O keyformat=passphrase \
  rpool $SSD2-part2
```

It'll prompt for the encryption passphrase now.

```
mkfs.vfat $SSD2-part1
zfs create -o mountpoint=legacy rpool/nixos
```

Mount them:

```
export MNT=/mnt/nixos
mount -t zfs rpool/nixos $MNT

mkdir $MNT/boot
mount $SSD2-part1 $MNT/boot
```

## NixOS Hardware Configuration

```
nixos-generate-config --root $MNT
```

This writes the default configuration along with the results of the hardware
scan. Although it says not to edit the file, this scrapes all of my virtual
network interfaces which I do _not_ want in my general config, so I'll trim it a
bit. Edit the file with:

```
$EDITOR $MNT/etc/nixos/hardware-configuration.nix
```

For the `configuration.nix` file, the following needs to be added somewhere in
the file in order to get ZFS to work:

```
{
  boot.supportedFilesystems = [ "zfs" ];
  networking.hostId = "<8 random hex digits>";

}
```

Also I chose to use GRUB instead of systemd-boot, so replace the line enabling
systemd-boot with:

```
{
  boot.loader.grub.enable = true;
  boot.loader.grub.efiSupport = true;
  boot.loader.grub.device = "nodev";
}
```

## Install NixOS

At this point I copied this configuration into my flake, so I can use all the
packages that I've previously set up, including home manager.

Run

```
nixos-install --root $MNT --flake flake#attr
```

Done!
