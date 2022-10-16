//渲染类
export default class Render extends EventTarget {
  constructor(options) {
    super();
    this.$options = options;
  }

  //寻找el里的相关子节点，以及渲染双花括号里的内容
  compile() {
    let el = document.querySelector(this.$options.el);
    let childNodes = el.childNodes; //获取el里所有的子节点
    this.renderDoubleBrace(childNodes)
  }

  //渲染双花括号里的内容到标签里
  renderDoubleBrace(ele) {
    ele.forEach(item => {
      if (item.nodeType === 1) {
        //获取纯标签节点里的所有属性
        let attrs = item.attributes;
        [...attrs].forEach(i => {
          //只操作以'v-'开头的属性
          if (i.name.indexOf('v-') === 0) {
            switch (i.name) {
              case 'v-html':
                item.innerHTML = this.$options.data[i.value];
                break;
              case 'v-model':
                item.addEventListener('input', e => {
                  this.$options.data[i.value] = item.value;
                })
                break;
            }
          }
        })

        //如果是标签节点，且里面有子节点
        if (item.childNodes.length > 0) {
          this.renderDoubleBrace(item.childNodes); //递归调用
        }
      } else if (item.nodeType === 3) {
        //如果是纯文本节点
        let reg = /\{\{\s*(\S+)\s*\}\}/g; //匹配{{}}以及里面的内容
        let con = item.textContent; //获取当前节点的文本

        //如果匹配到
        if (reg.test(con)) {
          let $1 = RegExp.$1; //获取匹配到的双花括号中的文本
          item.textContent = item.textContent.replace(reg, this.$options.data[$1]) //将其中匹配到的内容替换成data对象中所对应的值

          //在匹配这里触发事件，$1是要操作的数据，后面是回调操作
          this.addEventListener($1, e => {
            //获取老视图数据
            let oldValue = this.$options.data[$1];

            let reg = new RegExp(oldValue)

            //将老数据替换成新数据
            item.textContent = item.textContent.replace(reg, e.detail);
          })
        }
      }
    })
  }
}