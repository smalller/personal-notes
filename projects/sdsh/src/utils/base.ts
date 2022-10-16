import request from "@/utils/request";

interface UploadFileOpt {
    accept?: string;
    multiple?: boolean;
}

export interface ResFile {
    imageUrl: string;
    path: string
}

type Download = (file: File) => Promise<ResFile>

export const uploadFile = (opt: UploadFileOpt) => new Promise((resolve, reject) => {
    const input: HTMLInputElement = document.createElement('input')
    input.type = 'file'
    input.accept = opt.accept || '.png,.jpg,.jpeg';
    input.multiple = opt.multiple || false;
    input.onchange = () => {
        if (input.files && input.files.length > 0) {
            const downloadList: any[] = []
            for (let i = 0; i < input.files.length; i++) {
                downloadList.push(upload(input.files[i]))
            }
            Promise.all(downloadList).then(res => {
                if (input.multiple) {
                    resolve(res)
                } else {
                    resolve(res[0])
                }
            })
        }
    }
    input.click()
})

const upload: Download = (file: File) => new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append('file', file);
    request({
        url: '/pay-merchant/merchantUpload/uploadImage',
        method: 'post',
        data: formData
    }).then(res => {
        resolve(res.data as ResFile)
    })
})
