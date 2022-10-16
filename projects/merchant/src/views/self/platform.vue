<template>
  <basic-container>
    <div class="platform">
      <ul class="all_desk">
        <li class="desk" v-for="(item, index) in desks" :key="index">
          <div class="desk_info" @click="editDesk(item)">
            <div>{{ item.number }}</div>
            <div>￥{{ item.min }}</div>
            <div>{{ item.people }}人</div>
            <div>{{ item.type }}</div>
          </div>
        </li>
      </ul>
    </div>

    <el-dialog
      title="编辑"
      append-to-body="true"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <div class="form">
        <div class="btns">
          <el-button
            :type="form.id == item.id ? 'primary' : ''"
            v-for="(item, index) in btnType"
            :key="index"
            @click="changeBtn(item)"
            >{{ item.type }}</el-button
          >
        </div>
        <!-- <template v-if="form.id == 1 || form.id == 3 ">
                    <div class="desk_type">
                        <el-radio v-model="form.radio" label="1">普通</el-radio>
                        <el-radio v-model="form.radio" label="2">宴请</el-radio>
                        <el-radio v-model="form.radio" label="3">赠送</el-radio>
                    </div>
                    <div class="inp">
                        <label for="">客户名称：</label>
                        <el-input v-model="form.userName" placeholder="请输入内容"></el-input>
                        <el-checkbox v-model="form.loose">散客</el-checkbox>
                    </div>
                    <div class="inp">
                        <label for="">销售名称：</label>
                        <el-input v-model="form.marketName" placeholder="请输入内容"></el-input>
                    </div>
                </template> -->
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveEdit">确 定</el-button>
      </span>
    </el-dialog>
  </basic-container>
</template>

<script>
import { getFloorList } from "@/api/demo/platform";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      dialogVisible: false,
      btnType: [
        { id: 1, type: "已预定" },
        { id: 2, type: "可预定" },
        { id: 3, type: "使用中" },
        { id: 4, type: "不可预定" },
        { id: 5, type: "宴请" },
        { id: 6, type: "赠送" },
        { id: 7, type: "禁用" },
      ],
      desks: [
        // 抵消  人数  座位类型
        { id: 1, min: "10", people: "2", type: "散台", number: "A-09" },
        { id: 2, min: "10", people: "2", type: "散台", number: "A-02" },
        { id: 3, min: "10", people: "2", type: "散台", number: "A-03" },
        { id: 4, min: "10", people: "2", type: "散台", number: "A-04" },
        { id: 5, min: "10", people: "2", type: "散台", number: "A-052" },
        { id: 6, min: "10", people: "2", type: "散台", number: "A-06" },
        { id: 7, min: "10", people: "2", type: "散台", number: "A-11" },
        { id: 8, min: "10", people: "2", type: "散台", number: "A-12" },
        { id: 9, min: "10", people: "2", type: "散台", number: "A-10" },
      ],
      form: {
        id: "",
        radio: 0,
        loose: false,
        userName: "",
        marketName: "",
      },
    };
  },
  created() {
    this.getData();
  },

  methods: {
    getData() {
      getFloorList().then((res) => {
        console.log(res);
      });
    },
    editDesk(row) {
      this.form = row;
      this.dialogVisible = true;
    },
    changeBtn(row) {
      this.form.id = row.id;
    },
    saveEdit() {
      console.log(this.form);
    },
  },
};
</script>

<style scoped lang="scss">
.platform {
  .all_desk {
    display: flex;
    flex-wrap: wrap;
    // justify-content: space-between;
    // justify-content: center;
    font-size: 0;
    .desk {
      width: 14.28%;
      justify-content: center;
      display: flex;
      margin-bottom: 20px;
      .desk_info {
        width: 78%;
        font-size: 16px;
        cursor: pointer;
        background: chocolate;
        border-radius: 4px;
        padding: 10px;
        box-shadow: 5px 5px 7px #bbbbbb;
      }
    }
  }
}
.form {
  .inp {
    margin-top: 20px;
    /deep/.el-input {
      width: 33%;
      margin-right: 10px;
    }
  }
  .btns {
    margin-top: 20px;
  }
  .desk_type {
    margin-top: 20px;
  }
}
</style>