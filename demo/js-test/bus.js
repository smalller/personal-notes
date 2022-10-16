const print = console.log

class Bus {
    constructor() {
      this.list = {};
    }
  
    $on(name, fn) {
        if (this.list[name]) {
            this.list[name].push(fn)
        } else {
            this.list[name] = [fn]
        }
    }

    $emit(name, data) {
      if (this.list[name]) {
        this.list[name].forEach((fn) => {
          fn(data);
        });
      }
    }
  
    $off(name) {
      if (this.list[name]) {
        delete this.list[name];
      }
    }
}

const bus = new Bus()

 bus.$on('update', (res) => {
    print(333, res)
})

bus.$on('update', (res) => {
    print(333, res)
})

bus.$emit('update', 111)