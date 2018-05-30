import {Component, h} from 'preact';
import {ANIMATION, defer, isFunction, noop, TRANSITION, whenTransitionEnds, without} from './util';

const transitions = [
  'enter',
  'enter-active',
  'enter-to',
  'leave',
  'leave-active',
  'leave-to'
];

const hooks = [
  'onBeforeEnter',
  'onEnter',
  'onAfterEnter',
  'onBeforeLeave',
  'onLeave',
  'onAfterLeave',
  // todo 下一个主要版本实现下面两个钩子：
  // 'onEnterCancelled',
  // 'onLeaveCancelled',
];

const nonWrapProps = [
  ...hooks,
  'type',
  'mode',
  'appear',
  'tag',
  'ref',
  'name',
  'css'
];

function transit(t, name, callback) {
  const setState = t.setState.bind(t);
  let key = name === 'enter' ? 0 : 3;
  const {css = true} = t.props;

  function hook(...args) {
    const fn = t.props[hooks[key]];
    if (!isFunction(fn)) return;
    return fn(t.DOM, ...args);
  }

  function after() {
    setState({transfer: ++key}, () => {
      defer(hook);// 执行 onAfterEnter/onAfterLeave
      callback && defer(() => callback());
    });
  }

  function setup() {
    setState({transfer: ++key}, () => {
      // 如果使用 css 动画，则自动检测何时结束
      if (css) {
        whenTransitionEnds(t.DOM, t.props.type, (type) => {
          hook(noop);// 执行 onEnter/onLeave

          if (type === TRANSITION || type === ANIMATION) {
            // 明确知道使用了CSS动画，则直接更新状态
            after();
          } else {
            defer(after);
          }
        });
      } else {
        // 只有通过 javascript 的钩子函数，才能确定过渡是否结束。
        // 执行 onEnter/onLeave
        hook((when) => {
          if (when !== +when) defer(after);
          else setTimeout(after, when);
        });
      }
    });
  }

  function before() {
    const when = hook();// 执行 onBeforeEnter/onBeforeLeave
    if (when !== +when) defer(() => setup());
    else setTimeout(setup, when);
  }

  setState({transfer: key}, () => {
    defer(before);
  });
}

function disappearTransit(t, name, callback) {
  const transfer = name === 'enter' ? 2 : 5;
  const hook = t.props[hooks[transfer]];
  t.setState({transfer}, () => {
    if (isFunction(hook)) defer(() => hook(t.DOM, true));
    if (isFunction(callback)) defer(() => callback());
  });
}

/**
 * `Transition` 组件将作为过渡容器使用，
 * 所有的过渡类名都将作用在此容器上。
 */
export default class Transition extends Component {
  /**
   * @param {object} props
   * @param {string} props.tag
   * @param {string} props.name
   * @param {string} props.css
   * @param {boolean} props.appear
   * @param {string} props.type
   * @param {string} props.mode
   */
  constructor(props) {
    super(props);
    this.state.transfer = -1;
    this.state.mode = undefined;
    this.DOM = null;
  }

  componentDidMount() {
    const {mode = 'in', appear = false} = this.props;
    const isEnter = mode === 'in';
    const callback = () => this.setState({mode});
    if (!appear) disappearTransit(this, isEnter ? 'enter' : 'leave', callback);
    else if (isEnter) transit(this, 'enter', callback);
    else transit(this, 'leave', callback);
  }

  componentWillReceiveProps({mode}) {
    if (!mode || mode === this.state.mode) return;
    const callback = () => this.setState({mode});
    if (mode === 'in') transit(this, 'enter', callback);
    else transit(this, 'leave', callback);
  }

  render(props, {transfer = -1}) {
    const {ref, name = 't', css = true} = props;
    const attrs = without(props, nonWrapProps);

    attrs.ref = (node) => {
      isFunction(ref) && ref(node);
      this.DOM = node;
    };

    if (css && transitions[transfer]) {
      attrs.className = [
        attrs.className,
        name + '-' + transitions[transfer]
      ]
        .filter(Boolean)
        .join(' ');
    }

    return h(props.tag || 'div', attrs);
  }
}
