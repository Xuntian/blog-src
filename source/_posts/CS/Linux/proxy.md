---
title: Proxy
date: 2016-12-10 
categories: Linux
type: asd
tag: proxy 
---


### git proxy config  
```
git config --global http.proxy http://www:1234567@192.168.1.106:8080    #设置代理
git config --global http.proxy      #查询代理
git config --global --unset http.proxy     #取消代理
```

一、代理上网：  
方法一    
这是一种临时的手段，如果您仅仅是暂时需要通过http代理使用apt-get，您可以使用这种方式。  
在使用apt-get之前，在终端中输入以下命令（根据您的实际情况替换yourproxyaddress和proxyport）。  
终端运行exporthttp_proxy="http://用户名:密码@代理IP:代理端口"也可  
<!--more-->
   
方法二   
这种方法要用到/etc/apt/文件夹下的apt.conf文件。如果您希望apt-get（而不是其他应用程序）一直使用http代理，您可以使用这种方式。   
注意：某些情况下，系统安装过程中没有建立apt配置   
文件。下面的操作将视情况修改现有的配置文件或者新建配置文件。  
sudo gedit /etc/apt/apt.conf   
在您的apt.conf文件中加入下面这行（根据你的实际情况替换yourproxyaddress和proxyport）。   
Acquire::http::Proxy “http://yourproxyaddress:proxyport/”;（这一行输入的时候注意，Proxy这个词和后面的“有空格，并且端口后面应该有/，并且注意如果直接把这句话拷贝过去，一定要把引号换成英文的。还有末尾的分号不要忘记。）   
保存apt.conf文件。  
方法三   
这种方法会在您的主目录下的.bashrc文件中添加两行。如果您希望apt-get和其他应用程序如wget等都使用http代理，您可以使用这种方式。   
gedit ~/.bashrc    
在您的.bashrc文件末尾添加如下内容（根据你的实际情况替换yourproxyaddress和proxyport）。   
http_proxy=http://yourproxyaddress:proxyport   
exporthttp_proxy   
保存文件。关闭当前终端，然后打开另一个终端。   
使用apt-getupdate或者任何您想用的网络工具测试代理。我使用firestarter查看活动的网络连接。   
如果您为了纠正错误而再次修改了配置文件，记得关闭终端并重新打开，否自新的设置不会生效。  


## stunnel
```
FROM ubuntu:precise

MAINTAINER Courtney Couch, courtney@moot.it

RUN echo "deb http://archive.ubuntu.com/ubuntu precise main universe" > /etc/apt/sources.list
RUN apt-get update
RUN apt-get upgrade -y

RUN apt-get -y install build-essential wget
RUN apt-get -y install openssl libssl-dev

ENV STUNNEL_VERSION 4.56

RUN wget -O - ftp://ftp.stunnel.org/stunnel/archive/4.x/stunnel-$STUNNEL_VERSION.tar.gz | tar -C /usr/local/src -zxv

RUN mkdir -p /stunnel
VOLUME ["/stunnel"]

ADD stunnel.conf /stunnel/stunnel.conf
ADD stunnel.pem /stunnel/stunnel.pem

# Build stunnel
RUN cd /usr/local/src/stunnel-$STUNNEL_VERSION && ./configure && make && make install

EXPOSE 443

CMD ["/usr/local/bin/stunnel", "/stunnel/stunnel.conf"]
```

## shadowsocks
```
docker run -d -p 1984:1984 oddrationale/docker-shadowsocks -s 0.0.0.0 -p 1984 -k $SSPASSWORD -m aes-256-cfb
```

