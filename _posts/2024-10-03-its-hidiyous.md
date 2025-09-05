---
layout: post
current: post
logo:
cover: assets/images/posts/2024/10/its-hidiyous/banner.jpg
navigation: True
title: 'Its HiDIYous'
date: 2024-10-03
tags: 
  - redteam
  - hardware
class: post-template
subclass: 'post'
author: christoffer
---

> Its HiDIYous, but it works!...

HiDIYous was an internal project, that came about when we needed a USB implant that acted like a Human Interface Device (keyboard). The only issue was that the organization we where testing had a security posture that made it impossible to use any over the counter devices (Hak5 Rubberducky, OMG Cable etc.). This spawned the idea that I should design my own, that should be robust, easy and have a really small footprint so that it can be implanted into a lot of different host devices.

## What is a Human Interface Device (HID)

A HID is any peripheral device that allows humans to interact with a computer by sending input data. Common examples include keyboards, mice, and game controllers. HIDs are trusted by operating systems by default, which means that they don’t require special drivers to function. This trust is central to how devices like the USB Rubber Ducky and the OMG Cable are able to exploit systems. These tools leverage the inherent trust computers place in HID devices to launch keystroke injection attacks. In this context, the HID protocol becomes a potential vector for delivering malicious commands, all while masquerading as a harmless device.

The HiDIYous project take advantage of this by pretending to be standard keyboards, which allows them to execute commands or inject scripts once plugged into a target machine. This tool highlight a fundamental flaw in how computers trust HIDs, showcasing how these devices can be repurposed to bypass security measures and gain unauthorized access to systems.

## Howto?
So next  question is how do you get one? I published a Git Repo with all the instructions and files needed which can be found here:
[https://github.com/Securitybits-io/HiDIYous.git](https://github.com/Securitybits-io/HiDIYous.git)

The repo also contains instructions on how to build and create your first implant.