'use strict'
const print = console.log;



//数据属性
let person = {};
Object.defineProperty(person, 'age', {
    configurable: true,
    value: '20'
})

Object.defineProperty(person, 'age', {
    value: '18'
})

// print(person.age);
// delete person.age
// person.age = 20;
// print(person.age);



//访问器属性
/**
 * _year前面的下划线是一种常用的记号，用于只能通过对象方法访问的属性。且该处不能使用箭头函数
 * 而访问器属性year包含一个getter函数和一个setter函数。getter函数返回_year的值，setter函数通过计算来确定正确的版本
 * vue2的双向绑定原理
 */
let beer = {
    _year: 2004,
    num: 1
}

Object.defineProperty(beer, 'year', {
    get() {
        return this._year
    },

    set(newVal) {
        if (newVal != this._year) {
            this._year = newVal;
            this.num++;
        }
    }
})
// print(beer)

beer.year = 2004;
print(beer)
beer.year = 2020;
print(beer)



//定义多个属性
let book = {
    _year: 2004,
    num: 1
};

Object.defineProperties(book, {
    num: {
        writable: true,
        value: 2
    },

    _year: {
        get() {
            return this._year
        },

        set(newVal) {
            if (newVal != this._year) {
                this._year = newVal;
                this.num = 11;
            }
        }
    },
})

// book.year = 2020;
// print(book)



//读取属性的特性
let obj = {
    _year: 2004,
    num: 1
}

var res = Object.getOwnPropertyDescriptor(obj, '_year');
// print(res);