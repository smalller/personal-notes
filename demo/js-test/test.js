"use strict"
const print = console.log;

//extends关键字继承
class Person {
    constructor(name) {
        this.name = name;
    }

    static demoFun() {
        print('静态方法')
    }

    static demoStr = '静态属性';

    getName() {
        print('Person:', this.name);
    }
}

class NewPerson extends Person {
    constructor(name, age) {
        //子类中存在构造函数，则需要在使用this之前先调用super()
        super(name);
        this.age = age;
    }

    getName() {
        super.getName(); //调用父类的getName方法，与自身的同名方法互不影响
        print('NewPerson:', this.name);
    }
}
const per1 = new NewPerson('smalll', 20);
// per1.getName();



//借用数组方法，实现对象的增删改查操作方法
let arrLike = {
    0: 'a',
    1: 'b',
    length: 2
}
Array.prototype.push.call(arrLike, 'c', 'd');
Array.prototype.push.apply(arrLike, ['c', 'd']);
// print(arrLike)



var isPalindrome = function (x) {
    let flag = true;
    let arr = [];
    x = x.toString()
    for (let i = 0; i < x.length; i++) {
        arr.unshift(x[i])
    }
    for (let i = 0; i < x.length; i++) {
        if (x[i] !== arr[i]) {
            flag = false;
            break
        }
    }
    return flag
};
// print(isPalindrome(121))



var romanToInt = function (s) {
    s = s.replace("IV", "a");
    s = s.replace("IX", "b");
    s = s.replace("XL", "c");
    s = s.replace("XC", "d");
    s = s.replace("CD", "e");
    s = s.replace("CM", "f");

    function getNum(str) {
        switch (str) {
            case 'f':
                return 900;
            case 'e':
                return 400;
            case 'd':
                return 90;
            case 'c':
                return 40;
            case 'b':
                return 9;
            case 'a':
                return 4;
            case 'M':
                return 1000;
            case 'D':
                return 500;
            case 'C':
                return 100;
            case 'L':
                return 50;
            case 'X':
                return 10;
            case 'V':
                return 5;
            case 'I':
                return 1;
        }
    }
    let sum = 0;
    for (let i = 0; i < s.length; i++) {
        sum += getNum(s[i])
    }
    return sum
};
// print(romanToInt("III"))



var isValid = function (s) {
    while (s.includes('()') || s.includes('{}') || s.includes('[]')) {
        s = s.replace('()', '').replace('{}', '').replace('[]', '')
    }
    return s === ''
};
// print(isValid('()[([{]){}]{}'))



var removeDuplicates = function (nums) {
    let j = 0;
    for (let i = 0; i < nums.length; i++) {
        if (nums[j] != nums[i]) {
            nums[++j] = nums[i];
        }
    }
    return ++j;
};
// print(removeDuplicates([0,0,1,1,1,2,2,3,3,4]))



var twoSum = function (nums, target) {
    let obj = {}
    for(let i = 0; i < nums.length; i++) {
        const num = nums[i]
        if(num in obj) {
            return [obj[num],i]
        }
        obj[target - num] = i
    }
};
// print(twoSum([3,1,2,4], 6))