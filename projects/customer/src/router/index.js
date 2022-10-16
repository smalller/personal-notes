// import request from '../utils/request';
import axios from 'axios'
import router from "../router";
import Message from "element-ui/packages/message/index.js";
import {
    api_request,
    map_request,
    file_request,
    imgHead,
    rongyunKey
} from "./ip";

// axios.defaults.timeout = 10000; //请求超时时间 单位(毫秒)

// api_request.interceptors.response.use(
//     response => {
//         if (response.data.code === 700) {
//             // Message.error(response.data.msg);
//             router.push("/login");
//             localStorage.removeItem('userInfo')
//             return Promise.reject(response.data);
//         } else {
//             return response;
//         }
//     },
//     error => {
//         if (error.message.includes("timeout")) {
//             Message.error("网络链接超时");
//         }
//         return Promise.reject(error);
//     }
// );


function post(url, data = {}) {
    return new Promise((resolve, reject) => {
        api_request.post(url, data).then(response => {
            resolve(response.data);
        }, err => {
            reject(err)
        })
    })
}

function map_get(url, data = {}) {
    return new Promise((resolve, reject) => {
        map_request.get(url, data).then(response => {
            resolve(response.data);
        }, err => {
            reject(err)
        })
    })
}

function file_get(url, data = {}) {
    return new Promise((resolve, reject) => {
        file_request.get(url, data).then(response => {
            resolve(response.data);
        }, err => {
            reject(err)
        })
    })
}

function file_post(url, data = {}) {
    return new Promise((resolve, reject) => {
        file_request.post(url, data).then(response => {
            resolve(response.data);
        }, err => {
            reject(err)
        })
    })
}

function get(url, data = {}) {
    return new Promise((resolve, reject) => {
        api_request.get(url, data).then(response => {
            resolve(response.data);
        }, err => {
            reject(err)
        })
    })
}

function Delete(url, data = {}) {
    return new Promise((resolve, reject) => {
        api_request.delete(url, data).then(response => {
            resolve(response.data);
        }, err => {
            reject(err)
        })
    })
}

function put(url, data = {}) {
    return new Promise((resolve, reject) => {
        api_request.put(url, data).then(response => {
            resolve(response.data);
        }, err => {
            reject(err)
        })
    })
}

export {
    post,
    get,
    Delete,
    put,
    map_get,
    file_get,
    file_post,
    imgHead,
    rongyunKey
}