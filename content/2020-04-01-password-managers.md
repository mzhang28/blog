+++
title = "password managers"
date = 2020-04-01

[taxonomies]
tags = ["computers", "things-that-are-good", "privacy"]
+++

Password managers are programs that store passwords for you. With the number of accounts you keep on the web, you generally don't want to store all of them in your head. If you want to see articles on why you should use a password manager NOW, search "reasons to use a password manager" online and any of the articles you find should explain it. Here I'll add some more commentary on top of the traditional arguments.

<!-- more -->

Don't tick the "Remember master password box" no matter what
---

How well you remember a password depends on how much you use it. If you open an account, make a password, and stay signed in for a year without ever having to re-login, you'll naturally forget the password. Same deal with password managers; the problem has just been moved another step.

The power of a password manager comes from you continually entering in the same password over and over in order to unlock your other accounts.

Password managers are good for a lot more than passwords
---

If you're willing to put sensitive passwords into your password manager, it should be a perfect place to put information that you'd want to avoid writing down in plaintext but want to access easily. This might include:

- Backup / recovery codes
- Your bank account number
- Your car's license plate number
- Answers to security questions, which leads into the next point:

Treat your security questions as passwords
---

Save these in your password manager! "Security" questions are probably the worst idea for security and are more likely to weaken the security of your account than strengthen it. They have multiple fatal flaws (assuming you use security questions truthfully):

- People can find out simple information about you through social engineering (favorite color, mother's maiden name, schools, etc.)
- The answers to these questions aren't likely to change, and some can't be changed at will (in the case of a security problem, for example)
- You probably won't even remember the exact format you typed in the answer, so if there's any fuzzy matching, it means the answers aren't hashed and salted to the same degree as passwords.

Instead, just treat them as another password! Go into your password manager, generate the longest possible random password that fits into the box, and save it. Since you can give a name to the password, there's no worry of forgetting it or losing it, since it'll be stored among the vault of other passwords that you're hopefully using every day.

Don't trust extensions that fill in your password automatically
---

Some password managers, like LastPass, have browser extensions that automatically fill in password boxes when you open the page.

**Always turn this off, if possible. Prefer to look up the password and copy it in.**

Once the extension copies the password into the page, it's fair game for any other JavaScript running on the page to grab your password. Not only that, there have been multiple reported vulnerabilities related to the LastPass extension mistakenly copying in a password because it couldn't correctly match the domain of the page to the domain of the password. Additionally, it doesn't work well if you have multiple passwords saved to the page, like if you have security questions saved to the page.
