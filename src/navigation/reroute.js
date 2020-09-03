import { getAppChanges } from '../applications/app';
import { toLoadPromise } from '../lifecycles/load';
import { started } from '../start';
export function reroute() {
  const {
    appsToLoad, // 获取要去加载的app NOT_LOADED
    appsToMount, // 获取要被挂载的 NOT_MOUNTED
    appsToUnmount, // 获取要被卸载的
  } = getAppChanges();

  if (started) {
    return performAppChanges(); // 调用了start就启动应用
  } else {
    return loadApps(); // 注册之后预先加载
  }
  async function performAppChanges() {
    // 启动逻辑
    // 先卸载不需要的应用
    // 加载需要的应用
  }
  async function loadApps() {
    // 预加载应用
    // console.log(appsToLoad.map(toLoadPromise));
    await Promise.all(appsToLoad.map(toLoadPromise));
  }
}
