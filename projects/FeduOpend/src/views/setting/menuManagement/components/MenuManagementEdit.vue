<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    :close-on-click-modal="false"
    width="60%"
    @close="close"
  >
    <el-divider content-position="left">
      这里就不具体写了，请自行完善
    </el-divider>
    <el-form
      ref="form"
      :inline="true"
      :model="form"
      :rules="rules"
      label-width="140px"
    >
      <el-form-item label="name" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="路径" prop="path">
        <el-input v-model="form.path"></el-input>
      </el-form-item>
      <el-form-item label="vue文件路径" prop="component">
        <el-input v-model="form.component"></el-input>
      </el-form-item>
      <el-form-item label="重定向" prop="redirect">
        <el-input v-model="form.redirect"></el-input>
      </el-form-item>
      <el-form-item label="标题" prop="title">
        <el-input v-model="form.meta.title"></el-input>
      </el-form-item>
      <el-form-item label="图标" prop="remixIcon">
        <el-popover
          popper-class="icon-selector-popper"
          width="292"
          trigger="hover"
        >
          <el-input slot="reference" v-model="form.meta.remixIcon"></el-input>
          <icon-table @handle-icon="handleIcon"></icon-table>
        </el-popover>
      </el-form-item>
      <el-form-item label="badge" prop="badge">
        <el-input v-model="form.meta.badge"></el-input>
      </el-form-item>
      <el-form-item label="隐藏" prop="hidden">
        <el-switch v-model="form.hidden"></el-switch>
      </el-form-item>
      <el-form-item label="始终显示当前节点" prop="alwaysShow">
        <el-switch v-model="form.alwaysShow"></el-switch>
      </el-form-item>
      <el-form-item label="自定义svg图标" prop="isCustomSvgIcon">
        <el-switch v-model="form.meta.isCustomSvgIcon"></el-switch>
      </el-form-item>
      <el-form-item label="固定" prop="affix">
        <el-switch v-model="form.meta.affix"></el-switch>
      </el-form-item>
      <el-form-item label="无缓存" prop="noKeepAlive">
        <el-switch v-model="form.meta.noKeepAlive"></el-switch>
      </el-form-item>
      <el-form-item label="不显示多标签页" prop="tagHidden">
        <el-switch v-model="form.meta.tagHidden"></el-switch>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import IconTable from '@/extra/VabIconSelector'
  import { doEdit } from '@/api/menuManagement'

  export default {
    name: 'MenuManagementEdit',
    components: { IconTable },
    data() {
      return {
        form: {
          meta: {
            remixIcon: '',
          },
        },
        rules: {
          name: [{ required: true, trigger: 'blur', message: '请输入name' }],
          path: [{ required: true, trigger: 'blur', message: '请输入path' }],
          component: [
            { required: true, trigger: 'blur', message: '请输入component' },
          ],
          'meta.title': [
            { required: true, trigger: 'blur', message: '请输入标题' },
          ],
          'meta.remixIcon': [
            { required: true, trigger: 'blur', message: '请选择图标' },
          ],
        },
        title: '',
        dialogFormVisible: false,
      }
    },
    created() {},
    methods: {
      handleIcon(item) {
        this.form.meta.remixIcon = item
      },
      showEdit(row) {
        if (!row) {
          this.title = '添加'
        } else {
          this.title = '编辑'
          this.form = Object.assign({}, row)
        }
        this.dialogFormVisible = true
      },
      close() {
        this.$refs['form'].resetFields()
        this.form = this.$options.data().form
        this.dialogFormVisible = false
      },
      save() {
        this.$refs['form'].validate(async (valid) => {
          if (valid) {
            const { msg } = await doEdit(this.form)
            this.$baseMessage(msg, 'success')
            this.$emit('fetch-data')
            this.close()
          } else {
            return false
          }
        })
      },
    },
  }
</script>
