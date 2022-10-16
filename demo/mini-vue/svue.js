import Render from './render.js'

//数据劫持并修改类
export default class Svue extends Render {
    constructor(options) {
        super(options);
        super.compile();
        this.observe(this.$options.data);
    }

    //先获取所有属性
    observe(data) {
        Object.keys(data).forEach(key => {
            this.definePropertyData(data, key, data[key]);
        })

        // this.proxyData(data);
    }

    //使用代理替代defineProperty（vue3使用的拦截方式）
    proxyData(data) {
        let _this = this;
        this.$options.data = new Proxy(data, {
            get(target, key) {
                return target[key]
            },

            set(target, key, newVal) {
                //在EventTarget上注册特定事件类型的事件处理程序
                let event = new CustomEvent(key, {
                    detail: newVal
                });

                //将事件分派到此EventTarget
                _this.dispatchEvent(event)

                target[key] = newVal;

                return true
            }
        })
    }


    /**
     * 拦截并修改（vue2使用的拦截方式）
     * data:是哪个对象里的
     * key:是对象里的哪个属性
     * value:要修改成的值
     * 当data层级多时，就要递归调用，所以效率不如proxy高
     */
    definePropertyData(data, key, value) {
        // this.observe(value);

        let _this = this;
        Object.defineProperty(data, key, {
            get() {
                return value;
            },
            set(newVal) {
                // this.observe(newVal);

                //在EventTarget上注册特定事件类型的事件处理程序
                let event = new CustomEvent(key, {
                    detail: newVal
                });

                //将事件分派到此EventTarget
                _this.dispatchEvent(event)

                value = newVal;
            }
        })
    }
}