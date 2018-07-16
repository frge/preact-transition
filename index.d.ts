import {RenderableProps, Component} from 'preact';

export interface TransitionDone {
  (when?: number): void;
}

export interface TransitionProps {
  component?: string;
  tag?: string;// 被取消的属性
  name?: string;
  css?: boolean;
  appear?: boolean;
  type?: string;
  mode?: string;
  onBeforeEnter?(el: Element): void;
  onEnter?(el: Element, done: TransitionDone): void;
  onAfterEnter?(el: Element, disappear?: true): void;
  onBeforeLeave?(el: Element): void;
  onLeave?(el: Element, done: TransitionDone): void;
  onAfterLeave?(el: Element, disappear?: true): void;
  [key: string]: any;
}

export default class Transition extends Component<TransitionProps, {}> {
  render(props: RenderableProps<TransitionProps>, {}): JSX.Element;
}
