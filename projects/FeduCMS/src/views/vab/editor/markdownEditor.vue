<template>
  <div class="markdown-editor-container">
    <el-row :gutter="20">
      <el-col :lg="12" :md="24" :sm="24" :xl="12" :xs="24">
        <vab-markdown-editor
          ref="mde"
          v-model="value"
          @show-html="handleShowHtml"
        ></vab-markdown-editor>
        <el-button @click="handleAddText">增加文本</el-button>
        <el-button @click="handleAddImg">增加图片</el-button>
      </el-col>
      <el-col :lg="12" :md="24" :sm="24" :xl="12" :xs="24">
        <el-card shadow="hover">
          <div slot="header">
            <span>markdown转换html实时演示区域</span>
          </div>
          <div v-html="html"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import VabMarkdownEditor from '@/extra/vabMarkdownEditor'

  export default {
    name: 'MarkdownEditor',
    components: { VabMarkdownEditor },
    data() {
      return {
        value: '# vue-admin-beautiful-pro',
        html: '<h1 id="vue-admin-beautiful-pro">vue-admin-beautiful-pro</h1>',
      }
    },
    methods: {
      handleAddText() {
        this.$refs.mde.add('\n### 新增加的内容')
      },
      handleAddImg() {
        // this.$refs.mde.add(
        //   '\n![](https://chu1204505056.gitee.io/byui-bookmarks/img/ewm.png)'
        // )
      },
      handleShowHtml(html) {
        this.html = html
      },
    },
  }
</script>
