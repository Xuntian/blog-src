---
title: Shell
date: 2018-01-18 
categories: 
- CS
- linux
- shell
tag: shell 
---

* Linux操作系统通过kernel(内核)控制底层硬件，如内存管理、进程调度、鼠标键盘的驱动等，但是用户无法通过kernel对计算机进行控制，而是通过shell与kernel通信，达到控制计算机的目的
* Shell分为两种，CLI和GUI

## Shell命令行
### Linux下bash快捷键
* Ctrl+A: 切换到命令行开始
* Ctrl+E: 切换到命令行末尾
* Ctrl+L: 清屏，相当于clear
* Ctrl+U: 清除剪切光标之前的内容
* Ctrl+K: 清除剪切光标之后的内容
* Ctrl+Y: 粘贴刚才删除的字符
* Ctrl+R: 在历史命令中查找
* Ctrl+C: 终止命令
* Ctrl+D: 退出当前终端
* Ctrl+Z: 转入后台运行
* !!:     重复执行上一条命令
* !$:     显示系统最近的一条参数
* history 系统命令历史，不只是当前终端的命令历史，而是整个系统的
* !字符 重复执行之前最近一个以该字符开头的命令
* !数字 按照历史记录的序号执行命令
* !?abc 重复执行之前包含abc的命令
* !-n   重复执行n个命令之前的那个命令
* esc + . 重复调用上一个命令的参数，但不重复执行上一个命令
<!--more-->

### 命令行通配符
* \* 匹配0个或多个字符
* ？ 匹配任意一个字符
* [0-9] 匹配一个数字范围
* [abc]  匹配列表里的任意字符
* [^abc] 匹配列表以外的字符

### Linux shell commands
* id 返回当前用户信息
* passwd 修改当前用户密码
* su 切换到root用户，但不开启新的终端，仍在之前的目录下，su - 切换到root用户，并切换目录到root根目录/root

### bash 作业管理
* 在命令后加一个&符号将命令放在后台运行
* jobs 查看当前在后台运行的所有作业
* bg 让程序在后台继续运行
* fg 将程序放到前台执行

### 输入/输出重定向
一般情况下，每个 Unix/Linux 命令运行时都会打开三个文件：   
标准输入文件(stdin)：stdin的文件描述符为0，Unix程序默认从stdin读取数据。  
标准输出文件(stdout)：stdout 的文件描述符为1，Unix程序默认向stdout输出数据。  
标准错误文件(stderr)：stderr的文件描述符为2，Unix程序会向stderr流中写入错误信息。   
```
# 如果希望 stderr 重定向到 file，可以这样写：
$ command 2 > file
# 如果希望 stderr 追加到 file 文件末尾，可以这样写：
$ command 2 >> file

command > file	将输出重定向到 file。
command < file	将输入重定向到 file。
command >> file	将输出以追加的方式重定向到 file。
n > file	将文件描述符为 n 的文件重定向到 file。
n >> file	将文件描述符为 n 的文件以追加的方式重定向到 file。
n >& m	将输出文件 m 和 n 合并。
n <& m	将输入文件 m 和 n 合并。
<< tag	将开始标记 tag 和结束标记 tag 之间的内容作为输入。

# 如果希望将 stdout 和 stderr 合并后重定向到 file，可以这样写：
$ command > file 2>&1
或者
$ command >> file 2>&1
# 如果希望对 stdin 和 stdout 都重定向，可以这样写：
$ command < file1 >file2
command 命令将 stdin 重定向到 file1，将 stdout 重定向到 file2。
```

* /dev/null 文件     
如果希望执行某个命令，但又不希望在屏幕上显示输出结果，那么可以将输出重定向到 /dev/null：
```
$ command > /dev/null
```
/dev/null 是一个特殊的文件，写入到它的内容都会被丢弃；如果尝试从该文件读取内容，那么什么也读不到。但是 /dev/null 文件非常有用，将命令的输出重定向到它，会起到"禁止输出"的效果。   
如果希望屏蔽 stdout 和 stderr，可以这样写：  
```
$ command > /dev/null 2>&1
```

## Shell脚本
### Shell变量
* 只读变量 readonly   

```
#!/bin/bash
myUrl="http://www.w3cschool.cc"
readonly myUrl
myUrl="http://www.runoob.com"

# 结果如下
/bin/sh: NAME: This variable is read only.
```

* 删除变量 unset

```
unset variable_name
```

### Shell字符串
* 字符串可以用单引号，也可以用双引号，也可以不用引号
* 单引号里的任何字符都会原样输出，单引号字符串中的变量是无效的，单引号字串中不能出现单引号（对单引号使用转义符后也不行）
* 双引号里可以有变量，双引号里可以出现转义字符
* 获取字符串的长度
```
string="abcd"
echo ${#string} #输出 4
```
* 提取子字符串
```
string="runoob is a great site"
echo ${string:1:4} # 输出 unoo
```
* 查找子字符串
```
string="runoob is a great company"
echo `expr index "$string" is`   # 输出 8
```

### Shell数组
* 定义数组
```
array_name=(value0 value1 value2 value3)
array_name=(
value0
value1
value2
value3
)
array_name[0]=value0
array_name[1]=value1
```
* 读取数组
```
# 根据下标获取数组元素
valuen=${array_name[n]}
# 使用@符号可以获取数组中的所有元素
echo ${array_name[@]}
```
* 获取数组的长度
```
# 取得数组元素的个数
length=${#array_name[@]}
# 或者
length=${#array_name[*]}
# 取得数组单个元素的长度
lengthn=${#array_name[n]}
```

### Shell传递参数
```
$#	传递到脚本的参数个数
$*	以一个单字符串显示所有向脚本传递的参数。如"$*"用「"」括起来的情况、以"$1 $2 … $n"的形式输出所有参数。
$$	脚本运行的当前进程ID号
$!	后台运行的最后一个进程的ID号
$@	与$*相同，但是使用时加引号，并在引号中返回每个参数。如"$@"用「"」括起来的情况、以"$1" "$2" … "$n" 的形式输出所有参数。
$-	显示Shell使用的当前选项，与set命令功能相同。
$?	显示最后命令的退出状态。0表示没有错误，其他任何值表明有错误。
```

### Shell基本运算符
Shell支持多种运算符，包括算数运算符、关系运算符、布尔运算符、字符串运算符、文件测试运算符。原生bash不支持简单的数学运算，但是可以通过其他命令来实现，例如 awk 和 expr，expr 最常用  

#### 算数运算符
```
+	加法	`expr $a + $b`    
-	减法	`expr $a - $b`     
*	乘法	`expr $a \* $b`     
/	除法	`expr $b / $a`    
%	取余	`expr $b % $a`     
=	赋值	a=$b 将把变量 b 的值赋给 a。      
==	相等  用于比较两个数字，相同则返回 true。	[ $a == $b ] 返回 false    
!=	不相等  用于比较两个数字，不相同则返回 true。	[ $a != $b ] 返回 true      
```
1.表达式和运算符之间要有空格，例如 2+2 是不对的，必须写成 2 + 2，这与我们熟悉的大多数编程语言不一样       
2.完整的表达式要被 ` ` 包含，注意这个字符不是常用的单引号       
3.乘号(*)前边必须加反斜杠(\)才能实现乘法运算   

* 关系运算符

-eq	检测两个数是否相等，相等返回 true。	[ $a -eq $b ]       
-ne	检测两个数是否相等，不相等返回 true。	[ $a -ne $b ]      
-gt	检测左边的数是否大于右边的，如果是，则返回 true。	[ $a -gt $b ]       
-lt	检测左边的数是否小于右边的，如果是，则返回 true。	[ $a -lt $b ]     
-ge	检测左边的数是否大于等于右边的，如果是，则返回 true。	[ $a -ge $b ]       
-le	检测左边的数是否小于等于右边的，如果是，则返回 true。	[ $a -le $b ]     


* 布尔运算符

a=10      
b=20         
!	非运算，表达式为 true 则返回 false，否则返回 true。	[ ! false ] 返回 true。       
-o	或运算，有一个表达式为 true 则返回 true。	[ $a -lt 20 -o $b -gt 100 ] 返回 true。   
-a	与运算，两个表达式都为 true 才返回 true。	[ $a -lt 20 -a $b -gt 100 ] 返回 false。          


* 逻辑运算符

&&	逻辑的 AND	[[ $a -lt 100 && $b -gt 100 ]] 返回 false            
||	逻辑的 OR	[[ $a -lt 100 || $b -gt 100 ]] 返回 true             


* 字符串运算符

=	检测两个字符串是否相等，相等返回 true。	[ $a = $b ] 返回 false。      
!=	检测两个字符串是否相等，不相等返回 true。	[ $a != $b ] 返回 true。     
-z	检测字符串长度是否为0，为0返回 true。	[ -z $a ] 返回 false。          
-n	检测字符串长度是否为0，不为0返回 true。	[ -n $a ] 返回 true。           
str	检测字符串是否为空，不为空返回 true。	[ $a ] 返回 true。            


* 文件测试运算符

-b file	检测文件是否是块设备文件，如果是，则返回 true。	[ -b $file ] 返回 false。            
-c file	检测文件是否是字符设备文件，如果是，则返回 true。	[ -c $file ] 返回 false。        
-d file	检测文件是否是目录，如果是，则返回 true。	[ -d $file ] 返回 false。       
-f file	检测文件是否是普通文件（既不是目录，也不是设备文件），如果是，则返回 true。	[ -f $file ] 返回 true。     
-g file	检测文件是否设置了 SGID 位，如果是，则返回 true。	[ -g $file ] 返回 false。           
-k file	检测文件是否设置了粘着位(Sticky Bit)，如果是，则返回 true。	[ -k $file ] 返回 false。         
-p file	检测文件是否是有名管道，如果是，则返回 true。	[ -p $file ] 返回 false。       
-u file	检测文件是否设置了 SUID 位，如果是，则返回 true。	[ -u $file ] 返回 false。        
-r file	检测文件是否可读，如果是，则返回 true。	[ -r $file ] 返回 true。        
-w file	检测文件是否可写，如果是，则返回 true。	[ -w $file ] 返回 true。       
-x file	检测文件是否可执行，如果是，则返回 true。	[ -x $file ] 返回 true。          
-s file	检测文件是否为空（文件大小是否大于0），不为空返回 true。	[ -s $file ] 返回 true。         
-e file	检测文件（包括目录）是否存在，如果是，则返回 true。	[ -e $file ] 返回 true。          
