---
title: 'Beats 7.5.0 on PFsense 2.4.4'
date: 2019-12-11
thumbnailImagePosition: left
thumbnailImage: /img/posts/2019/12/beats-7-5-0-on-pfsense/314799.jpg
coverImage: /img/posts/2019/12/beats-7-5-0-on-pfsense/314799.jpg
coversize: partial
coverMeta: out
metaAlignment: center
clearReading: true
categories:
- Homelab
- Elastic-co
tags:
- homelab
- security
- filebeat
- auditbeat
- metricbeat
- packetbeat
- elasticsearch
- elk
- kibana
- logstash
- elastic-co
showTags: false
showPagination: true
showSocial: true
showDate: true
comments: false
summary: "Long time wanting a beats client to PFsense which runs on FreeBSD, so lets compile it our self from source!"
---

There is always the option to send it via syslog, but it would be easier just using the beats to parse and send logs to a centralized logging platform. in this case a Hot-Warm elastic search cluster fronted by two Logstash machines (definitely overkill though).

## Initial Setup

So for this task i'll be using Vagrant in order to simple have a VM that i can build the beats from the git source.

Best way to install with current instructions is using the official [Vagrant Installation Guide](https://www.vagrantup.com/docs/installation/).

I'll be also using Virtual box as a provider.

### Vagrantfile

Vagrant deploys virtual machines by a Vagrant File specification. We are compiling to a FreeBSD 11.2 system which means that we'll also specify for vagrant to spin up such a box.

My Vagrant file looks like following, now you can certainly put it somewhere else, bu i just need the FreeBSD machine for this purpose, and will be destroyed after this compile hence putting it into /tmp.
```
root@ubuntu:~# mkdir freebsd-compile
root@ubuntu:~# cd freebsd-compile/^C
root@ubuntu:~# mkdir -p /tmp/freebsd-compile
root@ubuntu:~# cd /tmp/freebsd-compile/
root@ubuntu:/tmp/freebsd-compile# cat <<EOF > Vagrantfile
> Vagrant.configure("2") do |config|
> config.vm.box = "freebsd/FreeBSD-11.2-RELEASE"
> config.vm.box_version = "2018.06.22"
> end
> EOF
root@Valkyrie:/tmp/freebsd-compile# cat Vagrantfile
Vagrant.configure("2") do |config|
  config.vm.box = "freebsd/FreeBSD-11.2-RELEASE"
  config.vm.box_version = "2018.06.22"
end
root@Valkyrie:/tmp/freebsd-compile#
```

Good now that's all we need for our host system, lets start up the VM by using `vagrant up` in the vagrant file directory and wait.
```
root@ubuntu:/tmp/freebsd-compile# vagrant up
Bringing machine 'default' up with 'virtualbox' provider...
==> default: Importing base box 'freebsd/FreeBSD-11.2-RELEASE'...
==> default: Generating MAC address for NAT networking...
==> default: Checking if box 'freebsd/FreeBSD-11.2-RELEASE' version '2018.06.22' is up to date...
[... snip ...]
```

Now for me it did toss some errors trying to remote connect, but fear not. The machine is provisioned and started and we can now connect to it using `vagrant ssh`.

```
root@Valkyrie:/tmp/freebsd-compile# vagrant ssh
FreeBSD 11.2-RELEASE-p14 (GENERIC) #0: Mon Aug 19 22:38:50 UTC 2019

Welcome to FreeBSD!
[... snip ...]
vagrant@freebsd:~ % sudo su
root@freebsd:/home/vagrant # cd
root@freebsd:~ #
```

Now comes the compiling of beats. And for this chapter i actually want to give a very large kudos to [Jakommo](https://github.com/jakommo) who came up with it, but its too good not to have it drown in a [github issue.](https://github.com/elastic/beats/issues/1034#issuecomment-557276051)

## Package installation and Compilation

Now in order to succeed, we need a couple of packages installed into our VM.
```
root@freebsd:~ # pkg install git gmake go bash
Updating FreeBSD repository catalogue...
FreeBSD repository is up to date.
All repositories are up to date.
The following 25 package(s) will be affected (of 0 checked):

New packages to be INSTALLED:
    git: 2.23.0
    [... snip ...]
    cvsps: 2.1_2

Number of packages to be installed: 25
Proceed with this action? [y/N]: y

root@freebsd:~ #
```

Now we have all the dependencies in order to compile, lets get the code and checkout the correct version. (I deliberately removed a lot of the output as that is of no importance if it throws no errors)

```
root@freebsd:~ # go get github.com/elastic/beats
root@freebsd:~ # cd src/github.com/elastic/beats/
root@freebsd:~/src/github.com/elastic/beats # git checkout v7.5.0
Note: switching to 'v7.5.0'.
root@freebsd:~/src/github.com/elastic/beats # cd /filebeat
root@freebsd:~/src/github.com/elastic/beats/filebeat # gmake
root@freebsd:~/src/github.com/elastic/beats/filebeat # file filebeat
filebeat: ELF 64-bit LSB executable, x86-64, version 1 (FreeBSD)...
root@freebsd:~/src/github.com/elastic/beats/filebeat # ./filebeat version
filebeat version 7.5.0 (amd64), libbeat 7.5.0 ....
root@freebsd:~/src/github.com/elastic/beats/metricbeat # ./metricbeat version
metricbeat version 7.5.0 (amd64), libbeat 7.5.0 ....
root@freebsd:~/src/github.com/elastic/beats/metricbeat #
```

Now its just a matter of copy the filebeat binary to your pfsense and configure it according to the beats documentation.

Note: This also work for auditbeat, packetbeat and metricbeat. but would be a redundant wall of text showing all 4 binaries.

Again all credit goes to [Jakommo](https://github.com/jakommo) for writing the comment on Github.
