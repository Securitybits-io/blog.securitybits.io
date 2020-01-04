---
title: 'SDL: Bolt on or Built in?'
date: 2018-03-03
thumbnailImagePosition: left
thumbnailImage: /img/posts/2018/03/sdl-bold-on-or-built-in/sdl-banner.jpg
coverImage: /img/posts/2018/03/sdl-bold-on-or-built-in/sdl-banner.jpg
coversize: partial
coverMeta: out
metaAlignment: center
clearReading: true
categories:
- security
- owasp
tags:
- opensamm
- security
- dev
showTags: false
showPagination: true
showSocial: true
showDate: true
comments: false
summary: "Time is of the essence. Every day that a business is anything less then fully secure is a day exposed to hackers. It's also another day that developers continue building applications without factoring security into their lifecycle."
---

Theres two strategies when you are developing, either you bolt on security, or you build it in. Lets start with defining those!

## Bolt on
Bolt on, its one of the remnants where the business part of a company is defining the purchase, implement and maintain of a product developed. By either restricting funding or time to market. Which is usually seen as a consequence of a Time-Quality-Material Triangle (TQM), and not a design goal of a application.
One of the the pitfalls of bolted on security, is management overhead and costs. This is one of the risks that are often invisible, as they are not put into the "initial cost-out" but rather the maintenance after the product been shipped.
Another reason that bolted on security exists is because developers today does not know how to properly do secure code, as well as they are not encouraged to learn.
Properly writing secure code does not however start with the developers, but usually a lot earlier and higher up into the organization. it takes a decision from management. After, a project and budget need to be setup in order to properly define a Secure Development Lifecycle (SDL) framework and later implementation into the development organization.

## Built in
In contrast to bolt on, where security usually comes in during or after a project has been shipped. Built in security is already defined even before an application is designed, by teaching the developers how to write secure code.
And already in the design phase of an application, security requirements are on a high level being formed. That means, security is already in the loop even before the first line of code, epic, sprint is finished.
To be able to properly build security into architecture and applications there must exist some corner stones of the framework.

#### Knowledge
It all starts with the architects or developers, so the organization should prioritize to setup a knowledge sharing program. Also start incentivize developers to learn secure coding practices.

#### Risk Analysis
Any new project should start with a solid risk analysis, but also if a finished product undergoes major changes. The outcome of that analysis should at least answer; classification of the information, the context of the risk, identification and assessment, mitigation and how to monitor. This should be done from a Business point of view, as it is that part of the organization that will probably own the final product, and therefor be responsible. The analysis should then be directly fed into the security requirements, which will establish a security baseline. and the information classification should be supported by the organizations information security guidelines.

#### Development
Developers usually don't go in blind and come up with a plan after the code is finished. Usually there is some high level structure, like functional and non functional requirements. The same principle applies when adding in security requirements, where they define some form or function of an application, of what is acceptable or not. Before deploying the product a security focused developer together with a architect should go through all the functional-, non functional- and security requirements, to get a final check that the finished product fulfills the requirements in a satisfactory way.

#### Deployment
Now deploying a application should always start with either an internal or external PenTest, this can be done by outsourcing, or have staff in house to perform it. Continuous automated security scans should also be done and the results should be reported to the development team, there's several hosted open source tools that can perform this task quite easily, as well as SaaS Applications since Cloud is a thing nowadays.

## Secure Development Lifecycle
Now hopefully OWASP[^1] needs no introduction, but their project OpenSAMM[^2] might.
... to be continued...

[^1]: [www.owasp.org](www.owasp.org)
[^2]: [www.opensamm.org](http://www.opensamm.org/)
