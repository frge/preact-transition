import {Component, h} from 'preact';
import Transition from '..';
import './switch.less';

export default class Switch extends Component {
  constructor(props) {
    super(props);
    this.state.mode = 'out';
  }

  render(props, state) {
    return (
      <Transition
        className="switch"
        mode={state.mode}
        name="switch"
        onClick={() => this.setState({mode: state.mode === 'in' ? 'out' : 'in'})}>
        <div className="track">
          <span>on</span>
          <span>off</span>
        </div>
        <div className="thumb"/>
      </Transition>
    );
  }
}
