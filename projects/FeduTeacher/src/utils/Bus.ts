type Func = (data?: any) => void;
class Bus {
  list: { [key: string]: Array<Func> };
  constructor() {
    this.list = {};
  }

  $on(name: string, fn: Func) {
    this.list[name] = this.list[name] || [];
    this.list[name].push(fn);
  }

  $emit<T>(name: string, data?: T) {
    if (this.list[name]) {
      this.list[name].forEach((fn: Func) => {
        fn(data);
      });
    }
  }

  $off(name: string) {
    if (this.list[name]) {
      delete this.list[name];
    }
  }
}

export default Bus;
