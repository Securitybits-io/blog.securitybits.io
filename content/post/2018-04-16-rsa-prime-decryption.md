---
title: 'RSA Prime Decryption'
date: 2018-04-16
thumbnailImagePosition: left
thumbnailImage: /img/posts/2018/04/rsa-prime-decryption/rsa-prime-banner.jpg
coverImage: /img/posts/2018/04/rsa-prime-decryption/rsa-prime-banner.jpg
coversize: partial
coverMeta: out
metaAlignment: center
clearReading: true
categories:
- Hackthebox
- CTF
- Development
tags:
- htb
- hackthebox
- dev
- ctf
showTags: false
showPagination: true
showSocial: true
showDate: true
comments: false
summary: "Description and usage of a decryption script that I wrote for CTF Challenges."
---

So I've encountered this problem in a couple Capture the Flag Challenges, where you are given the Primes, as well as a ciphertext in decimal number form.
```text
c = 95272795986475189505518980251137003509292621140166383887854853863720692420204142448424074834657149326853553097626486371206617513769930277580823116437975487148956107509247564965652417450550680181691869432067892028368985007229633943149091684419834136214793476910417359537696632874045272326665036717324623992885
p = 11387480584909854985125335848240384226653929942757756384489381242206157197986555243995335158328781970310603060671486688856263776452654268043936036556215243
q = 12972222875218086547425818961477257915105515705982283726851833508079600460542479267972050216838604649742870515200462359007315431848784163790312424462439629
dp = 8191957726161111880866028229950166742224147653136894248088678244548815086744810656765529876284622829884409590596114090872889522887052772791407131880103961
dq = 3570695757580148093370242608506191464756425954703930236924583065811730548932270595568088372441809535917032142349986828862994856575730078580414026791444659
```
Lets take "PicoCTF - Weird RSA flag"
Now had these primes been sufficiently small, we could do the decryption of the cipher text manually. But having Prime numbers that are 150+ chars long will make it (at least for me rather difficult).  
The Python script can be found at my Github-Repo [Securitybits-io](http://https://github.com/Securitybits-io/RSA-Primes---Chinese-Remainder-Theorem).  
Using it is fairly simple, as it has a help section, try it with the above primes to verify the results.
I did not invent the Chinese Theorem or the RSA Algorithm. But merely implemented them, if you are further interested in the algorithm and techniques behind. Then i recommend to spend an hour reading the wiki page as well as the other two links i put under "References".
```bash
root@Kali:~# python rsa-prime-decryption.py --help
usage: rsa-prime-decryption.py [-h] [--p P] [--q Q] [--dp DP] [--dq DQ] [--c C]

Decryption tool for RSA Primes using the Chinese Remainder Theorem

optional arguments:
  -h, --help  show this help message and exit
  --p P       Input prime p used for RSA decryption
  --q Q       Input prime q used for RSA Decryption
  --dp DP     Input Chinese Remainder dp used for RSA decryption
  --dq DQ     Input Chinese Remainder dq used for RSA Decryption
  --c C       Input Cipher text to decrypt
```
```bash
root@kali:~# python rsa-prime-decryption.py \
--p 11387480584909854985125335848240384226653929942757756384489381242206157197986555243995335158328781970310603060671486688856263776452654268043936036556215243 \
--q 12972222875218086547425818961477257915105515705982283726851833508079600460542479267972050216838604649742870515200462359007315431848784163790312424462439629 \
--dp 8191957726161111880866028229950166742224147653136894248088678244548815086744810656765529876284622829884409590596114090872889522887052772791407131880103961 \
--dq 3570695757580148093370242608506191464756425954703930236924583065811730548932270595568088372441809535917032142349986828862994856575730078580414026791444659 \
--c 95272795986475189505518980251137003509292621140166383887854853863720692420204142448424074834657149326853553097626486371206617513769930277580823116437975487148956107509247564965652417450550680181691869432067892028368985007229633943149091684419834136214793476910417359537696632874045272326665036717324623992885
Theres_more_than_one_way_to_RSA
```

**References**:  
RSA Cryptosystem  
https://en.wikipedia.org/wiki/RSA_(cryptosystem)  
Decrypting RSA using CRT  
http://www.cscjournals.org/manuscript/Journals/IJCSS/Volume10/Issue5/IJCSS-1289.pdf  
Modular inverse example  
https://stackoverflow.com/questions/4798654/modular-multiplicative-inverse-function-in-python
