import {RenderableProps, Component} from 'preact';

export interface TransitionDone {
  (when?: number);
}

export interface TransitionProps {
  tag?: string;
  name?: string;
  css?: boolean;
  appear?: boolean;
  type?: string;
  mode?: string;
  onBeforeEnter?(el: Element);
  onEnter?(el: Element, done: TransitionDone);
  onAfterEnter?(el: Element, disappear?: true);
  onBeforeLeave?(el: Element);
  onLeave?(el: Element, done: TransitionDone);
  onAfterLeave?(el: Element, disappear?: true);
  [key: string]: any;
}

export default class Transition extends Component<TransitionProps, {}> {
  render(props: RenderableProps<TransitionProps>, {}): JSX.Element;
}
