import {render, h} from 'preact';
import Dialog from './dialog';
import Switch from './switch';
import './main.less';

render((
  <div className="container">
    <div className="row">
      <h3>弹出框</h3>
      <Dialog/>
    </div>
    <div className="row">
      <h3>开关</h3>
      <Switch/>
    </div>
  </div>
), document.body);
