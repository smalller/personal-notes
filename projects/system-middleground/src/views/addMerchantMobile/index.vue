<template>
    <div class="add-mer-mob-box">
        <van-form @submit="onSubmit" label-width="7em">
            <van-field required v-model="formData.mName" name="mName" label="商户名称" placeholder="请输入商户名称"
                :rules="addMerRules.mName" />
            <van-field required v-model="formData.contactAddr" name="contactAddr" label="商户经营地联系地址"
                placeholder="请输入商户经营地联系地址" :rules="addMerRules.contactAddr" />

            <van-field maxlength="11" required v-model="formData.contactPhone" name="contactPhone" label="申请人手机号"
                placeholder="请输入申请人手机号" :rules="addMerRules.contactPhone" />

            <van-field required v-model="formData.contactEmail" name="contactEmail" label="申请人邮箱" placeholder="请输入申请人邮箱"
                :rules="addMerRules.contactEmail" />

            <van-field required name="businessLicenseImg" label="营业执照图片" :rules="addMerRules.businessLicenseImg">
                <template #input>
                    <van-uploader :after-read="afterRead" :max-count="1" v-model="img" />
                </template>
            </van-field>
            <div class="btn-box">
                <van-button type="primary" block native-type="submit">提交申请</van-button>
            </div>
        </van-form>
    </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'
import { addMerRules } from './static'
import { merchantApply } from './api'
import { uploadFile } from '@/common/api'
import md5 from 'js-md5'
import 'vant/lib/index.css';
import { Dialog } from 'vant';


export default defineComponent({
    name: '',
    setup() {
        document.title = '开户申请'
        const img = ref([])

        const formData = ref({
            mName: '',
            contactPhone: '',
            contactAddr: '',
            contactEmail: '',
            businessLicenseImg: '',
            mPassword: ''
        })

        const onSubmit = () => {
            setMerchantApply()
        };

        // 提交申请
        async function setMerchantApply() {
            let newData = JSON.parse(JSON.stringify(formData.value))
            const phoneNum = newData.contactPhone.substr(5)
            newData.mPassword = md5(phoneNum)
            const { code } = await merchantApply(newData)
            if (+code === 1000) {
                Dialog({ message: '提交成功，您的密码为手机号后6位，请去商户端登录完善剩余信息' });
            }
        }

        // 上传图片回调
        const afterRead = (file) => {
            uploadFile(file.file).then(res => {
                formData.value.businessLicenseImg = res.data[0].imageUrl
            })
        };

        return {
            formData,
            addMerRules,
            onSubmit,
            afterRead,
            img
        }
    }
})
</script>
<style lang='scss' scoped>
.add-mer-mob-box {
    background-color: #f7f8fa;
    padding: 12px;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;

    .btn-box {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        padding: 0 12px;
        box-sizing: border-box;
        margin-bottom: 20px;
    }

    .radio-item {
        margin-bottom: 10px;
    }
}
</style>