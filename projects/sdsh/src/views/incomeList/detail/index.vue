<template>
  <div class="">
    <el-card
      shadow="never"
      class="cus-card"
      style="margin-bottom: 15px"
      :body-style="{ 'padding-bottom': '0' }"
    >
      <el-form :model="formData" class="filter-box" label-position="right">
        <el-form-item label="支付时间">
          <el-date-picker
            type="daterange"
            v-model="times"
            @change="timerChange"
            range-separator="-"
            start-placeholder="请选择开始时间"
            end-placeholder="请选择截止时间"
          />
          <!-- <el-input
            clearable
            v-model="QueryObj.contactsName"
            placeholder="请输入联系人"
          /> -->
        </el-form-item>
        <el-form-item label="支付方式">
          <el-select v-model="formData.payType">
            <el-option label="全部" value="" />
            <el-option label="支付宝" value="1" />
            <el-option label="微信" value="2" />
            <el-option label="其他" value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="交费状态">
          <el-select v-model="formData.payStatus">
            <el-option label="全部" value="" />
            <el-option label="支付未完成" value="0" />
            <el-option label="待支付" value="1" />
            <el-option label="已支付" value="2" />
            <el-option label="支付失败" value="3" />
            <el-option label="退款" value="4" />
          </el-select>
        </el-form-item>
        <el-form-item label="项目名称：">
          <el-input
            clearable
            v-model="formData.projectName"
            placeholder="请输入项目名称"
          />
        </el-form-item>
        <el-form-item label="收据发放">
          <el-select v-model="formData.bill">
            <el-option label="全部" value="" />
            <el-option label="已发放" value="1" />
            <el-option label="未发放" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="排序方式">
          <el-radio-group v-model="formData.desc">
            <el-radio  label="1">按支付时间</el-radio>
            <el-radio  label="2">按姓名</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="年级班级">
          <el-select
            v-model="formData.gradeId"
            @change="gradeChange"
            style="width: 100px"
          >
            <el-option
              v-for="item in gradeList"
              :key="item.id"
              :label="item.gradeName"
              :value="item.gradeId"
            />
          </el-select>

          <el-select v-model="formData.classId" style="width: 100px">
            <el-option
              v-for="item in classList"
              :key="item.id"
              :label="item.className"
              :value="item.id"
            />
          </el-select>
          <!--          <el-cascader @change="gradeChange" :props="gradeProps" />-->
        </el-form-item>
        <el-form-item label="学生姓名">
          <el-input
            clearable
            v-model="formData.studentName"
            placeholder="请输入学生姓名"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="queryList">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card shadow="never">
      <el-button style="margin-bottom: 5px" type="success" @click="exportExcel"
        >导出Excel</el-button
      >
      <el-button style="margin-bottom: 5px" @click="exportNameBill" type="success">导出收据</el-button>
      <el-button
        style="margin-bottom: 5px"
        type="success"
        @click="toBillSetting"
        >收据样式设置</el-button
      >
      <el-table :data="tableList">
        <el-table-column label="支付完成时间" prop="payTime">
          <template #default="{ row }">
            {{ dayjs(row.payTime).format("YYYY-MM-DD HH:mm:ss") }}
          </template>
        </el-table-column>
        <el-table-column label="项目名称" prop="projectName" />
        <!-- <el-table-column label="交费项" prop="itemName" /> -->
        <el-table-column label="交费金额" prop="totalMoney" />
        <el-table-column label="支付方式" prop="payType">
          <template #default="{ row }">
            <el-tag type="success">{{
              +row.payType === 1
                ? "支付宝"
                : +row.payType === 2
                ? "微信"
                : "其他"
            }}</el-tag>
          </template>
        </el-table-column>

          <el-table-column prop="remark" label="备注">
      <template #default="{ row }">
        <div v-for="(item, index) in getRemarkList(row.remark)" :key="index">
          <span>{{item.registerName}}</span>:
          <span>{{item. registerValue}}</span>
        </div>
      </template>
    </el-table-column>
        <el-table-column label="操作" prop="projectName" width="280px">
          <template #default="{ row }">
            <el-button @click="getPayDetails(row.id)">查看</el-button>
            <el-button>退款</el-button>
            <el-button>备注</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pagination"
        background
        layout="prev, pager, next"
        :total="totalNum"
        :page-size="pageSize"
        :current-page="currentPage"
        @current-change="handleCurrentChange"
      />
    </el-card>
    <el-drawer
      title="交费详情"
      :size="500"
      v-model="detailsVisible"
      @close="detailsVisible = false"
    >
      <el-descriptions title="" border :column="1" direction="horizontal">
        <el-descriptions-item label="交易时间">{{
          dayjs(payInfos.payTime).format("YYYY-MM-DD HH:mm:ss")
        }}</el-descriptions-item>
        <el-descriptions-item label="交易订单号">{{
            payInfos.orderNumber
        }}</el-descriptions-item>
        <el-descriptions-item label="项目名称">{{
          payInfos.projectName
        }}</el-descriptions-item>
        <el-descriptions-item label="交费项目">
          <el-table :data="payInfos.nameProjectItemDtos">
            <el-table-column label="收费项目名称" prop="itemName"/>
            <el-table-column label="收费金额" prop="money"/>
          </el-table>
        </el-descriptions-item>

        <el-descriptions-item label="交费金额">{{
          payInfos.payMoney
        }}</el-descriptions-item>
        <el-descriptions-item label="交费状态">
          <el-tag v-if="+payInfos.payStatus === 0">支付未完成</el-tag>
          <el-tag v-if="+payInfos.payStatus === 1">待支付</el-tag>
          <el-tag v-if="+payInfos.payStatus === 2">已支付</el-tag>
          <el-tag v-if="+payInfos.payStatus === 3">支付失败</el-tag>
          <el-tag v-if="+payInfos.payStatus === 4">退款</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="支付方式">{{
          +payInfos.payType === 1
            ? "支付宝"
            : +payInfos.payType === 2
            ? "微信"
            : "其他"
        }}</el-descriptions-item>
      </el-descriptions>
      <el-button @click="detailsVisible = false">返回</el-button>
    </el-drawer>
    <applyRefund ref="applyRefundCom"></applyRefund>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, Ref, reactive } from "vue";
import { QueryListParams, TableListItem } from "./data";
import {
  getInfoList,
  getGradeList,
  getClassList,
  queryPayInfo,
  exExcel, exNameBill,
} from "./api";
import dayjs from "dayjs";
import { useRouter } from "vue-router";
import micell from "micell";
// import bankCardInfo from "@/components/merchant/bankCardInfo.vue";
// import basicInfo from "@/components/merchant/basicInfo.vue";
// import idCardInfo from "@/components/merchant/idCardInfo.vue";
// import merchantAllInfo, { Setup as MerAllInfoSetup } from '../components/merchantAllInfo.vue';
import applyRefund, {
  Setup as ApplySetup,
} from '@/views/returnManage/components/applyRefund.vue'

export default defineComponent({
  name: "",
  components: {
    applyRefund
    // bankCardInfo,
    // basicInfo,
    // idCardInfo,
    // merchantAllInfo,
  },
  setup() {
    const router = useRouter();
    const formData = reactive<QueryListParams>({
        payStatus: '2'
    });
    const currentPage = ref<number>(1); // 当前页码
    const pageSize = ref<number>(20); // 每页展示条数
    const totalNum = ref<number>(0); // 表格总条数
    const tableList = ref<TableListItem[]>([]); // 表格数据
    const gradeList = ref<any[]>([]);
    const classList = ref<any[]>([]);
    const payInfos = ref({});

    const detailsVisible = ref(false);

    const getGrade = () => {
      getGradeList().then((res) => {
        if (res.code === 1000) {
          gradeList.value = res.data;
        }
      });
    };

    getGrade();

    const getClass = (id: number) => {
      getClassList(id).then((res) => {
        if (+res.code === 1000) {
          classList.value = res.data.list;
        }
      });
    };

    const toBillSetting = () => {
      router.push("/income/receipt");
    };

    const exportExcel = () => {
      exExcel(
        currentPage.value,
        pageSize.value,
        Object.assign(
          {},
          {
            ...formData,
          }
        )
      ).then((blob) => {
        micell.download(blob, "明细.xlsx");
      });
    };

    //导出名单收据
    const exportNameBill = () => {
      exNameBill(
          currentPage.value,
          pageSize.value,
          Object.assign(
              {},
              {
                ...formData,
              }
          )
      ).then(blob => {
        console.log(blob)
        micell.download(blob, "收据.zip");
      })
    }

    const gradeProps = {
      // lazy: true,
      // lazyLoad(node, resolve) {
      //   const { level,value } = node;
      //   if(level === 0) {
      //     getGradeList().then(res => {
      //       if(res.code === 1000) {
      //         gradeList.value = res.data;
      //         const arr = gradeList.value.map(item => ({
      //           value: item.gradeId,
      //           label: item.gradeName,
      //           leaf: 'leaf'
      //         }))
      //         resolve(arr)
      //       }
      //     })
      //   }
      //   if(level === 1) {
      //     getClassList(value).then(res => {
      //       if(+res.code === 1000) {
      //         classList.value = res.data.list
      //         const arr = classList.value.map(item => ({
      //           value: item.id,
      //           label: item.className,
      //           leaf: 'leaf'
      //         }))
      //         resolve(arr)
      //       }
      //     })
      //   }
      // }
    };

    const gradeChange = (id: number) => {
      classList.value = [];
      formData.classId = "";
      getClass(id);
    };

    async function getList(): Promise<void> {
      const { code, data } = await getInfoList(
        currentPage.value,
        pageSize.value,
        Object.assign(
          {},
          {
            ...formData,
          }
        )
      );
      if (+code === 1000) {
        tableList.value = data.list;
        totalNum.value = data.total;
      }
    }
    getList();

    // 翻页
    const handleCurrentChange = (res: number): void => {
      currentPage.value = res;
      getList();
    };

    const addMerchant = (): void => {
      // (merchantAllInfoCom.value as MerAllInfoSetup).handleOpen(1);
    };

    const times = ref([]);

    const timerChange = (e) => {
      // console.log(e)
      if (e) {
        formData.startTime = dayjs(e[0]).format("YYYY-MM-DD HH:mm:ss");
        formData.endTime = dayjs(e[1]).format("YYYY-MM-DD") + " 23:59:59";
      } else {
        formData.startTime = "";
        formData.endTime = "";
      }
    };

    const queryList = () => {
      currentPage.value = 1;
      getList();
    };

    const getPayDetails = (id: number) => {
      queryPayInfo(id).then((res) => {
        if (+res.code === 1000) {
          payInfos.value = res.data;
          detailsVisible.value = true;
        }
      });
    };

    const applyRefundCom = ref<unknown>(null);

    // 申请退款
    function applyRefund(row: any): void {
      (applyRefundCom.value as ApplySetup).handleOpen(row.id, 1);
    }

    const getRemarkList = (remark:string):any[] => {
      let list:any[] = [];
      try {
        const data = JSON.parse(remark)
        data.forEach(item => {
          list.push({
            registerName: item.registerName,
            registerValue: item.registerValue
          })
        })
      } catch {
        list = [];
      }
      return  list;
    }

    return {
      getRemarkList,
      formData,
      currentPage,
      pageSize,
      totalNum,
      tableList,
      handleCurrentChange,
      addMerchant,
      times,
      timerChange,
      queryList,
      gradeList,
      gradeChange,
      classList,
      gradeProps,
      dayjs,
      detailsVisible,
      payInfos,
      getPayDetails,
      toBillSetting,
      exportExcel,
      applyRefund,
      applyRefundCom,
      exportNameBill
    };
  },
});
</script>
<style lang="scss" scoped>
.filter-box {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  .el-form-item {
    margin-right: 20px;
  }
}
.income {
  display: flex;
  margin-bottom: 10px;
  span {
    font-weight: bold;
  }
  p {
    color: red;
    display: contents;
  }
}
</style>
