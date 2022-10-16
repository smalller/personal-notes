import notifyModel from '@/components/notify/notify-push-model'

const notify = {}
notify.install = (vue, options) => {
    const ToastCon = vue.extend(notifyModel)
    const ins = new ToastCon()
    ins.$mount(document.createElement('div'))
    document.body.appendChild(ins.$el)
    vue.prototype.$notify = {
        show(options) {
            if (ins.visible === true) { //如果已经是显示的
                ins.translate = 'top-leave';
                ins.close()
                setTimeout(() => {
                    if (typeof options === 'string') { // 对参数进行判断
                        ins.text = options
                    } else if (typeof options === 'object') {
                        Object.assign(ins, options) // 合并参数与实例
                    }
                    // ins.visible = true
                    ins.open()
                }, ins.closeDuration)

                if (typeof options === 'object' && options.auto) { //3s后自动隐藏
                    ins.autoHide()
                }
            } else {
                if (typeof options === 'string') { // 对参数进行判断
                    ins.text = options
                } else if (typeof options === 'object') {
                    Object.assign(ins, options) // 合并参数与实例
                }
                // ins.visible = true
                ins.open()
            }

        },
        hide() {
            ins.visible = false
            ins.translate = 'top-leave';
            ins.close()
        }

    }
}

export default notify;