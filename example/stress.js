import React, {Component} from 'react';
import {render} from 'react-dom';
import {Root, local} from '../src';
import {cps, put} from 'redux-saga';

import styles from './stress.css';

function sleep(period, done){
  setTimeout(() => done(null, true), period);
}

function toHex(n) {
  n = n.toString(16);
  n = n.length < 2 ? '0' + n : n;
  return n;
}

function ltoRgb(l){
  let v = toHex(Math.round(l * 2.55));
  return '#' + v + v + v;
}

@local({
  ident: ({id}) => `cell:${id}`,
  initial: () => ({
    period: Math.random() * 8000,
    brightness: Math.random() * 100
  }),
  *saga(_, {getState, $}){
    while (true){
      yield cps(sleep, getState().period);
      yield put($('setState', {brightness: Math.random() * 100}));
    }
  }
})
class Cell extends Component{
  render(){
    let {brightness} = this.props.state;
    return <div className={styles.cell} style={{backgroundColor: ltoRgb(brightness)}} />;
  }
}

function times(n, fn){
  let arr = [];
  for (let i = 0; i < n; i++){
    arr.push(fn(i));
  }
  return arr;
}

class App extends Component {
  render() {
    return <div onClick={this.onClick}>
      {times(400, i => <Cell id={i} key={i} />)}
    </div>;
  }
}


render(<Root><App /></Root>, document.getElementById('app'));

