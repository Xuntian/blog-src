---
title: Docker Registry
date: 2017-05-11 
categories: Docker
type: asd
tag: docker 
---


* Start your registry
```
docker pull registry:2
docker run -d -p 5000:5000 --name registry registry:2
```

* Tag the image so that it points to your registry
```
docker pull ubuntu
docker tag ubuntu localhost:5000/myfirstimage
docker push localhost:5000/myfirstimage
```

* Stop your registry and remove all data
```
docker stop registry
docker rm -v registry
```

### Config your host so that it can pull docker images from your docker registry
New a file named daemon.json under /etc/docker/
```
{
"insecure-registries": ["121.14.117.251:5000"]
}
```