[toc]

### 什么是ts
- ts 是添加了类型系统的 JavaScript，适用于任何规模的项目。
- ts 是一门静态类型、弱类型的语言。
- ts 是完全兼容 JavaScript 的，它不会修改 JavaScript 运行时的特性。

### 基础静态类型
- string
- number
- boolean
- null
- undefined
- void
- symbol
### 对象静态类型
- 数组类型
```ts
let a : number[] = [1,2,3]
let a : Array<string | number> = [1,'2',3]  //泛型写法
let a : [string,number] = ['1',2] //元组类型写法，初始值必须和类型要一一对应
```
- 对象类型
```ts
let a : Object = {}
let a : {name : string,age : number} [] = [{}] //定义集合
let a : Array<Object> //泛型方式定义集合
```

- 函数类型
```ts
const fn6: (a:string) => string = () => {
  return a
}

function fn7(): void {
  console.log(2)
}

//返回值为永远也执行不完的类型，比如报错，死循环
function errorFunction() : never {
  throw new Error();
}

//给参数是对象的参数定义类型
function fn({a,b} : {a : number, b : number}) {
  return a + b;
}
fn({a : 1, b : 2})


// 剩余参数（剩余参数类型必须是字符串类型）
interface Obj {
  [key:string] : string
}
function merge(target:Obj,...other:Array<Obj>) {
  ...
}
merge({x:1},{y:2},{x:3})

// 函数重载
function reverse(x: number): number;
function reverse(x: string): string;
function reverse(x: number | string): number | string {
    if (typeof x === 'number') {
        return Number(x.toString().split('').reverse().join(''));
    } else if (typeof x === 'string') {
        return x.split('').reverse().join('');
    }
}
// 以上三个函数为两套不同规则的函数，会根据传入参数的类型，去执行相应的函数
```
- 枚举类型
```ts
enum HTTP_CODE {
  OK = 200,
  NOT_FOUND = 404,
  NOT_ALLOWED //默认值为405
}

HTTP_CODE.OK  //初始赋值后，就只能调用，不能再次赋值
// 注：第一个枚举值如果不赋值，则值默认为0；如果后续的枚举值不赋值，则值默认为上一个枚举值的值+1，如果上一个枚举值是字符串值，则该枚举值必须赋值
```

### 类型（type）
不具有合并类型（后定义的同名类型会覆盖前面定义的同名类型）
```ts
type A = string | number | 'smalll';  //联合类型

type Fn = (a : string) => void

type NewType = A & Fn //交叉类型，将两个类型合并成一个新的类型，兼并两个类型

type User = {
  name : string,
  age : number
}

function fn(arg : User):Fn {
  ...
}
fn({
  name : 'smalll',
  age : 25
})
```

### 接口（interface）
具有合并扩展类型（后定义的同名对象类型能够与前面定义的同名对象类型相合并）
```ts
// 定义一个对象类型的接口
interface User {
  name : string | 'smalll';
  readonly sex : string;  //只读属性，只允许在初始化时赋值，后续就不能修改
  age? : number;  //可选属性，表示age值不一定要传
  eat() : void;  //表示定义了一个对象中的无返回值的函数类型
  [key : string] : number | string | undefined; //任意属性：如果不知道后续还会有什么属性要传入，就可用该操作
}

// 接口继承（User2中不仅要有say方法，还要有User中的所有方法和属性，并且能够相互被断言）
interface User2 extends User {
  say(msg:string) : void
}

// 定义一个函数类型的接口
interface Fun {
  (a:string,b:number) : void
}


class Point {
    x: number;
    y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}


// 接口继承类（声明 Point 类时创建的 Point 类型只包含其中的实例属性和实例方法，所以接口继承类的时候，也只会继承它的实例属性和实例方法）
interface Point3d extends Point {
    z: number;
}

let point3d: Point3d = {x: 1, y: 2, z: 3};
```


### 类型提取
```ts
let obj = {
  name : 'smalll',
  age : 24
}
type T = typeof obj;  //将obj中的对象和属性类型提取出来，赋给T
type K = keyof T; //将T中的所有键提取出来，赋给K

//调用此函数，传入的值只能是k中提取出来的键名（相当于 'name' | 'age'）
function fn(key:K) {
  return obj[key];  //返回obj中某个键名对应的值
}
fn('name')
```



### this的标注
```ts
interface objType {
  a: number,
  b: number,
  sum(): void
}

let objSum: objType = {
  a: 3,
  b: 2,
  sum(this: objType) {  //或者 typeof objSum，这样这里调用this就只能访问objSum内的变量，访问其他的就会报错
    return this.a + this.b
  },

  // 箭头函数中this的使用方式
  merge(this : objType,c : string) {
    return () => {
      this.a + c
    }
  }
}
```

### 类
**类的修饰符**
- public：公有的，默认；访问级别：自身，子类，类外
- protected：受保护的；访问级别：自身，子类
- private：私有的；访问级别：自身
- readonly：只读；访问级别：自身，子类，类外，只不过是只读，不能操作
```ts
class User {
  //与js不同的是，变量必须全部提出来进行标注
  name : string
  age : number
  
  constructor (name,age) {
    this.name = name;
    this.age = age;
  }
}

let a:User = new User('small',28) // 给类加上类型

// 声明一个类后，也可以将这个类当场一个类型来使用
function printPoint(p: User) {
    console.log(p.name, p.age);
}

//类的访问修饰符写法
class User {
  constructor(public readonly name: string, public age: number) {
    /*
      这里就相当于以下操作，以下操作都可以不用写
      name : string
      age : number
      
      this.name = option.name;
      this.age = option.age;
    */
  }
}


//interface描述类
//描述类的静态属性与静态方法（这个接口相当于People new出来的实例的描述）
interface NewPeopleClass {
  name : string,
  age : number,
  eat() : void
}

//描述类（这个接口相当于People整个类本身的描述）
interface PeopleClass {
  (name : string,age : number) : NewPeopleClass //描述一个普通函数，（）里是必传参数，后面是返回什么类型
  new (name : string,age : number) : NewPeopleClass //描述一个可被new的函数
  sex : string, //类里的静态属性
  getSex() : void //类里的静态方法
}
```

### 抽象（abstract）
- 当一个类不清楚方法的具体实现细节，或者细节需要子类来实现，就可以使用抽象；同时还可以依靠抽象来约束子类中该方法的结构
- 当父类里的一个方法被抽象时，这个方法只是定义结构，而不允许实现相关操作；抽象方法的实现操作只能是依靠子类来实现
- 当一个类里有抽象方法时，那么这个类也必须是抽象的
- 当一个类是抽象的时候，这个类是不能够被实例化的
- 当一个子类继承了抽象父类，那么这个子类里就必须有父类中所被抽象的方法，并且才能够被实例化，否则的话该子类也必须是抽象的
```ts
//如：
abstract class User {
  public name;
  public constructor(name) {
    this.name = name;
  }
  abstract render() : string
  public abstract sayHi();
}

class User1 extends User {
  render() : string {
    ...
  }

  public sayHi() {
    console.log(`Meow, My name is ${this.name}`);
  }
}
```


### 类的接口继承（implements）
- 类中实现接口可以使用泛型进行定义，还可以使用implements进行接口继承
- 如果一个类implements了一个接口，那么就必须实现该接口中的所有契约
- 多个接口继承用逗号分隔
- implements与extends可同时存在

```ts
interface Log {
  getInfo() : void
}

interface Light {
    lightOn(): void;
    lightOff(): void;
}

class Person extends Component<T1,T2> implements Log,Light {
  getInfo() {
    ...
  }
  lightOn() {
    ...
  }
  lightOff() {
    ...
  }
}
```


### 泛型（generics）
泛型是指在定义函数、接口或类的时候，不预先指定具体的类型，而在使用的时候再指定类型的一种特性。
```ts
//如：
function createArray<T>(length: number, value: T): Array<T> {
    let result: T[] = [];
    for (let i = 0; i < length; i++) {
        result[i] = value;
    }
    return result;
}

createArray<string>(3, 'x'); // ['x', 'x', 'x']


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


// 定义泛型的时候，可以一次定义多个类型参数
function swap<T, U>(tuple: [T, U]): [U, T] {
    return [tuple[1], tuple[0]];  // 交换输入的元组
}

swap([7, 'seven']); // 这里也可以不手动指定具体类型，而让类型推论自动推算出来
```

**泛型约束**
在函数内部使用泛型变量的时候，由于事先不知道它是哪种类型，所以不能随意的操作它的属性或方法
```ts
// 只允许这个函数传入那些包含 length 属性的变量。这就是泛型约束
interface Lengthwise {
    length: number;
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
    console.log(arg.length);
    return arg;
}
```

**泛型接口**
使用含有泛型的接口来定义函数的形状
```ts
interface CreateArrayFunc {
    <T>(length: number, value: T): Array<T>;
}

let createArray: CreateArrayFunc;
createArray = function<T>(length: number, value: T): Array<T> {
    let result: T[] = [];
    for (let i = 0; i < length; i++) {
        result[i] = value;
    }
    return result;
}

createArray(3, 'x'); // ['x', 'x', 'x']

// 或者把泛型参数提前到接口名上
interface CreateArrayFunc<T> {
    (length: number, value: T): Array<T>;
}
// 但此时在使用泛型接口的时候，需要定义泛型的类型。
let createArray: CreateArrayFunc<any>;
```

**泛型类**
```ts
class GenericNumber<T> {
    zeroValue: T;
    add: (x: T, y: T) => T;
}

let myGenericNumber = new GenericNumber<number>();
myGenericNumber.zeroValue = 0;
myGenericNumber.add = function(x, y) { return x + y; };
```

**泛型参数的默认类型**
当使用泛型时没有在代码中直接指定类型参数，从实际值参数中也无法推测出时，这个默认类型就会起作用。
```ts
function createArray<T = string>(length: number, value: T): Array<T> {
    let result: T[] = [];
    for (let i = 0; i < length; i++) {
        result[i] = value;
    }
    return result;
}
```


## 装饰器
装饰器就是⼯⼚函数，它能访问和修改装饰⽬标
```ts
//类装饰器表达式会在运⾏时当作函数被调⽤，类的构造函数作为其唯⼀的参数。
function log(target: Function) {
 // target是构造函数
 target.prototype.log = function() {
  console.log(this.bar);
 }
}

@log
class Foo {
 bar = 'bar'
}

const foo = new Foo();
foo.log();
```