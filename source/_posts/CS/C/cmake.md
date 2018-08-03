---
title: Cmake
date: 2018-04-11 
categories: C
tag: cmake 
---

## 简单的应用实例
main.c文件内容
```
#include <stdio.h>
int main(){
    printf("Hello World!\n");
    return 0;
}
```

新建CMakeList.txt文件
```
PROJECT (HELLO)
SET(SRC_LIST main.c)
MESSAGE(STATUS "This is BINARY dir " ${HELLO_BINARY_DIR})
MESSAGE(STATUS "This is SOURCE dir " ${HELLO_SOURCE_DIR})
ADD_EXECUTABLE(hello ${SRC_LIST})
```
<!--more-->

开始构建 cmake .
```
所有的文件创建完成后，t1 目录中应该存在main.c和 CMakeLists.txt 两个文件
接下来我们来构建这个工程，在这个目录运行：
cmake . (注意命令后面的点号，代表本目录)。
输出大概是这个样子：
-- Check for working C compiler: /usr/bin/gcc
-- Check for working C compiler: /usr/bin/gcc -- works
-- Check size of void*
-- Check size of void* - done
-- Check for working CXX compiler: /usr/bin/c++
-- Check for working CXX compiler: /usr/bin/c++ -- works
-- This is BINARY dir /backup/cmake/t1
-- This is SOURCE dir /backup/cmake/t1
-- Configuring done
-- Generating done
-- Build files have been written to: /backup/cmake/t1
再让我们看一下目录中的内容：
你会发现，系统自动生成了：
CMakeFiles, CMakeCache.txt, cmake_install.cmake等文件，并且生成了Makefile.
现在不需要理会这些文件的作用，以后你也可以不去理会。最关键的是，它自动生成了Makefile.

然后进行工程的实际构建，在这个目录输入 make命令，大概会得到如下的彩色输出：
Scanning dependencies of target hello
[100%] Building C object CMakeFiles/hello.dir/main.o
Linking C executable hello
[100%] Built target hello
如果你需要看到make构建的详细过程，可以使用make VERBOSE=1 或者VERBOSE=1
make命令来进行构建。
这时候，我们需要的目标文件hello 已经构建完成，位于当前目录，尝试运行一下：
./hello
得到输出：
Hello World from Main
```

## 对实例的解释
PROJECT指令的语法是  
`PROJECT(projectname [CXX] [C] [Java])`
SET指令的语法是   
`SET(VAR [VALUE] [CACHE TYPE DOCSTRING [FORCE]])  `
现阶段，你只需要了解SET指令可以用来显式的定义变量即可。   
比如我们用到的是SET(SRC_LIST main.c)，如果有多个源文件，也可以定义成：    
`SET(SRC_LIST main.c t1.c t2.c)`

