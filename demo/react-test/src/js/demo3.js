/*
 * @Author: 吴同学 
 * @Date: 2021-12-10 17:22:45 
 * @Last Modified by: 吴福亮
 * @Last Modified time: 2022-09-13 15:14:23
 */
import React, { Component,createRef } from 'react'
import '../css/demo3.css'

const datas = {
    family: {
        title: '家人',
        list: [
            { name: '爸爸' },
            { name: '妈妈' }
        ]
    },
    friend: {
        title: '朋友',
        list: [
            { name: '张三' },
            { name: '李四' },
            { name: '王五' }
        ]
    },
    customer: {
        title: '客户',
        list: [
            { name: '阿里' },
            { name: '腾讯' },
            { name: '头条' }
        ]
    }
};

class List extends Component {
    state = {
        show: false,
    }

    dtRef = createRef()

    handleShow() {
        console.log(222,this.dlRef);
        console.log(333,this.dtRef.current);
        this.setState({
            show: !this.state.show
        }, () => {
            console.log('状态更新完毕的回调');
        });
    }

    render() {
        const { show } = this.state;
        let { list, title } = this.props.data;
        return (
            <dl ref={c => this.dlRef = c} className={`friend-group ${show && 'expanded'}`}>
                <dt ref={this.dtRef} onClick={() => this.handleShow() }>{title}</dt>
                {list.map((item, index) => <dd key={index}>{item.name}</dd>)}
            </dl>
        )
    }
}

export default class ShowList extends Component {
    handleClick = () => {
        console.log(111,this.refs.friendRef);
    }

    render() {
        return (
            <div className="friend-list" ref='friendRef' onClick={this.handleClick}>
                {
                    Object.keys(datas).map((item, index) => <List key={index} data={datas[item]} />)
                }
            </div>
        )
    }
}

