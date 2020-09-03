/**
 * @description:
 * @param {type} appName 应用的名字
 * @param {type} loadApp 加载应用的方法
 * @param {type} activeWhen 激活的条件
 * @param {type} customProps 自定义的属性
 * @return {type}
 */
import { reroute } from '../navigation/reroute.js';
import * as STATUS from './app.helper.js';
const apps = []; // 用来存放所有的应用

// 维护应用所有的状态 状态机
export function registerApplication(appName, loadApp, activeWhen, customProps) {
  apps.push({
    name: appName,
    loadApp,
    activeWhen,
    customProps,
    status: STATUS.NOT_LOADED, // 默认应用为未加载
  });

  reroute(); // 加载应用
}
export function getAppChanges() {
  const appsToUnmount = [];
  const appsToLoad = [];
  const appsToMount = [];
  apps.forEach((app) => {
    const appShouldBeActive =
      app.status !== STATUS.SKIP_BECAUSE_BROKEN && STATUS.shouldBeActive(app);

    switch (app.status) {
      case STATUS.NOT_LOADED: // toLoad
      case STATUS.LOADING_SOURCE_CODE:
        if (appShouldBeActive) {
          appsToLoad.push(app);
        }
        break;
      case STATUS.NOT_BOOTSTRAPPED: // toMount
      case STATUS.NOT_MOUNTED:
        if (appShouldBeActive) {
          appsToMount.push(app);
        }
        break;
      case STATUS.MOUNTED: // toUnmount
        if (!appShouldBeActive) {
          appsToUnmount.push(app);
        }
    }
  });
  console.log(appsToLoad, appsToMount, appsToUnmount);
  return { appsToLoad, appsToMount, appsToUnmount };
}
