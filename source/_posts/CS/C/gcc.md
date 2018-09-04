---
title: Gcc
date: 2018-03-31
categories: 
- CS
- c语言
- gcc
tag: gcc
---

## gcc命令常用选项及工作流程
```
-c      # 对源文件进行编译或汇编
-E      # 对源文件进行预处理
-S      # 对源文件进行编译
-o file # 输出目标文件file
-v      # 显示编译阶段命令
```

新建文件 vim test.c   
``` 
# include <stdio.h>

int main(){
    printf("hello world.\n");
    return 0;
}
```
<!--more-->

预处理 gcc -E test.c -o test.i, 这时可以看到多了test.i文件, 查看test.i文件的内容，可以看到stdio.h的内容被加在了前面

编译 gcc -S test.i -o test.s, 编译生成了新的文件test.s, 查看test.s文件的内容可以看到其内容为汇编代码

汇编 gcc -c test.s -o test.o, 该命令会生成名为test.o的目标文件, 在windows下目标文件的后缀名是obj, test.o文件是二进制文件, 但是无法运行

链接 gcc test.o -o test, 改步骤会把test.o文件和函数库文件链接在一起, 生成新的可执行二进制文件test, 执行该文件即可打印出hello world

```
# ./test
hello world.
```



