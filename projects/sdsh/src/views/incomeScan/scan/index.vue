<template>
  <div class="">
    <el-card
        shadow="never"
        class="cus-card"
        style="margin-bottom: 15px"
        :body-style="{ 'padding-bottom': '0' }"
    >
      <el-form
          :model="QueryObj"
          class="filter-box"
          label-position="right"
      >
        <el-row>
          <el-form-item label="项目名称：">
            <el-input
                clearable
                v-model="QueryObj.projectName"
                placeholder="请输入商户名称"
            />
          </el-form-item>
          <el-form-item label="发布时间：">
           <el-date-picker
              type="daterange"
              v-model="QueryObj.times"
              @change="timerChange"
              range-separator="-"
              start-placeholder="请选择开始时间"
              end-placeholder="请选择结束时间"
          />
          </el-form-item>

          <el-form-item label="状态">
            <el-select v-model="QueryObj.isExpire">
              <el-option label="已失效" :value="1"></el-option>
              <el-option label="未失效" :value="2"></el-option>
              <el-option label="全部" value=""></el-option>
            </el-select>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item>
            <el-button
                type="primary"
                @click="getMerchantList"
            >查询
            </el-button>
          </el-form-item>
          <el-form-item>
            <el-button
                type="success"
                @click="addMerchant"
            >新增收款二维码
            </el-button>
          </el-form-item>
          <el-form-item>
            <el-button
                type="success"
                @click="mergeQrCode"
            >合并收款二维码
            </el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </el-card>

    <el-card shadow="never">

      <el-table :data="tableList">
        <el-table-column label="项目名称" prop="projectName"></el-table-column>
        <el-table-column label="开始日期" >
          <template #default="{ row }">{{ dayjs(row.beginTime).format('YYYY-MM-DD HH:mm:ss') }}</template>
        </el-table-column>
        <el-table-column label="截止日期" >
          <template #default="{ row }">{{ dayjs(row.endTime).format('YYYY-MM-DD HH:mm:ss') }}</template>
        </el-table-column>
        <el-table-column label="状态" width="70px">
          <template #default="{ row }">
            <el-tag>{{ row.isExpire }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="支付人数" prop="payNumber" width="80"></el-table-column>
        <el-table-column label="二维码" width="200px">
          <template #default="{ row }">
            <el-button :disabled="row.isExpire === '失效'" @click="openQrCodeMadel(row)">点击查看或下载二维码</el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="150px">
          <template #default="{row }">
            <el-button @click="getDetails(row.id)">详情</el-button>
            <el-button @click="openDetailsList(row.projectName)">明细</el-button>
            <el-button @click="openInfoTotal(row.projectName)">统计</el-button>
            <el-dropdown style="margin-left: 10px" @command="btnChange($event, row.id)">
              <el-button type="primary">
                更多
                <el-icon class="el-icon--right" color="#333333">
                  <arrow-down/>
                </el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu >
                  <el-dropdown-item command="a" :disabled="row.isExpire === '失效'">截止</el-dropdown-item>
                  <el-dropdown-item command="b" >修改</el-dropdown-item>
                  <el-dropdown-item command="c" >删除</el-dropdown-item>

                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
          class="pagination"
          background
          layout="prev, pager, next"
          :total="pageForm.total"
          :page-size="pageForm.pageSize"
          :current-page="pageForm.pageNum"
          @current-change="handleCurrentChange"
      />
    </el-card>
    <create-qr-code ref="createQrCode" @success="resetQuery"/>
  </div>
  <qr-code-madel ref="qrCodeMadel"/>
  <qr-code-details ref="qrCodeDetails"/>
  <create-merge-qr-code ref="createMergeQrCode"/>
</template>
<script lang="ts">
import {defineComponent, ref, Ref, reactive} from "vue";
import tableList from "./components/tableList.vue";
import {QrCodeListItem, QueryObj} from "./data";
import {deleteQrCode, queryQRCodeList, updateEndQrcode} from "./api";
import TypeSelect from "../components/TypeSelect.vue";
import dayjs from 'dayjs'
import QrCodeMadel from "@/views/incomeScan/scan/components/qrCodeMadel.vue";
import CreateQrCode from "@/views/incomeScan/scan/components/createQrCode.vue";
import QrCodeDetails from "@/views/incomeCheck/list/components/qrCodeDetails.vue";
import {TableListItem} from "@/views/incomeCheck/list/data";
import CreateMergeQrCode from "@/views/incomeScan/components/createMergeQrCode.vue";
import {ElMessageBox} from "element-plus";
// import bankCardInfo from "@/components/merchant/bankCardInfo.vue";
// import basicInfo from "@/components/merchant/basicInfo.vue";
// import idCardInfo from "@/components/merchant/idCardInfo.vue";
// import merchantAllInfo, { Setup as MerAllInfoSetup } from '../components/merchantAllInfo.vue';


export default defineComponent({
  name: "",
  components: {
    CreateMergeQrCode,
    QrCodeDetails,
    CreateQrCode,
    QrCodeMadel,
    // bankCardInfo,
    // basicInfo,
    // idCardInfo,
    // merchantAllInfo,
  },
  emits: {
    openDetailsList: null,
    openInfoTotal: null,
  },
  setup(props, {emit}) {
    const QueryObj = ref<QueryObj>({});
    const pageForm = reactive({
      pageNum: 1,
      pageSize: 20,
      total: 0
    })
    const tableList = ref<QrCodeListItem[]>([]); // 表格数据
    const merchantAllInfoCom = ref<unknown>(null);
    const createQrCode = ref(null)
    const createMergeQrCode = ref(null);


    const mergeQrCode = () => {
      (createMergeQrCode.value as any).open()
    }


    async function getMerchantList(): Promise<void> {
      const params = Object.assign(
          {},
          {
            ...QueryObj.value,
          }
      )
      if(params.times) {
        delete params.times
      }
      const {code, data} = await queryQRCodeList(
          pageForm.pageNum,
          pageForm.pageSize,
          params
      );
      if (+code === 1000) {
        tableList.value = data.list;
        pageForm.total = data.total;
      }
    }

    const qrCodeMadel = ref(null)
    const openQrCodeMadel = (data: QrCodeListItem) => {
      (qrCodeMadel.value as any).open(data)
    }

    const resetQuery = () => {
      pageForm.pageNum = 1
      getMerchantList()
    }

    getMerchantList();

    const btnChange = (command: string, id: number) => {
      console.log(command)
      switch (command) {
        case 'a':
          endQr(id)
          break;
        case 'b':
          editQrCode(id)
          break;
        case 'c':
          deleteQr(id)
          break;
      }
    }

    //截止二维码
    const endQr = (id: number) => {

      ElMessageBox.confirm('确定截止二维码吗？','截止确认',{
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        updateEndQrcode({
          mccId: id,
          endTime: dayjs().format('YYYY-MM-DD')
        }).then(res => {
          if (+res.code === 1000) {
            getMerchantList();
          }
        })
      })
    }

    //删除二维码
    const deleteQr = (id: number) => {

      ElMessageBox.confirm('确定删除吗？','删除确认',{
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteQrCode(id).then(res => {
          if (+res.code === 1000) {
            getMerchantList();
          }
        })
      })


    }

    // 翻页
    const handleCurrentChange = (res: number): void => {
      pageForm.pageNum = res;
      getMerchantList();
    };

    //新增二维码
    const addMerchant = (): void => {
      (createQrCode.value as any).open()
    };

    //编辑二维码
    const editQrCode = (id: number): void => {
      (createQrCode.value as any).open(id, 'edit')
    }

    //查询明细
    const openDetailsList = (projectName: string) => {
      emit('openDetailsList', projectName)
    }

    const qrCodeDetails = ref(null)
    //查询详情
    const getDetails = (id: number) => {
      (qrCodeDetails.value as any).open(id)
    }

    //查询统计
    const openInfoTotal = (projectName: string) => {
      emit('openInfoTotal', projectName)
    }

      //选择二维码生效时间
    const timerChange = (e) => {
      if (e) {
        QueryObj.value.beginTime = dayjs(e[0]).format("YYYY-MM-DD HH:mm:ss");
        QueryObj.value.endTime = dayjs(e[1]).format("YYYY-MM-DD") + " 23:59:59";

        // (formEl.value as any).validateField("times", () => null);
        // delete QueryObj.value.times;
      } else {
        QueryObj.value.beginTime = "";
        QueryObj.value.endTime = "";
      }
    };


    return {
      timerChange,
      QueryObj,
      pageForm,
      tableList,
      getMerchantList,
      handleCurrentChange,
      merchantAllInfoCom,
      addMerchant,
      dayjs,
      qrCodeMadel,
      openQrCodeMadel,
      openDetailsList,
      createQrCode,
      resetQuery,
      getDetails,
      editQrCode,
      qrCodeDetails,
      mergeQrCode,
      createMergeQrCode,
      openInfoTotal,
      btnChange,

    };
  },
});
</script>
<style lang='scss' scoped>
.filter-box {
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  .el-form-item {
    margin-right: 20px;
  }
}
</style>
