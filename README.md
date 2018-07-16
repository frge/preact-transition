# Preact Transition

[![npm](https://img.shields.io/npm/v/preact-transition.svg)](https://www.npmjs.com/package/preact-transition)
[![npm](https://img.shields.io/npm/dt/preact-transition.svg)](https://www.npmjs.com/package/preact-transition)

过渡容器 `Transition` 组件支持 `animation`、`transition` 和 `javascript` 三类过渡动画，所有的过渡类名都将作用在此容器上。

## 安装

### NPM

```bash
# 最新版本
npm install preact-transition
``` 

### YARN

```bash
# 最新版本
yarn add preact-transition
``` 

### 直接用 `<script>` 引入

- [开发版本](https://raw.githubusercontent.com/frge/preact-transition/master/dist/transition.js)
- [生产版本](https://raw.githubusercontent.com/frge/preact-transition/master/dist/transition.min.js)

### CDN

推荐链接到一个你可以手动更新的指定版本号：

```html
<script src="https://cdn.jsdelivr.net/npm/preact-transition@0.1.4/dist/transition.js"></script>
```

你可以在 [cdn.jsdelivr.net/npm/preact-transition](https://cdn.jsdelivr.net/npm/preact-transition/) 浏览 NPM 包的源代码。

也可以在 [unpkg](https://unpkg.com/preact-transition@0.1.4/dist/transition.js) 上获取。

在你发布的站点中使用生产环境版本，把 transition.js 换成 transition.min.js。这是一个更小的构建，可以带来比开发环境下更快的速度体验。

## DEMO

[点击这里查看DEMO](https://nkcjs.github.io/preact-transition/)

## Props

* **`component`** - string，组件的根节点标签名称，默认为 `"div"`。
* **`tag`** - string，**已取消属性**，请使用属性 **component**。
* **`name`** - string，用于自动生成 CSS 过渡类名，默认类名为 `"t"`。例如：name: 'fade' 将自动拓展为下列类名：

  - `.fade-enter` - 进入前被添加到组件根节点上
  - `.fade-enter-active` - 进入过程被添加到组件根节点上
  - `.fade-enter-to` - 进入后被添加到组件根节点上
  - `.fade-leave` - 离开前被添加到组件根节点上
  - `.fade-leave-active` - 离开时被添加到组件根节点上
  - `.fade-leave-to` - 离开后被添加到组件根节点上

* **`appear`** - boolean，是否在初始渲染时使用过渡。默认为 `false`。
* **`css`** - boolean，是否使用 CSS 过渡类。默认为 `true`。如果设置为 `false`，将只通过组件事件触发注册的 JavaScript 钩子。
* **`type`** - string，指定过渡事件类型，侦听过渡何时结束。有效值为 `"transition"` 和 `"animation"`。默认将自动检测出持续时间长的为过渡事件类型。
* **`mode`** - string，控制离开/进入的过渡方式。有效值 `"out"` 和 `"in"`；默认为 `"in"`。

## 事件

所有事件的第一个参数 `el` 是组件容器根节点；

在不使用 CSS 过渡时， `enter` 和 `leave` 事件接收的第二个参数 `done`，可以用于结束动画，done 函数可以接收一个**数值参数**，用于**延迟过渡到多少毫秒后**结束；

在组件初始渲染时，如果不使用过渡，则 `afterEnter` 和 `afterLeave` 事件会接收到第二个参数 `disappear` ，表示未使用过渡，直接到达了目标状态。
 
* onBeforeEnter(el: `Element`) - 进入前被执行
* onEnter(el: `Element`, done: `Function`) - 进入时被执行
* onAfterEnter(el: `Element`, disappear?: `Boolean`) - 进入结束被执行
* onBeforeLeave(el: `Element`) - 离开前被执行
* onLeave(el: `Element`, done: `Function`) - 离开时被执行
* onAfterLeave(el: `Element`, disappear?: `Boolean`) - 离开结束被执行

## 用法

```jsx harmony
import {h, render} from 'preact';
import Transition from 'preact-transition';

class Switch extends Component {
  constructor(props) {
    super(props);

    this.state.mode = 'out';
    this.change = this.change.bind(this);
  }
  
  change() {
    this.setState({
      mode: state.mode === 'in' ? 'out' : 'in'
    })
  }

  render(props, state) {
    return (
      <Transition className="switch" name="switch" mode={state.mode} onClick={this.change}>
        <div className="track">
          <span>on</span>
          <span>off</span>
        </div>
        <div className="thumb"/>
      </Transition>
    );
  }
}

render(
  Switch,
  document.body
);

// 事件钩子
class Dialog extends Component {
  constructor(props) {
    super(props);
  }
  
  onBeforeEnter(el) {}
  onEnter(el, done) {}
  onAfterEnter(el, disappear) {}
  
  onBeforeLeave(el) {}
  onLeave(el, done) {}
  onAfterLeave(el, disappear) {}
  
  render({display, children}) {
    const mode = display === 'show' ? 'in' : 'out';

    return (
      <Transition mode={mode} name="dialog" css={false}>
        {children}
      </Transition>
    );
  }
}

render(
  <Dialog>
    <p>The dialog content is here.</p>
  </Dialog>,
  document.body
);

```


## License
MIT © 2018, Yingqin Zhang 