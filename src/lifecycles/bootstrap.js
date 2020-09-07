import {
  NOT_BOOTSTRAPPED,
  BOOTSTRAPPING,
  NOT_MOUNTED,
} from '../applications/app.helper';
export async function toBootstrapPromise(app) {
  // 已经过了NOT_LOADED、LOADING_SOURCE_CODE,或者根本这两个就没到, 总之没有到达NOT_BOOTSTRAPED, 说明出问题了
  if (app.status !== NOT_BOOTSTRAPPED) {
    return app;
  }

  app.status = BOOTSTRAPPING;
  await app.bootstrap(app.customProps);
  app.status = NOT_MOUNTED;
  return app;
}
