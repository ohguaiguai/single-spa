import { reroute } from './reroute';

export const routingEventsListeningTo = ['hashchange', 'popstate'];

function urlReroute() {
  reroute([], arguments); // 根据路径重新加载不用的应用
}

// 用来保存用户自定义的事件
const captureEventListeners = {
  hashchange: [],
  popstate: [],
};
// 我们处理的逻辑应该放在最前面
window.addEventListener('hashchange', urlReroute);
window.addEventListener('popstate', urlReroute);

// 用户可能还会绑定自己的路由事件
const originalAddEventListener = window.addEventListener;
const originalRemoveEventListener = window.removeEventListener;

window.addEventListener = function (eventName, fn) {
  // 如果监听了hashchange 或者 popstate, 并且没有监听过fn
  if (
    routingEventsListeningTo.indexOf(eventName) >= 0 &&
    !captureEventListeners[eventName].some((listener) => listener === fn)
  ) {
    captureEventListeners[eventName].push(fn);
  }
  return originalAddEventListener.apply(this, arguments);
};
window.removeEventListener = function (eventName, fn) {
  if (routingEventsListeningTo.indexOf(eventName) >= 0) {
    captureEventListeners[eventName] = captureEventListeners[eventName].filter(
      (l) => l !== fn
    );
    return originalRemoveEventListener.apply(this, arguments);
  }
};

function patchedUpdateState(updateState, methodName) {
  return function () {
    const urlBefore = window.location.href;
    const result = updateState.apply(this, arguments);
    const urlAfter = window.location.href;
    if (urlBefore !== urlAfter) {
      urlReroute(new PopStateEvent('popstate')); // 重新加载应用，传入事件源, 事件源就是new PopStateEvent('popstate'), 作为urlReroute方法的arguments
    }
    return result;
  };
}
// 重写pushState 和 repalceState方法
window.history.pushState = patchedUpdateState(
  window.history.pushState,
  'pushState'
);
window.history.replaceState = patchedUpdateState(
  window.history.replaceState,
  'replaceState'
);

// 在子应用加载完毕后调用此方法，执行拦截的逻辑（保证子应用加载完后执行）, 执行用户自定义的监听事件
export function callCapturedEventListeners(eventArguments) {
  if (eventArguments) {
    const eventType = eventArguments[0].type;
    if (routingEventsListeningTo.indexOf(eventType) >= 0) {
      capturedEventListeners[eventType].forEach((listener) => {
        listener.apply(this, eventArguments);
      });
    }
  }
}
