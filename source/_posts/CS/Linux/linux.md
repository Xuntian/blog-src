---
title: Linux 
date: 2016-12-01 
categories: Linux
tag: linux 
---

## linux文件类型
linux文件一共有7种类型，基本上只需掌握前三种，通过ll命令可以查看到指定文件的文件类型
-表示普通文件
d表示目录
l表示软链接文件，或符号连接
b块设备文件，二进制文件
s套接字文件
c字符设备文件
p管道文件
<!--more-->

## 文件权限
通过ll命令可以查看到指定文件的权限
-rwxrw-r--. root root	
所有者(u) 所属组(g) 其他用户(o)
第一位-表示文件类型
第二三四位表示所有者权限
第五六七位表示所属组权限
第八九十位表示其他用户权限
第十一位.表示ACL权限
之后的root为文件所有者的用户名，最后的root为所属组的组名

## 归档和压缩
在国内我们用的比较多的是rar，但是国外则是zip比较常见，因为rar是有版权的，而zip是开源的。  
* 命令zip用以压缩文件
```
zip test.zip myfile
```
* 命令unzip用以解压缩文件
```
unzip test.zip
```
* 命令gzip用以压缩文件
```
gzip myfile
```
* 命令tar用以归档文件
```
tar -cvf test.tar myfile
tar -xvf test.tar
tar -cvzf test.tar.gz myfile 
```

```
-A或--catenate：新增文件到以存在的备份文件；
-B：设置区块大小；
-c或--create：建立新的备份文件；
-C <目录>：这个选项用在解压缩，若要在特定目录解压缩，可以使用这个选项。
-d：记录文件的差别；
-x或--extract或--get：从备份文件中还原文件；
-t或--list：列出备份文件的内容；
-z或--gzip或--ungzip：通过gzip指令处理备份文件；
-Z或--compress或--uncompress：通过compress指令处理备份文件；
-f<备份文件>或--file=<备份文件>：指定备份文件；
-v或--verbose：显示指令执行过程；
-r：添加文件到已经压缩的文件；
-u：添加改变了和现有的文件到已经存在的压缩文件；
-j：支持bzip2解压文件；
-v：显示操作过程；
-l：文件系统边界设置；
-k：保留原有文件不覆盖；
-m：保留文件不被覆盖；
-w：确认压缩文件的正确性；
-p或--same-permissions：用原来的文件权限还原文件；
-P或--absolute-names：文件名使用绝对名称，不移除文件名称前的“/”号；
-N <日期格式> 或 --newer=<日期时间>：只将较指定日期更新的文件保存到备份文件里；
--exclude=<范本样式>：排除符合范本样式的文件。
```

## 文件搜索

### whereis 文件名   
特点:快速,但是是模糊查找,例如 找 #whereis mysql 它会把mysql,mysql.ini,mysql.*所在的目录都找出来.我一般的查找都用这条命令.
### locate 文件名     
强力推荐的方法,最快,最好的方法，此命令需要预先建立数据库，数据库默认每天更新一次，可用update命令手动建立和更新数据库。注意:第一次使用该命令,可能需要更新数据库,按照提示的命令执行一下就好了.    
### find / -name 文件名    
特点:准确,但速度慢,消耗资源大,在nfs文件系统中也同样适用，支持正则表达式
```
find / -name test
find / -name *test*
find / -perm 777     #只能是数字
find / -type d       #查找目录(f-普通文件, l-链接文件, b-块设备文件, c-字符设备文件, p-管道文件)
find / -name "*a*" -exec ls -al {} \
```
find支持多种查找条件
```
-print  #将匹配的文件输出到标准输出中
-name   #file name 
-perm   #permission
-user   #user
-group  #group 
-type   #file type
-size   #file size
-exec   #对匹配的文件执行exec参数给出的shell命令，相应的命令形式为：find . -type f -exec ls {} \;
-ok     #作用和exec相同，只不过以一种更为安全的模式的执行给出的shell命令，即执行每一个命令之前都会给出提示
-mtime  #修改时间，find . -mtime -n +n （-n表示文件的修改时间是在n天以内，+n表示修改时间是在n天以前）ctime,和atime选项的用法类似
-newer file1 ! file2    #查找修改时间比file1新，但比file2旧的文件
-depth  #首先查找当前目录中的文件，然后在其子目录下查找
-fstype #表示查找位于某一文件系统中的文件，这些文件系统可以在/etc/fstab中找到
-mount  #在查找时不跨越文件系统mount点
-follow #如果find命令遇到符号链接文件，就跟踪至链接指向的文件
```

#### xargs配合find命令
```
find . -type f | xargs file
find . -perms 777 | xargs chmod o-w 
```