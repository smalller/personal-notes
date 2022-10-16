<template>
  <el-card class="classList">
    <vab-query-form>
      <vab-query-form-left-panel>
        <el-button icon="el-icon-plus" type="primary" @click="openAddClass()">
          新增课节
        </el-button>
        <el-button type="primary" @click="back()">返回</el-button>
      </vab-query-form-left-panel>
      <!--      <vab-query-form-right-panel>-->
      <!--      -->
      <!--      </vab-query-form-right-panel>-->
    </vab-query-form>

    <el-table ref="tableSort" v-loading="listLoading" :data="list">
      <el-table-column
        align="left"
        label="课节名称"
        prop="sectionName"
      ></el-table-column>
      <el-table-column
        align="center"
        label="操作"
        show-overflow-tooltip
        width="185"
      >
        <template #default="{ row }">
          <el-button type="text" @click="openAddClass(row)">编辑</el-button>

          <el-popconfirm
            v-show="!row.pid"
            confirm-button-text="确定"
            cancel-button-text="取消"
            icon="el-icon-info"
            title="确定删除此课节吗？"
            @confirm="deleteClass(row.id)"
          >
            <el-button
              slot="reference"
              style="color: #f56c6c; margin-left: 10px"
              type="text"
            >
              <el-button type="text" style="color: #f56c6c">删除</el-button>
            </el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="pageForm.pageNo"
      :page-size="pageForm.pageSize"
      :total="pageForm.total"
      background
      @current-change="pageChange"
      @size-change="pageSizeChange"
    ></el-pagination>
    <el-dialog
      :title="isEdit ? '编辑课节' : '新增课节'"
      :visible="addClassShow"
      @close="closeModal"
    >
      <div class="addClassContent">
        <el-form ref="form" label-position="left" :model="formData">
          <el-form-item
            label="名称"
            prop="sectionName"
            :rules="[{ required: true, message: '课节名称不能为空' }]"
          >
            <el-input
              v-model="formData.sectionName"
              maxlength="40"
              style="width: 400px"
            />
          </el-form-item>
          <el-form-item>
            <div class="videoBox">
              <video
                v-show="videoUrl"
                :src="videoUrl"
                preload
                controls
                class="videoItem"
              ></video>
              <el-button size="large" type="primary" @click="openUpload">
                上传视频
              </el-button>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="saveClass">保存</el-button>
            <el-button @click="closeModal">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
    <cms-upload ref="cmsUpload" />
  </el-card>
</template>

<script>
  import CmsUpload from '@/cms/common/cmsUpload'
  import {
    addCourseSection,
    deleteCourseSection,
    queryCourseSection,
  } from '@/cms/api/course'
  import { getFileUrl } from '@/cms/api/common'
  import dayjs from 'dayjs'
  export default {
    name: 'ClassList',
    components: { CmsUpload },
    data() {
      return {
        queryForm: {},
        list: [],
        listLoading: false,
        pageForm: {
          pageNo: 1,
          pageSize: 20,
          total: 0,
        },
        formData: {},
        addClassShow: false,
        videoUrl: '',
        isEdit: false,
      }
    },
    created() {
      this.query()
    },
    methods: {
      back() {
        this.$router.back()
      },
      //编辑或新增课节
      openAddClass(row) {
        this.isEdit = false
        this.formData = {}
        if (row) {
          this.isEdit = true
          this.formData = {
            courseId: this.$route.query.id,
            id: row.id,
            sectionName: row.sectionName,
          }
          if (row.videoPath) {
            this.videoUrl = row.videoPath
            // getFileUrl(row.videoPath).then((res) => {
            //   if (+res.code === 0) {
            //     this.videoUrl = res.data
            //   }
            // })
          }
        }
        this.addClassShow = true
      },
      saveClass() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.formData.courseId = this.$route.query.id
            addCourseSection(this.formData).then((res) => {
              if (+res.code === 0) {
                this.$message.success(
                  this.isEdit ? '编辑课节成功' : '新增课节成功'
                )
                this.query()
                this.closeModal()
              }
            })
          }
        })
      },
      closeModal() {
        this.formData = {}
        this.addClassShow = false
        this.videoUrl = ''
      },
      //删除课节
      deleteClass(id) {
        deleteCourseSection({
          id,
        }).then((res) => {
          if (+res.code === 0) {
            this.$message.success('删除课节成功')
            this.query()
          }
        })
      },
      pageChange(page) {
        this.pageForm.pageNo = page
        this.query()
      },
      pageSizeChange(pageSize) {
        this.pageForm.pageSize = pageSize
        this.query()
      },
      openUpload() {
        this.$refs.cmsUpload
          .upload('.mp4', null, {
            section: true,
          })
          .then((res) => {
            console.log(res)
            this.videoUrl = res.url
            this.formData.videoPath = res.data
            const audio = new Audio()
            audio.onloadeddata = () => {
              console.log(audio.duration)
              this.formData.videoDuration = dayjs(audio.duration * 1000).format(
                audio.duration > 60 * 60 ? 'HH:mm:ss' : 'mm:ss'
              )
            }
            audio.src = res.url
            audio.load()
          })
      },
      query() {
        const data = Object.assign(this.pageForm, {
          courseId: this.$route.query.id,
        })
        queryCourseSection(data).then((res) => {
          if (+res.code === 0) {
            this.list = res.data.list
            this.pageForm.pageNo = res.data.page.pageNo
            this.pageForm.pageSize = res.data.page.pageSize
            this.pageForm.total = res.data.page.totalNum
          }
        })
      },
    },
  }
</script>

<style scoped lang="scss">
  .classList {
    padding: 0 0 $base-padding 0 !important;
    margin: 0 !important;
    .videoBox {
      display: flex;
      flex-direction: column;
      align-items: center;
      .videoItem {
        margin-bottom: 20px;
        width: 320px;
        height: 180px;
      }
    }
  }
</style>
