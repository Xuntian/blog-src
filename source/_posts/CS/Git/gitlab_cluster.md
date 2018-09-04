---
title: Gitlab Cluster
date: 2017-06-01 
categories: 
- CS
- application
- gitlab
tag: gitlab
---

# Gitlab集群

## 总体架构
总共架构由5部分组成
* Postgresql
* Redis
* Gitlab
* NFS
* LB

![Configuration](https://docs.gitlab.com/ce/administration/img/high_availability/active-active-diagram.png)
<!--more-->

## Redis
Gitlab官网上的文档说到的方案是搭建一个稳定高可用性的Redis集群，我在这里做了简化，只用docker搭建了单个节点的Redis服务
```
docker run -dti --name redis -p 6379:6379 redis
```
Redis服务的主机IP和端口号将在gitlab配置中用到

## Postgresql
Posstgresql服务是利用postgresql官方提供的docker镜像搭建的，执行命令如下
```
docker run --name db -dti -p 5432:5432 -e POSTGRES_PASSWORD=123456 -e POSTGRES_USER=gitlab postgres
```
Postgresql服务的主机IP，端口，数据库用户名，数据库名称和密码也将在gitlab的配置中用到
* 注：这里postgresql镜像使用的postgresql版本建议和下面使用到的gitlab自带的postgresql数据库版本一致，方便之后的数据迁移

## Gitlab
根据需求，使用了Gitlab最新版本的官方docker镜像在不同的主机上搭建gitlab服务，最新版本为gitlab:9.4.2
* 首先在host1新建一个文件夹/root/git-data,用作运行在docker上gitlab容器的数据卷,该数据卷存储的是gitlab中repositories的数据
```
docker run --detach \
    --publish 80:80 \
    --name gitlab4 \
    --restart always \
    --volume /root/git-data:/var/opt/gitlab/git-data \
    gitlab:9.4.2
```
* 运行gitlab的docker镜像之后，等待一两分钟gitlab将会启动配置好，将可以在host1在80端口访问gitlab等登录界面。之后docker exec 进入容器，编辑/etc/gitlab/gitlab.rb配置文件，如下
```
gitlab_rails['db_adapter'] = "postgresql"
gitlab_rails['db_encoding'] = "unicode"
gitlab_rails['db_database'] = "gitlab"
gitlab_rails['db_pool'] = 10
gitlab_rails['db_username'] = "gitlab"
gitlab_rails['db_password'] = "123456"
gitlab_rails['db_host'] = "{ip}"
gitlab_rails['db_port'] = 5432
gitlab_rails['redis_host'] = "{ip}"
gitlab_rails['redis_port'] = 6379
gitlab_rails['redis_database'] = 0
postgresql['enable'] = false
redis['enable'] = false
nginx['enable'] = true
nginx['redirect_http_to_https'] = true
```
/etc/gitlab/gitlab.rb配置文件中的Redis和Postgresql信息应该与之前搭建的服务一致，之后运行以下命令配置gitlab服务
```
gitlab-ctl reconfigure
```
* 之后可以在更多的主机上按照以上步骤搭建gitlab服务，比如host2，host3。每一个主机上的gitlab服务都共用Redis和Postgresql,因此可以保证账户，密码和配置数据的一致，但是gitlab还有repositories数据是存放在/var/opt/gitlab/git-data文件夹下的，也就是宿主机的数据卷/root/git-data中，所以我们还需要对每台主机上的/root/git-data/文件夹做数据同步，这里我们搭建NFS来实现

## NFS服务
我们利用NFS服务实现多台主机上的文件同步, 可以任选一台搭建了gitlab服务的主机作为NFS Server，并将该主机上的/root/git-data文件夹对其他主机exports,供其他主机的文件系统挂载到NFS Server这台主机上的/root/git-data文件夹，从而实现文件同步
* 在NFS Server主机上安装nfs server服务

```
apt-get update
apt-get install nfs-kernel-server  # install nfs server

chown nobody:nogroup /root/git-data   # modify dir owner

```
* 编辑nfs server配置文件/etc/exports

```
/root/git-data  *(rw,sync,no_root_squash,no_subtree_check)
```
\* 表示任意主机，rw表示读写读写权限，sync表示文件修改将写入硬盘，no_subtree_check禁止子文件夹检查，no_root_squash禁止客户端的root用户在服务器端使用root权限
* 重启nfs-kernel-server服务

```
service nfs-kernel-server restart
```
* 在nfs clinet主机上安装nfs 客户端程序

```
apt-get update
apt-get install nfs-common
```
* 将nfs client主机上的文件夹挂载到nfs server主机上需要文件同步的文件夹上

```
mount {nfs-server-ip}:/root/git-data /root/git-data
```

## Gitlab数据备份与恢复
* 备份

```
gitlab-rake gitlab:backup:create

Or
docker exec -t <container name> gitlab-rake gitlab:backup:create
```
* 恢复

```
cp 1493107454_2017_04_25_9.1.0_gitlab_backup.tar /var/opt/gitlab/backups/  # put baskup file under given dir

gitlab-ctl stop unicorn
gitlab-ctl stop sidekiq
gitlab-ctl status

gitlab-rake gitlab:backup:restore BACKUP=1493107454_2017_04_25_9.1.0
gitlab-ctl start
gitlab-rake gitlab:check SANITIZE=true
```

## 负载均衡
* 编辑nginx配置文件/etc/nginx/nginx.conf    

```
upstream myapp {
    server {ip}:8080;
    server {ip}:5432;
}

server {
    listen 80;
    server_name {ip};
    location / {
        proxy_set_header HOST $http_host;
        proxy_set_header X-Forwarded-For $remote_addr;
        proxy_pass http://myapp;
    }
}
```

## 遇到的问题
1. 清除redis缓存     

```
gitlab-rake cache:clear RAILS_ENV=production
```

```
docker run -d --name gitlab2 -p 8099:80 -v /home/lzq/git-config2/gitlab:/etc/gitlab -v /home/lzq/gitlab-data2:/gitlab-data twang2218/gitlab-ce-zh:9.4.3
```