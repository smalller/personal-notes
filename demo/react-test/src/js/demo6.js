/*
 * @Author: 吴同学 
 * @Date: 2022-03-18 09:45:38 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2022-09-12 16:25:53
 */

// 组合，类似于vue中的插槽

import React from 'react';

function Contacts() {
    return(
        <h1 className="Dialog-title">
            Welcome
        </h1>
    )
}
function Chat() {
    return(
        <p className="Dialog-message">
            Thank you for visiting our spacecraft!
        </p>
    )
}



// 通过 children prop 来将他们的子组件传递到渲染结果中，就类似于vue中的匿名插槽
function FancyBorder(props) {
    return (
        <div className={'FancyBorder FancyBorder-' + props.color}>
          {props.children}
        </div>
    );
}
function ShowFancyBorder() {
    return(
        <FancyBorder color="blue">
            <Contacts></Contacts>
            <Chat />
        </FancyBorder>
    )
}



// 自行约定传入：将所需内容传入 props，并使用相应的 prop，就跟传普通值一样，类似于vue的具名插槽
function SplitPane(props) {
    return (
      <div className="SplitPane">
        <div className="SplitPane-left">
          {props.left}
        </div>
        <div className="SplitPane-right">
          {props.right}
        </div>
      </div>
    );
}
function ShowSplitPane() {
    return (
        <SplitPane
        left={
            <Contacts />
        }
        right={
            <Chat />
        } />
    );
}



// 特例关系，比如 WelcomeDialog 可以说是 Dialog 的特殊实例
function Dialog(props) {
    return (
      <FancyBorder color="blue">
        <h1 className="Dialog-title">
          {props.title}
        </h1>
        <p className="Dialog-message">
          {props.message}
        </p>
        {props.children}
      </FancyBorder>
    );
}
function WelcomeDialog() {
    return (
        <Dialog
            title="Welcome"
            message="Thank you for visiting our spacecraft!"
        />
    );
}
class SignUpDialog extends React.Component {
    constructor(props) {
      super(props);
      this.handleChange = this.handleChange.bind(this);
      this.handleSignUp = this.handleSignUp.bind(this);
      this.state = {login: ''};
    }
  
    render() {
      return (
        <Dialog title="Mars Exploration Program" message="How should we refer to you?">
          <input value={this.state.login} onChange={this.handleChange} />
          <button onClick={this.handleSignUp}>登录</button>
        </Dialog>
      );
    }
  
    handleChange(e) {
      this.setState({login: e.target.value});
    }
  
    handleSignUp() {
      alert(`欢迎光临！${this.state.login}！`);
    }
}

export {
    ShowFancyBorder,
    ShowSplitPane,
    WelcomeDialog,
    SignUpDialog
}