<template>
  <el-dialog width="400" class="toppingBox" :visible.sync="show" title="推广">
    <el-form ref="form" :model="form">
      <el-form-item>
        <span>推广剩余时间 {{ dayNum }}</span>
      </el-form-item>
      <el-form-item
        label="新增天数"
        :rules="filterRules({ required: true, msg: '请输入小节名称' })"
      >
        <el-input
          v-model="form.addDay"
          style="width: 300px"
          type="number"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="推广位置"
        :rules="filterRules({ required: true, msg: '请选择位置' })"
      >
        <el-select
          v-if="+form.type === 1"
          v-model="form.topSeq"
          placeholder="请选择位置"
        >
          <el-option
            v-for="item in positionList"
            :key="item.index"
            :label="item.label"
            :value="item.index"
          ></el-option>
        </el-select>
        <el-input
          v-else
          v-model="form.topSeq"
          :min="1"
          :max="4"
          type="number"
          style="width: 300px"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">确定</el-button>
        <el-button type="primary" @click="closeTopping">取消推广</el-button>
        <el-button @click="close">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
  import positionList from '@/cms/components/mediaManage/positionList'
  import { ToppingAlbum, UnToppingAlbum } from '@/cms/api/mediaSetting'
  export default {
    name: 'ToppingModal',
    data() {
      return {
        positionList: positionList,
        show: false,
        form: {
          addDay: 0,
          id: '',
          topSeq: '',
          type: 1,
        },
        dayNum: 0,
      }
    },
    watch: {
      form: {
        handler: function () {
          this.$set(this.form, 'addDay', Math.abs(parseInt(this.form.addDay)))
          if (this.form.type === 2) {
            if (this.form.topSeq > 4) {
              this.form.topSeq = 4
            }
            this.$set(this.form, 'topSeq', Math.abs(parseInt(this.form.topSeq)))
          }
        },
        deep: true,
      },
    },
    methods: {
      open(item) {
        this.form = {
          id: item.id,
          type: item.type,
        }
        this.dayNum = this.getTime(item.topExpire || 0)
        this.show = true
      },
      close() {
        this.form = {
          addDay: '',
          id: '',
          topSeq: '',
          type: 1,
        }
        this.dayNum = 0
        this.show = false
        this.$emit('close')
      },
      // 取消推广
      async closeTopping() {
        await UnToppingAlbum({ id: this.form.id })
        this.close()
      },
      //推广
      submitForm() {
        this.$refs.form.validate(async (validate) => {
          if (validate) {
            await ToppingAlbum(this.form)
            this.close()
          }
        })
      },
      getTime(num) {
        let hour = Math.floor(num / 3600)
        let minuts = Math.floor((num % 3600) / 60)
        let second = Math.floor(num % 60)
        if (second.toString().length < 2) {
          second = '0' + second.toString()
        }
        if (minuts.toString().length < 2) {
          minuts = '0' + minuts.toString()
        }
        if (hour.toString().length < 2) {
          hour = '0' + hour.toString()
        }
        return `${hour}:${minuts}:${second}`
      },
    },
  }
</script>

<style scoped lang="scss">
  .toppingBox {
  }
</style>
