var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var str = 'small l';
var testFun = function (name) {
    console.log("hello-" + name);
};
testFun(str);
var var1 = 25;
function fn1(arg) {
    console.log(arg);
}
fn1({
    name: 'smalll',
    age: var1
});
function fn2(arg) {
    console.log(arg);
}
fn2({
    name: 'small',
    age: 24,
    sex: 'male'
});
var obj = {
    name: 'smalll',
    age: 24
};
function fn(key) {
    console.log(obj[key]);
}
fn('name');
function fn3(callback) {
    var res = callback(3, 2);
    console.log(res);
}
fn3(function (a, b) {
    return a + b;
});
var objSum = {
    a: 3,
    b: 2,
    sum: function (c, d) {
        console.log(this.a + this.b - c + d);
    }
};
objSum.sum(1, 1);
var User = /** @class */ (function () {
    function User(option) {
        this.name = option.name;
        this.age = option.age;
        this.getName();
        this.getAge();
    }
    User.prototype.getName = function () {
        console.log(this.name);
    };
    User.prototype.getAge = function () {
        console.log(this.age);
    };
    return User;
}());
var obj1 = {
    name: 'smalll',
    age: 24
};
new User(obj1);
var User1 = /** @class */ (function (_super) {
    __extends(User1, _super);
    function User1(option) {
        var _this = _super.call(this, option) || this;
        // this.sex = option.sex.male
        _this.sex = {
            male: 'male',
            female: 'female'
        };
        _this.getSex();
        return _this;
    }
    User1.prototype.getSex = function () {
        console.log(this.sex.male);
    };
    return User1;
}(User));
var obj2 = {
    name: 'smalll',
    age: 25,
    sex: {
        male: 'male',
        female: 'female'
    },
};
new User1(obj2);
function getVal(target, key) {
    console.log(target[key]);
}
var obj3 = {
    x: 1,
    y: 2
};
var obj4 = {
    a: 3,
    b: 4
};
getVal(obj3, 'x');
var UserClass = /** @class */ (function () {
    function UserClass(target, key) {
        this.target = target;
        this.key = key;
        this.getName();
    }
    UserClass.prototype.getName = function () {
        console.log(this.target[this.key]);
    };
    return UserClass;
}());
var obj5 = {
    name1: 'mike',
    age1: 24
};
var obj6 = {
    name2: 'Lili',
    age2: 22
};
new UserClass(obj6, 'name2');
function fn4(args) {
    console.log(args);
}
fn4(['1', '2', 3]);
var People = /** @class */ (function () {
    function People(args) {
        this.args = args;
    }
    People.prototype.getName = function (index) {
        console.log(this.args[index]);
    };
    return People;
}());
var people = new People(['一号男嘉宾', '二号女嘉宾', '三号男嘉宾', 3, 4, 5]);
people.getName(1);
var arrList1 = ['1', '2', '3', 4];
var fn6 = function () {
    return '1';
};
var f8 = function () {
    return true;
};
function fn7() {
    return 8;
}
