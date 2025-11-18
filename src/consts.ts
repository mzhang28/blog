import type { Metadata, Site, Socials } from "@types";

export const SITE: Site = {
  TITLE: "Michael Zhang",
  DESCRIPTION: "Michael is a PhD student at Northeastern University.",
  EMAIL: "inbox@mzhang.io",
  NUM_POSTS_ON_HOMEPAGE: 5,
  NUM_PROJECTS_ON_HOMEPAGE: 3,
};

export const HOME: Metadata = {
  TITLE: "Home",
  DESCRIPTION: "Michael is a PhD student at Northeastern University.",
};

export const BLOG: Metadata = {
  TITLE: "Blog",
  DESCRIPTION: "A collection of articles on topics I am passionate about.",
};

export const PROJECTS: Metadata = {
  TITLE: "Projects",
  DESCRIPTION:
    "A collection of my projects with links to repositories and live demos.",
};

export const SOCIALS: Socials = [
  // {
  //   NAME: "X (formerly Twitter)",
  //   HREF: "https://twitter.com/boogerbuttcheek",
  // },
  {
    NAME: "GitHub",
    HREF: "https://github.com/mzhang28",
  },
  // {
  //   NAME: "Website",
  //   HREF: "https://trevortylerlee.com",
  // },
];
