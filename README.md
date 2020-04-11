# 北京理工大学校园网命令行登陆工具
帮助你在无法使用浏览器的情况下登陆北理工校园网🍻。


为了最小化依赖，方便在无网络环境使用，没有使用 npm 管理依赖。唯一的依赖 [jshashes](https://github.com/h2non/jshashes) 直接下载了校园网网页端使用的版本。直接将本项目拷贝到目标主机上即可使用。

此脚本需要安装 `node.js` 才能运行。安装方法请参考 [nodejs.org](https://nodejs.org/)，安装包可以使用[清华镜像](https://mirrors.tuna.tsinghua.edu.cn/nodejs-release)通过 IPv6 免流量下载。在 `node.js v10.13.0` 上测试通过。
# Usage
首先给 `BIT.js` 加上执行权限
```
chmod +x BIT.js
```
登陆

提供了两种登陆方式，第一种使用交互式命令行，不会显示密码。

```
./BIT.js login 1120181234 
```
第二种方式通过参数输入密码，你的密码会明文显示在命令行上。

```
./BIT.js login 1120181234 password
```
注销
```
./BIT.js logout 1120181234
```

（可选）使用 `npm link` 让本脚本全局可用。进入本项目文件夹，运行（可能需要管理员权限）
```
npm link
```
这样你就可以在任何位置以 `BIT login 1120181234` 的方式登陆校园网了。如果不想全局可用，运行
```
npm unlink
```

