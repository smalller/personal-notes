  // 上传到文件服务器
    export function uploadFile(file, call) {
        const that = this
        return new Promise((resolve, reject) => {
          let data = new FormData()
          data.append('file', file)
          data.append('type', 'course')
          if (file.type.indexOf('image/') > -1) {
            data.append('bizType', 'Header')
          }
          const source = axios.CancelToken.source()
          axios({
            url: `${process.env.VUE_APP_BASE_API}/mamserver/file/upload`,
            method: 'post',
            data,
            cancelToken: source.token,
            headers: {
              firmId: 'firmId',
              token: sessionStorage.getItem('token'),
              userId: sessionStorage.getItem('userId'),
            },
            //原生获取上传进度的事件
            onUploadProgress: function (progressEvent) {
              let complete =
                ((progressEvent.loaded / progressEvent.total) * 100) | 0
              console.log('上传 ' + complete)
              if(call) {
                call('progress', (+complete === 100 ? 99 : complete))
              }
            },
          })
            .then((res) => {
              if (+res.data.code === 0) {
                resolve({
                  url: URL.createObjectURL(file),
                  data: res.data.data,
                  src: res.data.attach
                })
              } else {
                reject(res.data)
              }
            })
            .catch((err) => {
              reject(err)
            })
        })
      }
