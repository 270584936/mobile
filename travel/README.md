> # 开始

## 新手入门

### 安装

安装hpm，在此之间先安装[tnpm](http://node.alibaba-inc.com/module/tnpm.html?spm=0.0.0.0.LxuAjz)

```
$ tnpm install hpm -g
```

### 初始化项目

使用`hpm init`命令可以在当前目录下初始化一个标准的H5App项目，并生成一个H5App demo。

创建后也可以手动修改当前目录下的[hpmfile.json](#hpmfile-json)文件配置应用属性

```
$ mkdir demo && cd demo
$ hpm init -i 20000127
```
> 扩展参数：
>
> `-i, --appid` 必填项，初始化应用ID(应用中心分配的appid)
> 
> `-n, --name` 初始化应用名称，默认为H5AppDemo  
> 
> `-V, --ver` 初始化应用版本号，默认为1.0.0.0 (-V缩写参数注意大小写)


### 项目打包

开发好一个H5App项目后，可以用以下命令，根据hpmfile.json内的[build配置规则](#build)将指定内容打包为一个离线包，并加入安全签名文件

```
$ hpm build
```
> 扩展参数：
>
> `-V, --ver` 打包前先修改应用版本号 (-V缩写参数注意大小写)
> 
> `-e, --env` 配置离线包的部署环境标识，默认为：dev
>
> `-t, --tar` 仅打包钱包8.4版以上的离线包




### 项目预览

在开发一个在线H5App应用时可以随时通过以下命令搭建一个本地静态HTTP服务器进行扫码预览。

```
$ hpm server
```
> 扩展参数：
> 
> `-w, --watch` 开启watch功能。当源文件有内容变化时，已打开的预览网页将会自动刷新。
> 
> `-p, --port` 自定义本地HTTP服务器的端口号,默认端口号为：3000




### 项目远程调试

在开发一个H5App应用时可以通过以下命令进行远程调试，依赖debug钱包客户端，并需要在支付宝设置中开启Weinre调试开关。设置方式如下：

> IOS版设置教程：  
> 设置 -> 支付宝钱包 -> 开启 "WEB远程调试" 下的 "Weinre" 开关

![ios](http://tfs.alipayobjects.com/images/T1WmtaXcdmXXXXXXXX.jpg)

> Android版设置教程：

> 1. 安装《支付宝设置》apk: 下载地址：[ClientSetting.apk](http://ux.alipay-inc.com/images/f/fc/ClientSetting.apk)
> 2. 打开《支付宝设置》，开启 "WEB远程调试" 下的 "开启调试" 开关


```
$ hpm debug
```
> 扩展参数：
>
> `-o, --offline` 开启扫码安装离线包到支付宝钱包的功能。(依赖debug钱包客户端，并需要在环境设置中打开Weinre调试开关)
> 
> `-w, --watch` 开启watch功能。当源文件有内容变化时，已打开的预览网页将会自动刷新。(离线包安装到支付宝钱包调试时该功能无效)
> 
> `-p, --port` 自定义本地HTTP服务器的端口号,默认端口号为：3000  


---

> # 标准规范

## [hpmfile.json](id:hpmfile-json)

### appid
该应用在应用中心中分配到的appid，可通过应用中心获取

### name
应用的名称，一般为英文

### version
应用的当前版本号

版本使用 MAJOR.MINOR.PATCH.DATE 版本号，正则匹配 \d+\.\d+\.\d+.\d+。

DATE 为当前应用离线包的创建时间，PATCH 变更为 bugfix，MINOR 为非兼容的修改和功能新增，MAJOR 为定位调整或大范围的重写。

### author
应用的作者，格式为当前版本号的开发者域账号加邮箱

支持两种写法：

```
"author": "haibin.zhb <haibin.zhb@alipay.com>"

"author": {
  "name": "haibin.zhb",
  "email": "haibin.zhb@alipay.com"
}
```

### description
应用的描述信息，对该应用的功能和使用进行一个简单的描述

### repository
应用的代码仓库地址

### launchParams
应用的启动参数，具体可查阅：[H5容器启动参数](http://ux.alipay-inc.com/index.php/H5%E5%AE%B9%E5%99%A8%E6%96%87%E6%A1%A3#.E5.90.AF.E5.8A.A8.E5.8F.82.E6.95.B0)

> 注：将该字段转为字符串，即为应用中心后台部署和发布应用时的扩展参数内容。

```
"launchParams": {
    "url": "/www/index.htm",
    "showTitleBar": "NO",
    "showToolBar": "YES",
    "showLoading": "NO"
  }
```



### host
在通过`hpm init`方式初始化项目时，将会自动分配一个值，如appid为20000135的应用配置将会自动生成：

```
...

"host": {
    "dev": "http://20000135.h5app.alipay.net",
    "test": "http://20000135.h5app.test.alipay.net",
    "online": "https://20000135.h5app.alipay.com"
  },

...
```

> 注意：如果离线应用需要做淘系免登，那么请将host自定义为一个淘系的域名，如
```
  "host": {
    "dev": "http://20000135.h5app.waptest.taobao.com",
    "test": "http://20000135.h5app.waptest.taobao.com",
    "online": "http://20000135.h5app.m.taobao.com"
  },
 ```
 > 注意不要用https，并且要保证 http://20000135.h5app.m.taobao.com 类似这个链接要能在浏览器里面打开，可以跳转到淘宝错误页面。

host下会有3个环境变量：`dev`、`test`、`online`。这三个key为固定值不可自定义，而对应的三个域名值可以自定义。

host下的三个值代表了在各自环境下启动此离线应用时，H5容器将会分配对应的虚拟域名给该应用，而不是原有的file协议。

如dev环境下运行该离线应用包下的`/www/index.htm`页面，实际url为：`http://20000135.h5app.alipay.net/www/index.htm`。

可在页面内执行`console.log(location.href)`观察实际效果。

### mapLocal
网络请求映射本地文件功能。

例如以下配置：

```
...
"mapLocal": {
    "tfs.alipay.com/static": "/static"
  }
...
```

以上配置代表了如果在当前H5App的生命周期内，如果有网络请求的路径中包含有`tfs.alipay.com/static`字符串，则会映射到离线包内tar包根目录下的`/static`文件夹内。

例如该H5App内的页面请求了一个URL为"http://tfs.alipay.com/static/test.png"的图片，那么实际打开的图片来源为tar包根目录下的"/static/test.png"。

注：如果本地对应的映射路径不存在文件，则H5容器会尝试获取原始路径的在线资源。如上例中的"/static/test.png"不存在，则会依然返回"http://tfs.alipay.com/static/test.png"在线资源图片。

### preBuild

preBuild内的值代表了当前目录下的一个shell文件。如果存在该文件，则在执行hpm build时会先执行该shell文件内的命令，然后再开始正式打包。

一般用于依赖spm或anima构建的项目，可以在prebuild.sh中先执行自定义的构建命令，然后再打包。

默认值：

```
...
"preBuild":"prebuild.sh",
...

```

### [build](id:build)

hpm build功能的依赖参数。

将应用打包为amr离线包时可指定包含内容或忽略内容，规则参照gulp

```
"build": {
    "include": [
      "./www/**",
      "./res/*@2x.png"
    ],
    "ignore": [
      "./**/*.md"
    ]
  }
```

### support

hpm publish功能的依赖参数，目前无效

配置当前应用版本号所支持的手机系统平台、手机系统版本号范围、钱包版本号范围。

目前仅支持ios和android平台。如果只发布到ios平台则只保留"ios"字段即可，删除"android"字段。

minSDK等参数如果为空则默认代表不限制。

```
"support": {
    "ios": {
      "minSDK": "",
      "maxSDK": "",
      "minOS": "",
      "maxOS": ""
    },
    "android": {
      "minSDK": "",
      "maxSDK": "",
      "minOS": "",
      "maxOS": ""
    }
  }
```

### dependencies
当前应用的依赖项，目前无效

## 项目结构

### _dist
当执行hpm build命令后自动生成的临时dist目录，每次打包都会删除后重新生成。

目录下内容即为最后一次生成的离线包内的文件内容。

### _package
当执行hpm build命令后自动生成的临时目录。

所有离线包创建成功后都会自动保存于该目录内。

### res
初始化应用时自动创建的目录，该目录下有4个默认icon图标，分别为ios和android的高清和低清icon。

目前仅方便于项目内容管理。可忽略或直接删除。

### www
初始化应用时自动创建的目录，该目录下的内容即为该demo应用的src源码。

该目录名称和内容可自由修改。

> 注意：如果修改了该目录名称后，**切记需要同时手动修改hpmfile.json内的build.include属性值、launchParams.url属性值。**否则将导致应用无法正确打包和启动。

### hpmfile.json
初始化应用时自动创建的配置文件。该配置文件为json格式，包含了此应用的所有相关配置信息。

### prebuild.sh
则在执行hpm build时会先执行该shell文件内的命令，然后再开始正式打包。

一般用于依赖spm或anima构建的项目，可以在prebuild.sh中先执行自定义的构建命令，然后再打包。


---

> # 构建

## 构建过程详解

### 修改版本号
执行hpm build时如果同时输入了-V参数，则首先会将-V参数的值修改到hpmfile.json配置文件内的version字段内。

### dest
首先会获取hpmfile.json内的build字段内容，然后根据include和ignore的值判断需要进行打包的文件内容规则。然后通过gulp工具进行dest操作，将相应文件内容复制到_dist临时目录下。

### tar
如果是用于8.4以上版本的钱包，那么将会把所需的离线包内容打包合并为一个tar格式的资源包，用于统一加签。

### 生成Manifest.xml
由于应用中心推包依赖于Manifest.xml文件，因此此步骤会从hpmfile.json获取必要信息生成一个Manifest.xml存于_dist临时目录下

### 加签
当dest操作成功结束以后，将会检索_dist目录下的所有文件并调用服务端安全签名服务接口生成对应的签名，全部完成后会在_dist目录下生成一个CERT或CERT.json安全签名文件。

> 注意：加签操作必须在内网环境才能成功执行。

### 打包
当加签操作成功结束以后，会将当前_dist目录进行zip压缩，最终生成一个amr后缀的离线包，并保存于_package下对应版本号的目录内。
