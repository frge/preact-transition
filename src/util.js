// CSS 过渡代码使用了 Vue.js 的 transition 组件代码
// 在此感谢 Vue 团队的无私奉献
// https://github.com/vuejs/vue/blob/dev/src/platforms/web/runtime/transition-util.js

const transformRE = /\b(transform|all)(,|$)/;
const hasOwn = Object.prototype.hasOwnProperty;

export const TRANSITION = 'transition';
export const ANIMATION = 'animation';

// Transition property/event sniffing
let transitionProp = 'transition';
let transitionEndEvent = 'transitionend';
let animationProp = 'animation';
let animationEndEvent = 'animationend';

if (window.ontransitionend === undefined && window.onwebkittransitionend !== undefined) {
  transitionProp = 'WebkitTransition';
  transitionEndEvent = 'webkitTransitionEnd';
}

if (window.onanimationend === undefined && window.onwebkitanimationend !== undefined) {
  animationProp = 'WebkitAnimation';
  animationEndEvent = 'webkitAnimationEnd';
}

/**
 * Call a function asynchronously, as soon as possible. Makes
 * use of HTML Promise to schedule the callback if available,
 * otherwise falling back to `setTimeout` (mainly for IE<11).
 *
 * @param {Function} callback
 */
export const defer = window.requestAnimationFrame
  ? window.requestAnimationFrame.bind(window)
  : (typeof Promise === 'function'
    ? Promise.resolve().then.bind(Promise.resolve())
    : setTimeout);

export function has(obj, prop) {
  return hasOwn.call(obj, prop);
}

/**
 * 根据 CSS 动画类型，监听动画结束事件
 *
 * @param {Element} el
 * @param {string|undefined} expectedType
 * @param {function} cb
 * @return {*}
 */
export function whenTransitionEnds(el, expectedType, cb) {
  const {type, timeout, propCount} = getTransitionInfo(el, expectedType);
  if (!type) {
    return cb(type);
  }

  const event = type === TRANSITION ? transitionEndEvent : animationEndEvent;
  let ended = 0;

  function end() {
    el.removeEventListener(event, onEnd);
    cb(type);
  }

  function onEnd(e) {
    if (e.target === el) {
      if (++ended >= propCount) {
        end();
      }
    }
  }

  setTimeout(function () {
    if (ended < propCount) {
      end();
    }
  }, timeout + 1);

  el.addEventListener(event, onEnd);
}

/**
 * 获取CSS过渡动画数据
 *
 * @param {Element} el
 * @param {string} [expectedType]
 * @return {{type:string,propCount:number,timeout:number,hasTransform:boolean}}
 */
function getTransitionInfo(el, expectedType) {
  const styles = window.getComputedStyle(el);

  const transitionDelays = styles[transitionProp + 'Delay'].split(', ');
  const transitionDurations = styles[transitionProp + 'Duration'].split(', ');
  const transitionTimeout = getTimeout(transitionDelays, transitionDurations);

  const animationDelays = styles[animationProp + 'Delay'].split(', ');
  const animationDurations = styles[animationProp + 'Duration'].split(', ');
  const animationTimeout = getTimeout(animationDelays, animationDurations);

  let type;
  let timeout = 0;
  let propCount = 0;

  if (expectedType === TRANSITION) {
    if (transitionTimeout > 0) {
      type = TRANSITION;
      timeout = transitionTimeout;
      propCount = transitionDurations.length;
    }
  } else if (expectedType === ANIMATION) {
    if (animationTimeout > 0) {
      type = ANIMATION;
      timeout = animationTimeout;
      propCount = animationDurations.length;
    }
  } else {
    timeout = Math.max(transitionTimeout, animationTimeout);
    type = timeout > 0
      ? transitionTimeout > animationTimeout
        ? TRANSITION
        : ANIMATION
      : null;
    propCount = type
      ? type === TRANSITION
        ? transitionDurations.length
        : animationDurations.length
      : 0;
  }

  const hasTransform =
    type === TRANSITION &&
    transformRE.test(styles[transitionProp + 'Property']);

  return {
    type,
    timeout,
    propCount,
    hasTransform
  };
}

/**
 * @param {string[]} delays
 * @param {string[]} durations
 * @return {number}
 */
function getTimeout(delays, durations) {
  while (delays.length < durations.length) {
    delays = delays.concat(delays);
  }

  return Math.max.apply(null, durations.map((d, i) => {
    return toMs(d) + toMs(delays[i]);
  }));
}

/**
 * @param {string} s
 * @return {number}
 */
function toMs(s) {
  return Number(s.slice(0, -1)) * 1000;
}

export function isFunction(fn) {
  return typeof fn === 'function';
}

export function without(obj, exclude) {
  const target = {};

  for (const k in obj) {
    if (has(obj, k) && exclude.indexOf(k) === -1) {
      target[k] = obj[k];
    }
  }

  return target;
}

export function noop() {
  // nothing
}
