/*
 * @Author: 吴同学 
 * @Date: 2022-04-19 11:05:31 
 * @Last Modified by: 吴同学
 * @Last Modified time: 2022-04-19 11:06:16
 */

type Func = (data?: any) => void;
class Bus {
    list: { [key: string]: Array<Func> };
    constructor() {
        this.list = {};
    }

    $on(name: string, fn: Func): void {
        this.list[name] = this.list[name] || [];
        this.list[name].push(fn);
    }

    $emit<T>(name: string, data?: T): void {
        if (this.list[name]) {
            this.list[name].forEach((fn: Func) => {
                fn(data);
            });
        }
    }

    $off(name: string): void {
        if (this.list[name]) {
            delete this.list[name];
        }
    }
}

export default new Bus();
