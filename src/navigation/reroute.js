import { getAppChanges } from '../applications/app';
import { toLoadPromise } from '../lifecycles/load';
import { toUnmountPromise } from '../lifecycles/unmount';
import { started } from '../start';
import { toBootstrapPromise } from '../lifecycles/bootstrap';
import { toMountPromise } from '../lifecycles/mount';

import '../navigation/navigator-events';

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

  // 启动逻辑
  async function performAppChanges() {
    // 先卸载不需要的应用
    let unmountPromises = appsToUnmount.map(toUnmountPromise); // 不用await 并发卸载

    // 加载需要的应用 并行加载
    // 加载app1的时候发生了路由切换，那么app1应该停止加载
    appsToLoad.map(async (app) => {
      // 将需要加载的应用拿到 => 加载 => 启动 => 挂载
      app = await toLoadPromise(app);
      app = await toBootstrapPromise(app);
      return await toUnmountPromise(app);
    });
    appsToMount.map(async (app) => {
      app = await toBootstrapPromise(app);
      return toMountPromise(app);
    });
  }
  async function loadApps() {
    // 预加载应用
    // console.log(appsToLoad.map(toLoadPromise));
    await Promise.all(appsToLoad.map(toLoadPromise));
  }
}
