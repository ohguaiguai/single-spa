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

// 给app装载事件
export async function toLoadPromise(app) {
  // 如果app正在加载就直接返回
  // 做这一步的原因是：当注册应用的时候会默认执行loadApp来预加载应用，而loadApp是异步的，
  // 接下来在start方法中还会再执行一次加载，这样就会造成重复加载，做这一层缓存就可以避免这个问题
  if (app.loadPromise) {
    return app.loadPromise;
  }
  return (app.loadPromise = Promise.resolve().then(async () => {
    app.status = LOADING_SOURCE_CODE;
    let { bootstrap, mount, unmount } = await app.loadApp(app.customProps); // 调用load函数拿到接入协议
    app.status = NOT_BOOTSTRAPPED;
    app.bootstrap = flattenFnArray(bootstrap); // bootstrap可能是一个数组，里面的方法依次执行
    app.mount = flattenFnArray(mount);
    app.unmount = flattenFnArray(unmount);
    delete app.loadPromise; // 加载完毕就把这个属性删掉
    return app;
  }));
}
