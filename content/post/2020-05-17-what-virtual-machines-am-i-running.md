---
title: 'What Virtual Machines Am I Running?'
date: 2020-05-17
thumbnailImagePosition: left
thumbnailImage: /img/posts/2020/05/what-virtual-machines-am-i-running/header.png
coverImage: /img/posts/2020/05/what-virtual-machines-am-i-running/header.png
coversize: partial
coverMeta: out
metaAlignment: center
clearReading: true
categories:
- Homelab
- Elastic-co
- VirtualMachines
tags:
- homelab
- security
- elasticsearch
- elk
- kibana
- logstash
- elastic-co
- radarr
- sonarr
- vmware
- esxi
showTags: false
showPagination: true
showSocial: true
showDate: true
comments: false
summary: "Every server that i run in my homelab is more then often a virtual machine, and heres the run down!"
---
{{< alert info >}}
**Disclaimer, this is subject to change... very often and very quickly!**
{{< /alert >}}  

{{< wide-image src="/img/posts/2020/05/what-virtual-machines-am-i-running/home_network-securitybits.png" title="The 'current' network architecture" >}}

To start off everything that you can see is running under ESXi-6.7 on my VRTX, which is managed by vCenter-6.7. Though this will soon be upgraded to 7.0 as soon as VMware releases 7.0u1.

## Hypervisor
### Dell VRTX (Aegir)
This is my main hypervisor server, basically a homelab in a box! the nifty thing about the VRTX is that you do have the storage as well as 4 blades in one 5u package! This makes it really convenient, although you kinda miss out on all the good homelab life, in regards to multiple rack servers and networking.

#### Blades
Theres two sets of blades with identical hardware:  
**Eldir-01 / 02**  
Dell M520  
Xeon E5-2420v2  
64GB DDR3 ECC-Dual  
2x Seagate 146GB 15k SAS  
**Eldir-03 / 04**  
Dell M520  
2x Xeon E5-2407  
44GB DDR3 ECC Dual Rank  
#### VM Storage  
The VRTX comes with 25 2,5" SAS Disk shelf! which makes it possible to have up 48TB of storage shared between the 4 blades!  
Currently I have 9 drives, with 8 of them spanned in a Raid50 for 3,3TB and one in hot spare (in case one drive would break it would automatically re-silver).

## Fileserver
### Dell R510
Now this server started off as a 10gig file server that where used to store shared VMs, back when i ran multiple 2u rack servers.  
But the specs are quite simple  
Single Xeon E5620  
32GB DDR3 ECC Ram  
12x 4tb Seagate Constellation Es.3 (Main storage)  
2x 240GB WD Green SATA SSD (SLOG)  

## Virtual Machines
Now that we got that out of the way, lets dive into the meat of this post.
I've split my VMs into a few different subnets to keep them organized!

## VMWare
### vCenter
{{< image classes="fancybox center" src="/img/posts/2020/05/what-virtual-machines-am-i-running/vcenter_screenshot.png" title="vCenter Dashboard" >}}

4 vCPU/16GB RAM/~200GB Disk  
My vCenter is the main control hub for my homelab and its VMs, where all the provisioning happens, as well as the internal vmware network. It's chomping RAM like nobody's business, but it is necessary as i do not want to switch to Proxmox or Xen server.

## Private
My Private stack is where I put the VMs that I do not want to have direct internet access and mainly where I put internal services.

### SaltStack
{{< image classes="fancybox center" src="/img/posts/2020/05/what-virtual-machines-am-i-running/SaltStack-logo.png" title="SaltSTack Logo" >}}

2 vCPU/2GB Ram/100GB Disk  
Many people have probably heard of puppet, chef and ansible... but maybe not [SaltStack](https://saltstack.com). It works by a master-minion system, this is the master, and on each linux VM there is a minion process running. You can also use salt-ssh, which makes it login and run commands, which works, but you loose some of the functions such as the reactor-bus etc. which define actions/states that the minion will perform on changes. Now there's a rather big debate on what orchestration tool that you should use. Granted there is a lot that's already made for ansible, and it is popular and more heard of as well. The reason that i fell down into SaltStack is that i found it had all the features that i wanted from ansible, and then some. Suffice it to say that all the following virtual machines are provisioned to my vCenter using Salt-Cloud.

### SIEM / Network logging solution
{{< image classes="fancybox center" src="/img/posts/2020/05/what-virtual-machines-am-i-running/Elastic-Stack.png" title="Elastic-Stack Architecture" >}}

Now this setup might warrant some comments about "overkill" (and probably its own post), but safe to say is that i am a huge elastic-stack fan. My cluster is a Hot-Warm architecture, with the addition of, if i ever need to, also do cold storage. Each of the nodes are properly secured, which isn't the easiest task. All the log transfer, rotation etc. are being done by either syslog, or beats. I do run the whole suite of beats:
- Filebeat, for every relevant file based log.
- Auditbeat, security events such as file changes, user logins or processes.
- Packetbeat, packets and netflow.
- Metricbeat, I used to run a influxdb and grafana, but recently switched to metricbeat for convenience.  

#### SIEM Elasticsearch Master
2 vCPU/4GB Ram/32GB Disk  
The Elastic-stack Master nodes are the glue that holds the cluster together, and if you didn't know... they LOVE ram! Now why 3 you might ask? Split-brain syndrome! 3 is the recommended minimum number in order to not have a split-brain syndrome, which happens when you have an even number of masters and what might happen is a 2 sided argument where both sides are even. In order to tip the scale Elastic recommends that you have an uneven number of nodes. Luckily the master nodes are usually not the largest VMs that you have so it doesn't hurt to have 3 or 5 depending on the use case. Also note that these are __only__ responsible for the Mastering of the other nodes, so they are not responsible for ingesting data, storing data or manipulating data.

#### SIEM Elasticsearch Hot
4 vCPU/6GB Ram/250GB Disk  
The "Hot" nodes have two main functions, ingesting logs, and storing a couple days of logs, on several shards on the hot nodes. These usually reside on SSD storage and are the main nodes in the cluster that handles searching the most relevant data. Depending on your lograte you might want to have it on SSDs and on 10gig network. In my environment i have ~300events / second, and a daily index is around 10-25GB, and a daily index is held on a hot node for 14 days before its rotated to a warm node.

#### SIEM Elasticsearch Warm
4 vCPU/6GB Ram/250GB Disk  
A warm node is only responsible for searching data, and storing data long term. These nodes are usually on a regular spinning disk as that kind of storage are cheaper, and a user does not generally hit the warm indexes as often as the hot ones. For my setup, depending on the index i keep for example my Filebeat (syslog) for 90days, which may seem long, but mangling data is kind of fun!

#### SIEM Logstash
2 vCPU/2GB Ram/32GB Disk  
Now other Elastic-Stack purists might yell at me for running beats through logstash. But i have some reasons, mainly i like to have one interface for ingesting logs! I do run SNMP fetching, syslog mangling, ingesting iDRAC logs etc. to my logstash, which would just makes the firewall rules easier to manage as it only exposes the logstash ports externally from the cluster! Doing it this way also load balances the lograte rather nicely.

#### SIEM Kibana
4 vCPU/4GB Ram/32GB Disk  
Every logging solution, wether it be influx, nagios etc. need a front end. Elastic-Stacks solution is Kibana, this also contains apps such as Development tools for API-calls, SIEM detection, Health metric visualization etc.  

{{< image classes="fancybox center" src="/img/posts/2020/05/what-virtual-machines-am-i-running/kibana_dashboard.png" title="Kibana Metricbeat Dashboard" >}}

### PHP Ipam
1 vCPU/1GB Ram/32GB Disk  
Since I like organization, this was one of the best VMs that i could create. As this allows me to have my IP address space organized also makes it easy to look up where i have free addresses for new projects.

### Gitlab runner
2 vCPU/2GB Ram/250GB Disk  
This is actually the only docker host that i have, and is a companion to my gitlab server. This is responsible to run the pipelines in docker containers that are defined in gitlab. wether it can be to build malware stubs or compile malicious binaries (Yeah I'm a pentester, what did you expect).

### Plex server
4 vCPU/4GB Ram/100GB Disk  
This is my only plex server for movies and tv-series. Since i travel 2-3 days sometimes, making hotel rooms boring! so this is accessible for me using my plex account. All the media is stored on Yggdrasil(NAS) and accessed over SMB.

### Transmission
A torrent client with a WebUI, which is running over a VPN.... for Linux ISOs...

### Tautulli
This one provides me some monitoring and statistics on movies and series on the Plex media server. This is not being used so much, but graphs are fun!

### Radarr
A VM which will organize and keep track of all your Movies, and also hooks into the download client so that it gets the highest quality.

### Sonarr
It's a similar too as Radarr, but for TV Shows, keeping track of your episodes and series automatically.

### Bazarr
Bazarr hooks up to your Radarr and Sonarr, and will download the correct subtitles for your specific languages and media!

### Jackett
Jackett hooks into the Radarr and Sonarr VMs and just adds different trackers, and more options for finding the correct media.


## Public / DMZ
This segment is where i put all my public facing applications, with rather strict firewall rule set which is based on host to host traffic.

### Ombi
This is a self hosted application where users can create requests for plex.

### Apache WebCalendar
I am a member of a local rock climbing community, and have been for the last couple years hosted a small php web application for smartphones, which displays the club activities the coming 2 weeks in a nice format.

### Gitlab
{{< image classes="fancybox center" src="/img/posts/2020/05/what-virtual-machines-am-i-running/GitLab-Logo.jpg" title="GitLab Logo" >}}

2 vCPU/4GB Ram/250GB Disk  
Everyone needs somewhere to store their source code, this gitlab instance is responsible to house my own projects which i do not want to have on any other SaaS solution (Github). I do a lot of security research, writing malware etc. for professional use. Working as a pentester and Security Researcher I hate going out and compromising a client (on purpose and with authorization), and my malware is detected by signatures or even before execution time. Before I started hosting my own gitlab, I did a test with creating a unseen custom backdoor, tested on a fully updated windows 10, upload it to a private repo, wait for a week and retest it on a __fresh__ windows 10 instance... detected, while yes it was not a 'state of the art' malware, but it was enough for me to question where i should store my research. Remember, the cloud is just someone else computer. I also store all the states and maps for SaltStack on my Gitlab, which makes it accessible even if my internet dies.

### Nginx Reverse Proxy
A simple reverse proxy for my different web services, nothing that's out of the ordinary. This VM also handles Lets Encrypt TLS Certificates.


## Malware
Now for the fun stuff, my malware net is the most restrictive net that i have, basically only accessible from a VPN and only have a outbound monitored internet connection. This is also the Segment that have the VMs in highest rotation, for good reason. Its purpose is basically a safe place to detonate malware and reverse live samples.
### GooseFlare
4 vCPU/8GB Ram/80GB Disk  
There's always 1-3 instances of FireEYEs Flare VM available in this net for malware research. If you haven't heard of [FlareVM](https://github.com/fireeye/flare-vm) it's a simple setup script for a windows VMs that contains most of all tools you'll need in order to reverse engineer a malware. The script is actively maintained by pull requests and FireEYE, highly recommended if you are interested in reverse engineering.


## GooseDev
Much like the Malware segment, I have a segment for developing malware. I will put up another blog post specifically on this network and its hosts but the general idea is to have a network with hosts that have different AVs installed  and block by GPO and in the network firewall malware submissions to the mother ship.
### GooseDev
4 vCPU/8GB Ram/150GB Disk  
A simple windows 10 Pro host, with Python and visual studio installed. Since a lot of malwares and C2 framework have moved on from Powershell into a more unmonitored .NET and Powershell-Less execution, there was a need to have a development machine which was easily restored to an original state when a project was completed, so that there was no lingering artifacts. During Red-Team engagements this is also a Lab which goes through heavy modifications whenever we learn something new from the client, in order to mimic our target environment as good as can be to come out successful in the end. My current project is .NET DLL injections into memory for which I'm doing a small write up, stay tuned!
### GooseTarget
2 vCPU/4GB Ram/60GB Disk  
A standard windows 7/8/10 VM which is usually as default as can be, with the only modification is that i turn off sample submissions in the Group Policy so that i don't burn my applications pre-engagement.

## GooseLab
Much like GooseDev subnet there's GooseLab, which is more of a static environment and a small domain playground to test new attacks and applications in a more controlled domain. Whats currently missing is actually a logging solution, which will probably be another Elastic-Stack and Winlogbeat.
### GooseSQL
2 vCPU/4GB Ram/40GB Disk  
Simple SQL Server with one database defined at the moment. Used for Authentication and some basic data storage for GooseWeb.
### GooseWEB
2 vCPU/4GB Ram/40GB Disk  
IIS Server that runs a small inventory management application connected to the SQL Database for authentication and data storage.
### GooseDC
2 vCPU/4GB Ram/40GB Disk  
Domain controller for the domain "Goose.Lab" 20 users with different degrees of access. There's also some small special case configurations in GPO, Groups and auth schemes which makes for an interesting Saturday evening of hacking.

## Finishing up
Now people might ask "But what about docker or kubernetes?", And yes valid questions, but right now I don't really have the time to dig into a completely new architecture! Although i do run a couple of Docker containers for CTFs and for some tooling at work but i haven't not taken the step to host things of it. Also right now i have vCenter which gives me a rather solid single pane of glass on my environment, i do not feel like i would enjoy having multiple management console.  
One might also ask where this blog is hosted? Actually it is on Github-Pages together with a small actions script which runs every time i make a push to the blog branch. If you want you can clone and repurpose the repo for your own blog, you can find the repo here: [Securitybits Github](https://github.com/Securitybits-io/blog.securitybits.io)  
If you have read this far, Good job! and thank you, if you have any questions don't hesitate to contact me! Or put in a GitHub issue if you come up with a topic.
