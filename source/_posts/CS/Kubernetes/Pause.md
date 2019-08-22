---
title: Pause容器
date: 2018-12-20
categories: 
- CS
- k8s
- pause
tag: 
- k8s 
- pause
---

> 在k8s集群正常运行的pod中，可以看到每个应用pod都对应有一个pause的docker容器，那么这个容器有什么作用呢？

> k8s通过对每个容器的命名空间配置，将Pod的网络、进程以及进程间通信命名空间都统一到pause的容器中。命名空间是Liunx内核的一个功能，是指从虚拟机层面上对机器的资源进行分组隔离，使用相同命名空间的每个容器都共享一套资源。使用相同命名空间的Pod容器，在各自应用内调用请求就像在本机中互相访问一样，这样资源的调度单位就非常巧妙地变为了Pod。

<!--more-->

> 在Linux系统启动时，任何进程都是由第一个进程init派生出来的，因此在正常的情况下，它们都拥有相同的命名空间。当一个进程结束或者异常退出时，其父进程负责处理它的返回结果，以让操作系统正常回收其进程空间。

> 但也有一些其他的情况，比如父进程没有很好的处理子进程的退出情况，就是说没有调用wait命令来处理其返回代码，其原因可能是代码写得不好或者意外崩溃了。

> 此时，操作系统会将失去父进程的进程挂到PID为1的进程下，一般场景下就是init进程，而这种进程就被成为Orphan Process。在docker容器中，每个容器具有独立的命名空间，其应用进程自身就是第一个进程，PId=1,如果应用进程的子进程又调用fork或者exec参数创建了更多的子进程，那么当出现问题时，它们就会被挂到应用进程下，应用进程和init不一样，并没有处理僵尸进程的逻辑。

> 于是pause的作用就是处理子进程返回时的各种信号，以让其顺利退出。它的代码也非常简单，使用C语言编写，如下
```
#include <signal.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/types.h>
#include <sys/wait.h>
#include <unistd.h>

#define STRINGIFY(x) #x
#define VERSION_STRING(x) STRINGIFY(x)

#ifndef VERSION
#define VERSION HEAD
#endif

static void sigdown(int signo) {
  psignal(signo, "Shutting down, got signal");
  exit(0);
}

static void sigreap(int signo) {
  while (waitpid(-1, NULL, WNOHANG) > 0)
    ;
}

int main(int argc, char **argv) {
  int i;
  for (i = 1; i < argc; ++i) {
    if (!strcasecmp(argv[i], "-v")) {
      printf("pause.c %s\n", VERSION_STRING(VERSION));
      return 0;
    }
  }

  if (getpid() != 1)
    /* Not an error because pause sees use outside of infra containers. */
    fprintf(stderr, "Warning: pause should be the first process\n");

  if (sigaction(SIGINT, &(struct sigaction){.sa_handler = sigdown}, NULL) < 0)
    return 1;
  if (sigaction(SIGTERM, &(struct sigaction){.sa_handler = sigdown}, NULL) < 0)
    return 2;
  if (sigaction(SIGCHLD, &(struct sigaction){.sa_handler = sigreap,
                                             .sa_flags = SA_NOCLDSTOP},
                NULL) < 0)
    return 3;

  for (;;)
    pause();
  fprintf(stderr, "Error: infinite loop terminated\n");
  return 42;
}
```

> 从代码中可以看出，pause在启动时向系统注册了两个系统信号回调函数（sigdown, sigreap）后，便进入了无止境的睡眠，其中sigdown只是简单地处理任务终止请求，sigreap则调用系统wait命令来接管每个孤儿进程，当其退出时及时在进程表中做好清除标记，以让操作系统回收相关资源。pause是一个资源汇集平台，将Pod中的各类资源打通并形成统一的部署结构，更有利于微服务集群管理。