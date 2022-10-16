// 接收主线程信息
this.addEventListener('message', (e) => {
    console.log('主线程传过来的数据：', e.data)
    let arr = []
    for (let i = 0; i < e.data; i++) {
        arr.push(i)
    }
    postMessage(arr)
    this.close()
  })
  