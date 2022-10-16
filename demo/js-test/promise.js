const PENDING = 'PENDING'; // 进行中
const FULFILLED = 'FULFILLED'; // 已成功
const REJECTED = 'REJECTED'; // 已失败

class MyPromise {
    constructor(executor) {
        this.status = PENDING; //初始状态为进行中

        // 将成功、失败结果放在this上，便于then、catch访问
        this.value = void 0;
        this.reason = void 0;
        this.onFulfilledCallbacks = []; // 成功态回调函数队列
        this.onRejectedCallbacks = []; // 失败态回调函数队列

        const resovle = value => {
            if (this.status === PENDING) {
                this.status = FULFILLED;
                this.value = value;
                this.onFulfilledCallbacks.forEach(fn => fn(this.value)); // 成功态函数依次执行
            }
        }
        const reject = reason => {
            if (this.status === PENDING) {
                this.status = REJECTED;
                this.reason = reason;
                this.onRejectedCallbacks.forEach(fn => fn(this.reason)); // 失败态函数依次执行
            }
        }
        try {
            // 把内部的resolve和reject传入executor，用户可调用resolve和reject
            executor(resovle, reject)
        } catch (e) {
            reject(e)
        }
    }
    then(onFulfilled, onRejected) {
        setTimeout(() => {
            if (this.status === PENDING) {
                // 如果当前状态为pending
                // 说明promise内部有异步代码执行，还未改变状态，添加到成功/失败回调任务队列
                this.onFulfilledCallbacks.push(onFulfilled);
                this.onRejectedCallbacks.push(onRejected);
            } else if (this.status === FULFILLED) {
                onFulfilled(this.value)
            } else if (this.status === REJECTED) {
                onRejected(this.reason)
            }
        })
    }
    catch(onRejected) {
        return this.then(null, onRejected);
    }
}