'use stict'
const print = console.log;

class Suve {
    constructor(options) {
        this.$options = options;
        this.observe(this.$options.data);
        this.compile();
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
                }
            }
        })
    }

    //先获取所有属性
    observe(data) {
        let keys = Object.keys(data);
        keys.forEach(key => {
            this.definePropertyData(data, key, data[key]);
        })
    }


    //拦截并修改
    definePropertyData(data, key, value) {
        Object.defineProperty(data, key, {
            get() {
                return value;
            },
            set(newVal) {
                value = newVal;
                print(data)
            }
        })
    }
}