// components/selfModel/model.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        show:Boolean,
        text:String,
        data:{
            type: Object,
            value: ''
        },
        title:{
            type: String,
            value: ''
        },
        cancelText:{
            type: String,
            value: '取消'
        },
        confirmText:{
            type: String,
            value: '确认'
        }
    },
    /**
     * 组件的初始数据
     */
    data: {

    },

    /**
     * 组件的方法列表
     */
    methods: {
        cancel() {
            this.triggerEvent('cancel', {
                data: this.data.data
            })
        },
        confirm() {
            this.triggerEvent('confirm', {
                data: this.data.data
            })
        },
    }
})
