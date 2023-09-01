export interface Link {
  name: string;
  url: string;
  icon: string;
  description: string;
}

const links: Link[] = [
  {
    name: "Matrix",
    url: "https://matrix.to/#/@michael:chat.mzhang.io",
    icon: "matrix-org",
    description: "Come chat with me on Matrix",
  },
  {
    name: "Git",
    url: "https://git.mzhang.io",
    icon: "gitea",
    description: "Check out my public open source projects on Forgejo",
  },
  {
    name: "GitHub",
    url: "https://github.com/iptq",
    icon: "github",
    description: "See a history of my old projects on GitHub",
  },
  {
    name: "Mastodon",
    url: "https://fosstodon.org/@mzhang",
    icon: "mastodon-square",
    description: "Follow my ramblings on Mastodon",
  },
  {
    name: "Keybase",
    url: "https://keybase.io/michaelz",
    icon: "keybase",
    description: "Verify my other identities on Keybase",
  },
  {
    name: "LinkedIn",
    url: "https://linkedin.com/in/mzhang0",
    icon: "linkedin",
    description: "Connect with me on LinkedIn",
  },
];

export default links;
