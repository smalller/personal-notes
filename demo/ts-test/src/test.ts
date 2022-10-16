let str: string = 'small l'
const testFun = (name) => {
    console.log(`hello-${name}`)
}
testFun(str);

let a: Array<string | number> = [1, 2, '3']

type type1 = string | number;
let var1: type1 = 25;
type user = {
    name: string,
    age: number
}
function fn1(arg: user) {
    console.log(arg);
}
fn1({
    name: 'smalll',
    age: var1
})



interface obj1 {
    [args: string]: string | number,
}
interface obj1 {
    sex: string
}
function fn2(arg: obj1) {
    console.log(arg)
}
fn2({
    name: 'small',
    age: 24,
    sex: 'male'
})



let obj = {
    name: 'smalll',
    age: 24
}
type t = typeof obj;
type k = keyof t;

function fn(key: k) {
    console.log(obj[key]);
}
fn('name')



type callbackType = (a: number, b: number) => number
function fn3(callback: callbackType) {
    let res = callback(3, 2);
    console.log(res)
}
fn3(function (a, b) {
    return a + b;

})



interface objType {
    a: number,
    b: number,
    sum(c: number, d: number): void
}
let objSum: objType = {
    a: 3,
    b: 2,
    sum(this: objType, c, d) {
        console.log(this.a + this.b - c + d);
    }
}
objSum.sum(1, 1)



class User {
    public name: string
    private age: number

    constructor(option) {
        this.name = option.name;
        this.age = option.age;
        this.getName();
        this.getAge();
    }

    public getName(): void {
        console.log(this.name)
    }

    private getAge(): void {
        console.log(this.age)
    }
}

interface userType {
    [args: string]: string | number | 'smalll'
}
let obj1: userType = {
    name: 'smalll',
    age: 24
}
new User(obj1)


interface sexObject {
    male: string,
    female: string
}

class User1 extends User {

    protected sex: sexObject

    constructor(option) {
        super(option);
        // this.sex = option.sex.male
        this.sex = {
            male: 'male',
            female: 'female'
        }
        this.getSex();
    }

    private getSex(): void {
        console.log(this.sex.male)
    }
}


let obj2: {
    [args: string]: string | number | object | 'smalll'
} = {
    name: 'smalll',
    age: 25,
    sex: {
        male: 'male',
        female: 'female'
    },
}
new User1(obj2);



function getVal<T>(target: T, key: keyof T) {
    console.log(target[key])
}

let obj3 = {
    x: 1,
    y: 2
}

let obj4 = {
    a: 3,
    b: 4
}

type O1 = typeof obj3;
type O2 = typeof obj4;

getVal<O1>(obj3, 'x')



interface IUser {
    name: string,
    age: number
}

class UserClass<T> {
    constructor(public target: T, public key: keyof T) {
        this.getName();
    }

    getName() {
        console.log(this.target[this.key]);
    }
}

let obj5: {
    name1: string,
    age1: number
} = {
    name1: 'mike',
    age1: 24
}

let obj6: {
    name2: string,
    age2: number
} = {
    name2: 'Lili',
    age2: 22
}

type O3 = typeof obj5;
type O4 = typeof obj6;

new UserClass<O4>(obj6, 'name2')


function fn4<T>(args: T[]) {
    console.log(args)
}

fn4<string | number>(['1', '2', 3])



class People<T extends string | number> {
    constructor(public args: T[]) { }

    getName(index: number): void {
        console.log(this.args[index])
    }
}

let people = new People<string | number>(['一号男嘉宾', '二号女嘉宾', '三号男嘉宾', 3, 4, 5])
people.getName(1)


const arrList1: Array<string | number> = ['1', '2', '3', 4];

const fn6: () => string = () => {
    return '1'
}

const f8 = function (): boolean {
    return true
}

function fn7(): number {
    return 8
}



