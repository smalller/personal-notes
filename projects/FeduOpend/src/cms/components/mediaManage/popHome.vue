<template>
  <el-dialog
    width="400"
    class="toppingBox"
    :visible.sync="show"
    title="首页推荐"
  >
    <el-form ref="form" :model="ruleForm">
      <el-form-item
        label="发布范围"
        prop="releaseType"
        :rules="filterRules({ required: true, msg: '请选择发布范围' })"
      >
        <el-select
          v-model="ruleForm.releaseType"
          style="width: 400px"
          placeholder="请选择发布范围"
          @change="setReleaseType"
        >
          <el-option
            v-for="item in categoryList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item
        v-if="ruleForm.releaseType === 1"
        label="指定区域"
        prop="areaId"
        :rules="filterRules({ required: true, msg: '请选择指定区域' })"
      >
        <el-cascader
          v-model="ruleForm.areaId"
          style="width: 400px"
          placeholder="请选择"
          :options="addressOptions"
          @change="setArea"
        ></el-cascader>
      </el-form-item>

      <el-form-item
        v-if="ruleForm.releaseType === 2"
        label="幼儿园"
        prop="schoolName"
        :rules="filterRules({ required: true, msg: '请选择幼儿园' })"
      >
        <el-input
          v-model="ruleForm.schoolName"
          type="text"
          maxlength="40"
          style="width: 400px"
          placeholder="请选择幼儿园"
          @click.native="showGarden"
        ></el-input>
      </el-form-item>

      <el-form-item v-show="!ruleForm.sourceId">
        <el-button
          style="width: 400px"
          type="primary"
          size="max"
          @click="fetchData"
        >
          选择小节
        </el-button>
      </el-form-item>

      <el-form-item v-show="ruleForm.sourceId" :label="currentRow.name">
        <img
          :src="currentRow.cover"
          alt=""
          style="width: 400px; height: 200px"
        />
        <el-button type="text" @click="itemSelectDelete">删除</el-button>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm">确定</el-button>
        <el-button type="primary" @click="closeTopping">取消推荐</el-button>
        <el-button @click="close">取消</el-button>
      </el-form-item>
    </el-form>
    <el-dialog
      title="幼儿园列表"
      :visible.sync="showGardenList"
      width="60%"
      top="40px"
      height="600"
    >
      <div>
        <garden
          ref="garden"
          :school-data="ruleForm.schoolIds"
          @setSchool="getSchool"
        ></garden>
      </div>
      <span slot="footer">
        <el-button type="primary" @click="setSchool">确 定</el-button>
        <el-button
          @click="
            () => {
              showGardenList = false
              schoolData = []
            }
          "
        >
          取 消
        </el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="小节列表"
      width="60%"
      top="40px"
      height="600"
      :visible.sync="itemListShow"
    >
      <!--      <el-table-->
      <!--        :data="itemList"-->
      <!--        highlight-current-row-->
      <!--        @current-change="handleCurrentChange"-->
      <!--      >-->
      <!--        &lt;!&ndash;        <el-table-column label="1小节名称">&ndash;&gt;-->
      <!--        &lt;!&ndash;          <template #default="{ row }">&ndash;&gt;-->
      <!--        &lt;!&ndash;            <el-radio v-model="itemId" :label="row.id">{{ row.name }}</el-radio>&ndash;&gt;-->
      <!--        &lt;!&ndash;          </template>&ndash;&gt;-->
      <!--        &lt;!&ndash;        </el-table-column>&ndash;&gt;-->
      <!--        <el-table-column label="小节名称" prop="name"></el-table-column>-->
      <!--      </el-table>-->
      <table cellpadding="0" border="1" cellspacing="0" class="tableBox">
        <tr>
          <th>名称</th>
          <th>操作</th>
        </tr>
        <tbody
          style="
            display: block;
            max-height: 400px;
            overflow-x: hidden;
            overflow-y: auto;
          "
        >
          <tr v-for="item in itemList" :key="item.id">
            <td>{{ item.name }}</td>
            <td>
              <el-button
                :type="currentRow.id === item.id ? 'warning' : 'primary'"
                @click="handleCurrentChange(item)"
              >
                {{ currentRow.id === item.id ? '已选' : '未选' }}
              </el-button>
            </td>
          </tr>
        </tbody>
      </table>
      <el-form>
        <el-form-item>
          <el-button
            type="primary"
            :disabled="!currentRow.id"
            @click="itemSelect"
          >
            确定
          </el-button>
          <el-button @click="itemListShow = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </el-dialog>
</template>

<script>
  import {
    PopHomeAlbum,
    QueryMediaAlbumItem,
    ToppingAlbum,
  } from '@/cms/api/mediaSetting'
  import { CATEGORY_LIST } from '@/cms/constants'
  import { regionDataPlus } from 'element-china-area-data'
  import Garden from '@/cms/views/schoolActivityManage/compoents/garden'
  export default {
    name: 'PopHome',
    components: { Garden },
    data() {
      return {
        categoryList: CATEGORY_LIST,
        addressOptions: regionDataPlus,
        itemListShow: false,
        itemList: [],
        schoolData: [],
        itemId: '',
        item: {},
        show: false,
        currentRow: {},
        ruleForm: {
          areaId: '',
          schoolIds: [],
          sourceId: '',
          sourceType: 1,
        },
        albumId: '',
        showGardenList: false,
      }
    },

    methods: {
      open(item) {
        this.albumId = item.id
        this.ruleForm = {
          // id: item.id,
          sourceType: item.type,
        }
        this.show = true
      },
      close() {
        this.ruleForm = {
          areaId: '',
          schoolIds: [],
          sourceId: '',
          sourceType: 1,
        }
        this.show = false
        this.$emit('close')
      },
      //小节选择
      handleCurrentChange(val) {
        this.currentRow = val.id === this.currentRow.id ? {} : val
      },
      itemSelect() {
        this.ruleForm.sourceId = this.currentRow.id
        this.itemListShow = false
      },
      itemSelectDelete() {
        this.currentRow = {}
        this.$set(this.ruleForm, 'sourceId', '')
      },
      // 取消推广
      closeTopping() {},
      //推广
      submitForm() {
        if (this.ruleForm.releaseType === 2) {
          if (this.ruleForm.schoolIds.length === 0) {
            this.$message.warning('未选择幼儿园')
            return
          }
        }
        this.$refs.form.validate(async (validate) => {
          if (validate) {
            await PopHomeAlbum(this.ruleForm)
            this.close()
          }
        })
      },
      setReleaseType() {
        if (+this.ruleForm.releaseType !== 1) {
          delete this.ruleForm.areaId
          delete this.ruleForm.areaName
        }
        if (this.ruleForm.releaseType !== 2) {
          delete this.ruleForm.schoolIds
        }
      },
      async setArea(data) {
        this.$set(this.ruleForm, 'areaId', data.length > 0 ? data.join() : '')
        delete this.ruleForm.schoolIds
      },
      getSchool(data) {
        this.schoolData = [...data]
        delete this.ruleForm.province
        delete this.ruleForm.city
        delete this.ruleForm.area
      },
      showGarden() {
        this.showGardenList = true
      },
      setSchool() {
        const schoolName =
          this.schoolData.length === 0
            ? '请选择幼儿园'
            : `已选择${this.schoolData.length}所学校`
        this.$set(this.ruleForm, 'schoolName', schoolName)
        this.$set(this.ruleForm, 'schoolIds', this.schoolData)
        if (this.schoolData.length === 0) {
          this.$message.warning('未选择幼儿园')
        } else {
          this.$message.success('添加成功')
        }
        this.showGardenList = false
        this.$refs.form.validate()
      },
      //获取小节列表

      async fetchData() {
        const { data } = await QueryMediaAlbumItem({
          pageNo: 1,
          pageSize: 20,
          id: this.albumId,
        })
        this.itemList = data
        this.itemListShow = true
        // console.log(data)
      },
    },
  }
</script>

<style scoped lang="scss">
  .toppingBox {
    .tableBox {
      tr {
        width: 500px;
        white-space: nowrap;
        th,
        td {
          display: inline-block;
          height: 36px;
          padding: 2px 0;
          &:nth-child(1) {
            width: 300px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          &:nth-child(2) {
            width: 200px;
            text-align: center;
          }
        }
      }
    }
  }
</style>
