// 12种状态
export const NOT_LOADED = 'NOT_LOADED'; // 没有加载过 初始状态
export const LOADING_SOURCE_CODE = 'LOADING_SOURCE_CODE'; // 加载原代码 调用了loadapp 方法
export const NOT_BOOTSTRAPPED = 'NOT_BOOTSTRAPPED'; // 没有启动 还没有调用bootstrap方法
export const BOOTSTRAPPING = 'BOOTSTRAPPING'; // 启动中 调用bootstrap方法
export const NOT_MOUNTED = 'NOT_MOUNTED'; // 没有挂载 启动完成 没有调用mount方法
export const MOUNTING = 'MOUNTING'; // 挂载中 调用mount方法
export const MOUNTED = 'MOUNTED'; // 挂载完毕 挂载完成
export const UPDATING = 'UPDATING'; // 更新中
export const UNMOUNTING = 'UNMOUNTING'; // 卸载中， 解除挂载
export const UNLOADING = 'UNLOADING'; // 没有加载中 完全卸载
export const LOAD_ERROR = 'LOAD_ERROR'; // 加载失败
export const SKIP_BECAUSE_BROKEN = 'SKIP_BECAUSE_BROKEN'; // 运行出错

// 看一下应用是否已经被激活
// 当前app是否已经挂载
export function isActive(app) {
  return app.status === MOUNTED;
}

// 当前app是否应该激活
export function shouldBeActive(app) {
  return app.activeWhen(window.location);
}
