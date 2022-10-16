/*
* @Author: 吴同学 
* @Date: 2021-12-09 15:03:38 
 * @Last Modified by: 吴福亮
 * @Last Modified time: 2022-09-12 16:28:49
*/
import React from 'react';

// 表单受控组件与非受控组件
class NameForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: '123',
      value2: '请输入文章内容',
      value3: 'mango',
      value4: true
    };

    // this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.fileInput = React.createRef(); //非受控组件，上传图片
  }

  handleChange = (e) => {
    const target = e.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  handleSubmit(e) {
    console.log(this.state.value);
    console.log(this.state.value2);
    console.log(this.state.value3);
    console.log(this.state.value4);
    console.log(this.fileInput.current.files);

    e.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          名字:
          <input name="value" type="text" value={this.state.value} onChange={this.handleChange} />
        </label>
        <br />
        <label>
          文章:
          <textarea name="value2" value={this.state.value2} onChange={(e) => this.handleChange(e)} />
        </label>
        <br />
        <label>
          选择你喜欢的风味:
          <select name="value3" value={this.state.value3} onChange={(e) => this.handleChange(e)}>
            <option value="grapefruit">葡萄柚</option>
            <option value="lime">酸橙</option>
            <option value="coconut">椰子</option>
            <option value="mango">芒果</option>
          </select>
        </label>
        <br />
        <label>
          参与:
          <input
            name="value4"
            type="checkbox"
            checked={this.state.value4}
            onChange={this.handleChange} />
        </label>
        <br />
        <input type="file" multiple ref={this.fileInput} />
        <input type="submit" value="提交" />
      </form>
    );
  }
}

export default NameForm