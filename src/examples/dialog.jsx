import {Component, h} from 'preact';
import Transition from '..';
import './dialog.less';

export default class Dialog extends Component {
  constructor(props) {
    super(props);
    this.state.mode = 'out';
  }

  render(props, state) {
    return (
      <div>
        <button className="btn" type="Button" onClick={() => this.setState({mode: 'in'})}>show</button>
        <Transition className="dialog" name="dialog" mode={state.mode}>
          <p>the dialog content</p>
          <a href="#" onClick={() => this.setState({mode: 'out'})}>close</a>
        </Transition>
      </div>
    )
  }
}

