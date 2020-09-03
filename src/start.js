/**
 * @description: 挂载应用
 * @param {type}
 * @return {type}
 */
import { reroute } from './navigation/reroute';
export let started = false;
export function start() {
  started = true;
  reroute(); // 这个是启动应用
}
