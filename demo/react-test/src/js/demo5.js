/*
 * @Author: 吴同学 
 * @Date: 2022-03-17 11:33:34 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2022-05-05 22:45:06
 */
import React from 'react';

export default class Clock extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      age: props.data.age
    };

    // 为了在回调中使用 `this`，这个绑定是必不可少的
    // this.clickFun = this.clickFun.bind(this);
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  // 代替性写法
  // clickFun = (age,e) => {
  //   this.setState({
  //     age
  //   })
  // }

  clickFun(age) {
    this.setState({
      age
    })
  }

  Greeting(age) {
    if (age % 2 === 0) {
      return <GuestGreeting />;
    } else {
      return <UserGreeting />;
    }
  }

  render() {
    return (
      <div>
        {this.Greeting(this.state.age)}
        <h2>It is {this.state.age}.</h2>
        {/* <button onClick={(e) => {this.clickFun(29,e)}}>
            +
          </button> */}
        <button onClick={() => this.clickFun(29)}>
          +
        </button>
      </div>
    );
  }
}

function UserGreeting(props) {
  return <h1>这是单数</h1>;
}

function GuestGreeting(props) {
  return <h1>这是双数</h1>;
}
