---
title: SSH
date: 2017-08-11 
categories: Linux
type: asd
tag: ssh 
---

## SSH service 
* install sshd 
```
apt-get install openssh-server
```
* configuration    
/etc/ssh/sshd_config
```
# Authentication:
LoginGraceTime 120
# PermitRootLogin prohibit-password
PermitRootLogin yes
StrictModes yes
```
<!--more-->

## Generate public key 
```
ssh-keygen -t rsa
```