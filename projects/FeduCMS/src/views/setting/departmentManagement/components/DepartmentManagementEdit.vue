<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    :close-on-click-modal="false"
    width="500px"
    @close="close"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="父节点" prop="parentName">
        <el-select
          v-model="form.parentId"
          :disabled="!form.parentId"
          placeholder="请选择父节点"
        >
          <el-option
            :value="form.parentId"
            :label="form.parentName"
            style="height: auto; padding: 0"
          >
            <el-tree
              ref="tree"
              :data="treeData"
              :props="defaultProps"
              default-expand-all
              @node-click="handleNodeClick"
            ></el-tree>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="排序" prop="order">
        <el-input v-model="form.order"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { getList } from '@/api/departmentManagement'
  import { doEdit } from '@/api/departmentManagement'

  export default {
    name: 'DepartmentManagementEdit',
    data() {
      return {
        treeData: [],
        defaultProps: {
          children: 'children',
          label: 'name',
        },
        form: {
          parentName: '',
          parentId: '',
        },
        rules: {
          parentName: [
            { required: true, trigger: 'blur', message: '请选择父节点' },
          ],
          name: [{ required: true, trigger: 'blur', message: '请输入名称' }],
          order: [{ required: true, trigger: 'blur', message: '请输入排序' }],
        },
        title: '',
        dialogFormVisible: false,
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      async fetchData() {
        const { data } = await getList()
        this.treeData = data
      },
      handleNodeClick(node) {
        this.form.parentName = node.name
        this.form.parentId = node.id
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
