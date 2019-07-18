---
title: Gitaly
date: 2019-07-18 
categories: 
- CS
- application
- gitlab
tag: 
- gitlab
- gitaly
---

之前写了一篇关于gitlab集群搭建的文章，之前gitlab集群搭建起来之后性能很差，网页打开速度比较慢。从gitlab9.1版本后gitlab官方发布了gitaly项目，以解决gitlab-rails性能问题。

<!--more-->

## gitaly简述
![传统架构示意图](./p1.jpg)

在之前，上层应用使用libgit2库调用底层的git，libgit2由c语言开发，gitlab-rails使用ruby的Rugged调用libgit2和git通信。而存储层则使用性能很差的nfs，网络文件系统增大了文件访问的开销，同时git也无法利用缓存增加平均访问速度。

![gitaly架构示意图](./p2.jpg)

gitaly发布之后，gitlab-rails通过grpc访问gitaly和底层的git通信，规避了nfs的开销，可以对存储进行批量扩展，gitlab和gitaly的配置如下：
> gitlab

```
# /etc/gitlab/gitlab.rb
git_data_dirs({
  'default' => { 'gitaly_address' => 'tcp://gitaly.internal:8075' },
  'storage1' => { 'gitaly_address' => 'tcp://gitaly.internal:8075' },
})

gitlab_rails['gitaly_token'] = 'abc123secret'
```
> gitaly
```
# /etc/gitlab/gitlab.rb

# Avoid running unnecessary services on the Gitaly server
postgresql['enable'] = false
redis['enable'] = false
nginx['enable'] = false
prometheus['enable'] = false
unicorn['enable'] = false
sidekiq['enable'] = false
gitlab_workhorse['enable'] = false

# Prevent database connections during 'gitlab-ctl reconfigure'
gitlab_rails['rake_cache_clear'] = false
gitlab_rails['auto_migrate'] = false

# Configure the gitlab-shell API callback URL. Without this, `git push` will
# fail. This can be your 'front door' GitLab URL or an internal load
# balancer.
# Don't forget to copy `/etc/gitlab/gitlab-secrets.json` from web server to Gitaly server.
gitlab_rails['internal_api_url'] = 'https://gitlab.example.com'

# Make Gitaly accept connections on all network interfaces. You must use
# firewalls to restrict access to this address/port.
gitaly['listen_addr'] = "0.0.0.0:8075"
gitaly['auth_token'] = 'abc123secret'

gitaly['storage'] = [
  { 'name' => 'default', 'path' => '/mnt/gitlab/default/repositories' },
  { 'name' => 'storage1', 'path' => '/mnt/gitlab/storage1/repositories' },
]
```