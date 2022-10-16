<template>
    <el-card shadow="never">
        <div class="bank-card-box">
            <h4>银行卡信息</h4>
            <ul>
                <li>
                    <span>申请类型：</span>
                    <span>添加银行卡</span>
                </li>
                <li>
                    <span>银行卡类型：</span>
                    <span>对公账户</span>
                </li>
                <li>
                    <span>银行卡户名：</span>
                    <el-input></el-input>
                </li>
                <li>
                    <span>开户银行：</span>
                    <el-select placeholder="全部">
                        <el-option
                            v-for="item in selectBankList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </li>
                <li>
                    <span>开户行所在地：</span>
                    <el-cascader placeholder="请选择地区" :options="regionData" @change="handleChange"></el-cascader>
                </li>
                <li>
                    <span>银行卡正反面复印件：</span>
                    <div class="right-box">
                        <div style="margin-right: 20px;">
                            <uploadImg></uploadImg>
                        </div>
                        <ul>
                            <li>
                                <span>银行卡号：</span>
                                <el-input></el-input>
                            </li>
                        </ul>
                    </div>
                </li>
                <li>
                    <span>收款人身份证正反面复印件：</span>
                    <div class="right-box">
                        <div style="margin-right: 20px;">
                            <uploadImg></uploadImg>
                        </div>
                        <ul>
                            <li>
                                <span>身份证号：</span>
                                <el-input></el-input>
                            </li>
                            <li>
                                <span>收款人手机号：</span>
                                <el-input></el-input>
                            </li>
                        </ul>
                    </div>
                </li>
                <li>
                    <span>账户授权说明书：</span>
                    <el-button type="primary">下载模板</el-button>
                    <el-button type="primary">上传</el-button>
                </li>
                <li>
                    <span>管理员手机验证码：</span>
                    <el-input></el-input>
                    <el-button type="primary" style="margin-left: 10px;">获取验证码</el-button>
                </li>
            </ul>
        </div>
    </el-card>
</template>
<script lang="ts">
import { defineComponent, ref, reactive, Ref } from 'vue'
import { regionData, CodeToText, RegionData } from 'element-china-area-data'
import uploadImg from '@/components/common/uploadImg.vue'
import { KeyValue } from '@/common/types'


interface Setup {
    selectBankList: KeyValue[];
    handleChange: (string) => void;
    regionData: RegionData
}

export default defineComponent({
    name: '',
    components: {
        uploadImg
    },
    setup(): Setup {
        const selectBankList = reactive<KeyValue[]>([
            {
                label: '工商银行',
                value: 1
            },
            {
                label: '中国银行',
                value: 2
            },
            {
                label: '建设银行',
                value: 3
            },
            {
                label: '农业银行',
                value: 4
            },
        ])

        const handleChange = (value: string[]): void => {
            console.log(regionData)
            for (let i = 0; i < value.length; i++) {
                console.log(CodeToText[value[i]])
            }
        }

        return {
            regionData,
            handleChange,
            selectBankList
        }
    }
})
</script>
<style lang='scss' scoped>
.bank-card-box {
    > h4 {
        margin-bottom: 30px;
    }
    > ul {
        > li {
            display: flex;
            align-items: center;
            margin-bottom: 20px;
            &:last-child {
                margin-bottom: 0;
            }
            > span:first-child {
                width: 140px;
                margin-right: 20px;
                text-align: right;
            }
            .right-box {
                display: flex;
                > ul {
                    > li {
                        display: flex;
                        align-items: center;
                        margin-bottom: 10px;
                        &:last-child {
                            margin-bottom: 0;
                        }
                        > span {
                            width: 120px;
                            text-align: right;
                        }
                    }
                }
            }

            .el-input {
                width: 200px;
            }
        }
    }
}
</style>
