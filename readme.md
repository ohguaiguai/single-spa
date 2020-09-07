<!--
 * @file: description
 * @author: zhangxing
 * @Date: 2020-09-07 10:46:41
 * @LastEditors: zhangxing
 * @LastEditTime: 2020-09-07 14:21:37
-->

流程：

1. 注册 app, 默认预加载应用执行 reroute
2. 调用 reroute, 执行 loadApp 预加载应用并且给 app 装载事件，bootstrap、mount、unmount
3. 调用了 start 之后， 就卸载之前的 app，装载新的 app
4. 当路由切换加载新的应用

单页应用路由的方案

1. hashchange
2. history api
