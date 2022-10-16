/*
 * @Author: 吴同学 
 * @Date: 2021-12-09 15:03:56 
 * @Last Modified by: 吴福亮
 * @Last Modified time: 2022-09-13 10:38:49
 */

import React from 'react';
import Calculator from './demo1.js'
import NameForm from './demo2.js'
import ShowList from './demo3'
import Clock from './demo5'
import {ShowFancyBorder,ShowSplitPane,WelcomeDialog,SignUpDialog} from './demo6'
import FilterableProductTable from './demo7'
import PropTypes from 'prop-types'

let welComProps = {
  name : 'small l',
  sex:'male',
  age:28
}

const sty = {
  color:'#000'
}

function speak() {
  return '我说话了'
}

function Demo(prop) {
  return <div>
    <p>{prop.age}</p>
    <p>{prop.sex}</p>
  </div>
}

// 对组件的参数进行限制
Demo.propTypes = {
  age: PropTypes.number.isRequired,  // 传入的值为number类型，且必传
  speak:PropTypes.func  // 限制为函数类型
}
// 设置默认值
Demo.defaultProps = {
  sex:'不男不女'
}


function App() {
  return (
    <div className="wrap" style={{background:'#fff',...sty}}>
      <Demo age={18} speak={speak} />
      <hr />
      <Clock data={welComProps} />
      <hr />
      <NameForm />
      <hr />
      <Calculator />
      <hr />
      <ShowList></ShowList>
      <hr />
      <ShowFancyBorder></ShowFancyBorder>
      <hr />
      <ShowSplitPane></ShowSplitPane>
      <hr />
      <WelcomeDialog></WelcomeDialog>
      <hr />
      <SignUpDialog></SignUpDialog>
      <hr />
      <FilterableProductTable></FilterableProductTable>
    </div>
  );
}

export default App