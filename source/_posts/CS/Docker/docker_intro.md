---
title: Docker intro
date: 2017-05-10 
categories: Docker
type: asd
tag: docker 
---

## What and Why


## Installation
[install docker](https://docs.docker.com/engine/installation/)
Under ubuntu 16.04, run this command can install docker easily.
```
sudo apt update && sudo apt install docker.io
```


## Key components
* docker client
* docker server (daemon, dockerd, docker engine)
[details](https://diveintodocker.com/blog/understanding-how-the-docker-daemon-and-docker-cli-work-together)
* image (system images)
* container (carrier running images, to make the applications isolated from outside)
* registry (docker hub (docker.io), gcr.io, private registry)

## Docker command
* docker info
* docker version
* docker help
* docker logs
* docker search
* docker pull
* docker images
* docker rmi
* docker inspect
* docker run
* docker stop
* docker start
* docker ps -a
* docker rm
* docker exec / docker attach
* docker commit
* docker save    
[more info](https://docs.docker.com/engine/reference/commandline/docker/)

## Dockerfile: Script for building images
```
FROM ubuntu:latest

MAINTAINER xuntian "li.zq@foxmail.com"

RUN apt-get -y update && apt-get -y install nginx && apt-get clean && rm -rf /var/lib/apt/lists/*

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```
* Run nginx image
```
docker run -dti -p 80 xuntian/mynginxtest
docker run -dti -p 80 -v /root/nginx/www:/var/www/html xuntian/mynginxtest
```

## Dcoekr Registry
[details](https://github.com/NPLPackages/NplClusterManager/wiki/DockerRegistry)

## Docker daemon
* connect remote docker daemon
```
export DOCKER_HOST="tcp://121.14.117.229:2375"
```