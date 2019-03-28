+++
title = "setting up irc with weechat"
date = 2018-10-18

[taxonomies]
tags = ["irc", "life"]
+++

I've just recently discovered that weechat has a "relay" mode, which means it can act as a relay server to other clients (for example, my phone). If I leave an instance of weechat running on, say, my server that's always running, it can act as a bouncer and my phone can receive notifications for highlights as well.

The android app I'm using is called [Weechat-Android][2]. On my laptop I'm using [Glowing Bear][5].

## step 1: tmux

To achieve this setup, first I install [tmux][1], which separates the terminal from the session. This means I can leave the weechat instance running in the background and detach my current session from it. The command for this is:

```bash
$ tmux new-session -s weechat
```

where the `-s` option just names the tmux session so it's not assigned some number.

## step 2: add relay

Now add a relay through weechat:

```
/relay add <name> <port>
```

where name is

```
[ipv4.][ipv6.][ssl.]name
    ipv4: force use of IPv4
    ipv6: force use of IPv6
    ssl: enable SSL
```

according to the [documentation][3].

## step 2.5: ssl

I'm using SSL on my relay endpoint, and I'd recommend anyone else to use it to. You could follow what the documentation says and generate a self-signed certificate, but getting a trusted certificate with [LetsEncrypt][4] is so easy there's almost no excuse not to do it.

To start, install certbot, which is LetsEncrypt's handy bot that does everything for you. Once you're ready, run:

```bash
$ sudo certbot certonly <domain>
```

We want the `certonly` option because by default, certbot will try to install it into an existing HTTP server, but we're not using it for HTTP. This command should dump some files into `/etc/letsencrypt/live/<domain>`.

Finally, just concatenate the important files, `privkey.pem` and `fullchain.pem` in that order, into `~/.weechat/ssl/relay.pem` (you can change that path with `/set relay.network.ssl_cert_key`). The file should look like:

```
-----BEGIN PRIVATE KEY-----
...data...
-----END PRIVATE KEY-----
-----BEGIN CERTIFICATE-----
...data...
-----END CERTIFICATE-----
```

If your private key file starts with `BEGIN CERTIFICATE`, just change that to `BEGIN PRIVATE KEY` (change the END one too) and it should be fine.

## step 3: set password

Since weechat 1.6, the option to not use a password has been removed. So in order for clients to be able to connect to the server, you must set one using:

```
/set relay.network.password <password>
```

The password should appear in asterisks in the weechat prompt box.

## step 4: connect

This depends on your setup, but you must make sure that your setup is reachable from the outside. Make sure the port that you chose for the relay is accessible through firewalls.

That's it! If you're also using the android app to connect, just type in your host's address and password and you should be all good to go.

[1]: https://wiki.archlinux.org/index.php/Tmux
[2]: https://github.com/ubergeek42/weechat-android
[3]: https://www.weechat.org/files/doc/stable/weechat_user.en.html#relay_commands
[4]: https://letsencrypt.org/
[5]: https://www.glowing-bear.org/
