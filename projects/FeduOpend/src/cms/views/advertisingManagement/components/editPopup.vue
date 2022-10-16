<template>
  <el-dialog
    title="编辑"
    width="500px"
    :visible="visible"
    class="editPopup"
    @close="close"
  >
    <el-form ref="form" :model="form" label-width="100px">
      <el-form-item label="模块">
        <el-input
          v-model="form.module"
          style="width: 200px"
          disabled
        ></el-input>
        <!--        <el-select v-model="form.module" disabled @change="moduleChange">-->
        <!--          <el-option v-for="item in moduleList" :key="item" :value="item">-->
        <!--            {{ item }}-->
        <!--          </el-option>-->
        <!--        </el-select>-->
      </el-form-item>
      <el-form-item label="区域">
        <el-input v-model="form.area" disabled style="width: 200px"></el-input>
        <!--        <el-select v-model="form.area" @change="areaChange">-->
        <!--          <el-option v-for="item in areaList" :key="item" :value="item">-->
        <!--            {{ item }}-->
        <!--          </el-option>-->
        <!--        </el-select>-->
      </el-form-item>
      <el-form-item
        label="可选类型"
        prop="dataType"
        :rules="filterRules({ required: true, msg: '必须选择类型' })"
      >
        <el-select v-model="form.dataType" disabled>
          <el-option
            v-for="item in config.types"
            :key="item.name"
            :label="item.describe"
            :value="item.name"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="权重"
        prop="weight"
        :rules="filterRules({ required: true, msg: '请输入权重' })"
      >
        <el-input v-model="form.weight" style="width: 200px"></el-input>
      </el-form-item>
      <el-form-item
        label="内容ID"
        prop="relDataId"
        :rules="filterRules({ required: true, msg: '请输入内容ID' })"
      >
        <el-input v-model="form.relDataId" style="width: 200px"></el-input>
      </el-form-item>
      <el-form-item
        prop="coverUrls"
        :rules="filterRules({ required: true, msg: '必须上传封面' })"
      >
        <div class="imgContainer">
          <span>{{ config.width }}x{{ config.height }}</span>
          <el-button :disabled="!details" type="primary" @click="createImg">
            生成封面
          </el-button>
        </div>
        <div v-if="!imgSrc" class="img" @click="openImgClip">
          <i class="el-icon-plus"></i>
        </div>
        <img v-else class="img" :src="imgSrc" alt="" @click="openImgClip" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">提交</el-button>
        <el-button type="text" @click="close">取消</el-button>
      </el-form-item>
    </el-form>
    <img-clip ref="imgClip" @getimg="getImg"></img-clip>
  </el-dialog>
</template>

<script>
  import ImgClip from '@/cms/components/imgClip'
  import {
    GetdataType,
    GetOrgContent,
    QueryAllModule,
    QueryAreaByModule,
    SaveAdsPos,
  } from '@/cms/api/advertisement'
  import axios from 'axios'
  export default {
    name: 'EditPopup',
    components: { ImgClip },
    data() {
      return {
        title: '新增',
        visible: false,
        imgSrc: '',
        blob: null,
        config: {},
        form: {
          adsConfigId: '',
          area: '',
          coverUrls: [],
          module: '',
          relDataId: '',
          weight: '',
          dataType: '',
        },
        moduleList: [],
        areaList: [],
        timer: null,
        details: null,
      }
    },
    watch: {
      'form.relDataId': function () {
        this.searchDetails()
      },
    },
    created() {
      this.getCondition()
    },
    methods: {
      searchDetails() {
        if (this.timer) {
          clearTimeout(this.timer)
          this.timer = null
        }
        if (!this.form.relDataId) {
          return
        }
        this.timer = setTimeout(() => {
          this.timer = null
          GetOrgContent({
            module: this.form.module,
            area: this.form.area,
            relDataId: this.form.relDataId,
          })
            .then((res) => {
              if (+res.code === 0) {
                if (res.data) {
                  const item = this.config.types.find(
                    (t) => t.name === res.data.hotspotDataType.name
                  )
                  if (item) {
                    this.form.relDataName = res.data.title
                    if (res.data.relDataName) {
                      this.form.relDataName = res.data.relDataName
                    }

                    this.form.dataType = item.name
                    this.details = res.data
                  } else {
                    this.$message.warning('此内容不可用于当前广告配置')
                    this.details = null
                    this.form.dataType = ''
                  }
                }
              } else {
                this.$message.warning('此内容不可用于当前广告配置')
                this.details = null
                this.form.dataType = ''
              }
            })
            .catch(() => {
              this.details = null
              this.form.dataType = ''
            })
        }, 1000)
      },
      /**
       * 生成封面
       */
      createImg() {
        const that = this
        let coverUrl = ''
        if (
          this.details.coverUrl &&
          typeof this.details.coverUrl === 'string'
        ) {
          coverUrl = this.details.coverUrl
        } else if (Array.isArray(this.details.coverUrls)) {
          coverUrl = this.details.coverUrls[0]
        }

        let xhr = new XMLHttpRequest()
        xhr.responseType = 'blob'
        xhr.open('get', coverUrl, true)
        // xhr.setRequestHeader(
        //   'Accept',
        //   'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
        // )
        // xhr.setRequestHeader('Accept-Encoding', 'gzip, deflate, br')
        // xhr.setRequestHeader('Accept-Language', 'zh-CN,zh;q=0.9,en;q=0.8')
        // xhr.setRequestHeader('Connection', 'keep-alive')
        // xhr.setRequestHeader(
        //   'Host',
        //   'jinshuy-files.oss-cn-shenzhen.aliyuncs.com'
        // )
        // xhr.setRequestHeader('Sec-Fetch-Dest', 'image')
        // xhr.setRequestHeader('Sec-Fetch-Mode', 'cors')
        // xhr.setRequestHeader('Sec-Fetch-Site', 'cross-site')
        xhr.setRequestHeader('Cache-Control', 'no-cache')
        xhr.onreadystatechange = function () {
          // 通信成功时，状态值为4
          if (xhr.readyState === 4) {
            if (xhr.status === 200) {
              const blob = new Blob([xhr.response], { type: 'image/png' })
              // console.log(xhr.responseText)
              // console.log(blob)
              const file = new File([blob], 'ddd.jpg', {
                type: blob.type,
              })
              that.openImgClip(file)
              xhr = null
            } else {
              console.error(xhr.statusText)
            }
          }
        }

        xhr.send()

        // let image = new Image()
        // image.crossOrigin = 'anonymous'
        // image.onload = () => {
        //   let canvas = document.createElement('canvas')
        //   canvas.width = image.width
        //   canvas.height = image.height
        //   let ctx = canvas.getContext('2d')
        //   ctx.drawImage(image, 0, 0, image.width, image.height)
        //   canvas.toBlob((blob) => {
        //     const file = new File([blob], 'ddd.jpg', {
        //       type: blob.type,
        //     })
        //     this.openImgClip(file)
        //     image = null
        //     canvas = null
        //     ctx = null
        //   })
        // }
        // image.src = coverUrl

        // axios
        //   .get(coverUrl, {
        //     method: 'GET',
        //     responseType: 'blob',
        //   })
        //   .then((response) => {
        //     console.log(response)
        //   })

        // fetch(coverUrl, {
        //   method: 'get',
        //   responseType: 'blob',
        // })
        //   .then((res) => res.blob())
        //   .then((blob) => {
        //     const file = new File([blob], 'ddd.jpg', {
        //       type: blob.type,
        //     })
        //     this.openImgClip(file)
        //   })
      },
      init(type, row) {
        if (type === 'add') {
          this.config = row
          this.form.module = row.module
          this.form.area = row.area
          this.form.adsConfigId = row.id
        }
        this.title = type === 'add' ? '新增' : '编辑'
        this.visible = true
      },
      reset() {
        this.imgSrc = ''
        this.blob = null
        this.form = {
          adsConfigId: '',
          area: '',
          coverUrls: [],
          module: '',
          relDataId: '',
          weight: '',
          dataType: '',
        }
        this.$refs.form.resetFields()
      },
      close() {
        this.reset()
        this.$emit('close')
        this.visible = false
      },
      openImgClip(file) {
        this.$refs.imgClip.init(
          {
            width: this.config.width || 1920,
            height: this.config.height || 1080,
          },
          file
        )
      },
      getImg(res) {
        this.imgSrc = res.url
        this.blob = res.blob
        this.form.coverUrls = [res.id]
        this.$refs.form.validate()
      },
      getCondition() {
        QueryAllModule().then((res) => {
          if (+res.code === 0) {
            this.moduleList = res.data
          }
        })
      },
      submitForm() {
        this.$refs.form.validate((validate) => {
          if (validate) {
            console.log(this.config)
            SaveAdsPos(this.form).then((res) => {
              if (+res.code === 0) {
                this.close()
              } else {
                this.$message.error(res.msg)
              }
            })
          }
        })
      },
    },
  }
</script>

<style scoped lang="scss">
  .editPopup {
    .imgContainer {
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      width: 100%;
      padding-right: 40px;
    }
    .img {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 320px;
      min-height: 180px;
      margin-top: 10px;
      cursor: pointer;
      border: 1px solid #999999;
      i {
        font-size: 48px;
      }
    }
  }
</style>
