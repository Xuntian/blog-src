---
title: App Logs in K8s Cluster
date: 2018-09-12
categories: 
- k8s
- log
tag: 
- k8s 
- log 
- elk 
---

近期实践了在k8s集群内对各个应用的日志处理，起因是开发那边反应服务器环境调试的时候查看日志特别麻烦，毕竟在开发本地毫无问题的代码在服务器上没有bug的概率还是比较低的。之前也有上elastic技术栈的计划，但是做得并没有那么完善。    

### 介绍
在k8s集群中，可以将日志简单得分为三类：节点级别日志、集群级别日志和运行在集群内的应用日志，这里仅仅实践了集群内的应用日志。     
elastic技术栈的大致架构为： app ---> filebeat（fluenetd,logstash） ---> elasticsearch ---> kibana    
在CICD流程中自动化部署的服务上线后，日志收集工具实时监听应用的日志信息，并将日志推送到elasticsearch，开发就可以在kibana上搜索到日志，考虑到logstash过于庞大，则用轻量级的filebeat替代     

<!--more-->
![k8s-app-log](./k8s-app-log.png)


一般说来，收集应用日志有以下三种做法：
1. 在集群中每个节点运行一个filebeat的pod，因为运行在节点上的容器会将控制台的标准输出保存在/var/lib/docker/containers目录下，因此只需将该目录以volume的形式挂载在日志收集组件的pod里
2. 在每个应用的pod里加一个filebeat容器，用volume把应用容器里的日志文件共享到filebeat容器里
3. 在每个应用的容器里加一个filebeat服务，直接本地读取日志文件

第一种做法最简单便捷，实验下来发现读取到的日志有遗漏，而且有一些无关的日志，于是我采取的是第二种做法

### 实验要点
> 制作filebeat的docker镜像
```
FROM debian:jessie

RUN mkdir /opt/filebeat
WORKDIR /opt/filebeat
RUN apt update -y && apt install -y wget && \  
  wget https://artifacts.elastic.co/downloads/beats/filebeat/filebeat-6.4.0-linux-x86_64.tar.gz -O filebeat-6.4.0-linux-x86_64.tar.gz && tar zxvf filebeat-6.4.0-linux-x86_64.tar.gz && \  
  rm -rf filebeat-6.4.0-linux-x86_64.tar.gz && \  
  apt-get purge -y wget && \
  apt-get autoremove -y && \
  apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*
RUN mv ./filebeat-6.4.0-linux-x86_64/* ./ && mv filebeat /usr/local/bin/
COPY filebeat.yml /opt/filebeat/filebeat.yml
CMD filebeat
```

> 部署pod
```
apiVersion: v1
kind: Pod
metadata:
  name: test-logstash
spec:
  containers:
  - name: egg-example
    image: 10.28.18.13/xuntian/egg-example
    imagePullPolicy: IfNotPresent
    volumeMounts:
    - name: app-logs
      mountPath: /root
  - name: filebeat
    image: 10.28.18.13/xuntian/filebeat:6.4
    imagePullPolicy: IfNotPresent
    volumeMounts:
    - name: app-logs
      mountPath: /root
  volumes:
  - name: app-logs
    emptyDir: {}
```

简单地用egg.js写了一些测试接口，打包成docker镜像，部署时加上filebeat的容器，监听egg-example项目的日志，最终可以看到egg-example项目的日志被完整地读取并写入es中。