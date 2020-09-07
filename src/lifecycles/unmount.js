import { MOUNTED, UNMOUNTING, NOT_MOUNTED } from '../applications/app.helper';

export async function toUnmountPromise(app) {
  // 如果当前应用压根就没有被挂载就什么都不做了
  if (app.status != MOUNTED) {
    return app;
  }
  app.status = UNMOUNTING;
  await app.unmount(app.customProps);
  app.status = NOT_MOUNTED;
  return app;
}
