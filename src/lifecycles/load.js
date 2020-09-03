import {
  LOADING_SOURCE_CODE,
  NOT_BOOTSTRAPPED,
} from '../applications/app.helper';
function flattenFnArray(fns) {
  // 将函数通过then链连接起来
  fns = Array.isArray(fns) ? fns : [fns];
  return function (props) {
    return fns.reduce((p, fn) => p.then(() => fn(props)), Promise.resolve());
  };
}
export async function toLoadPromise(app) {
  app.status = LOADING_SOURCE_CODE;
  let { bootstrap, mount, unmount } = await app.loadApp(app.customProps); // 调用load函数拿到接入协议
  app.status = NOT_BOOTSTRAPPED;
  app.bootstrap = flattenFnArray(bootstrap); // bootstrap可能是一个数组，里面的方法依次执行
  app.mount = flattenFnArray(mount);
  app.unmount = flattenFnArray(unmount);
  return app;
}
