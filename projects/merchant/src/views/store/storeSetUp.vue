<template>
  <basic-container v-if="storeType === 1 || storeType === 2">
    <div class="platform">
      <div class="all_floors">
        <div class="floors" v-for="(item, index) in floors" :key="index">
          <el-button
            @click="editfloors(item, index)"
            :type="selectFloor == index ? 'primary' : ''"
            >{{ item.floor }}</el-button
          >
        </div>
      </div>

      <ul class="all_desk">
        <li class="desk" v-for="(item, index) in desks" :key="index">
          <div class="desk_info" @click="editDesk(item)" :style="{background:item.color}">
            <div>座位号：{{ item.seatCode || "-" }}</div>
            <div>低消：￥{{ item.lowestMoney || "0" }}</div>
            <div>容纳人数：{{ item.capacity || "-" }}人</div>
            <div>座位类型：{{ item.type }}</div>
            <div>座位状态：{{item.typeText}}</div>
          </div>
        </li>
      </ul>
    </div>

    <el-dialog
      title="编辑"
      append-to-body="true"
      :visible.sync="dialogVisible"
      width="38%"
      :before-close="handleClose"
    >
      <div class="form">
        <div class="btns">
          <el-button
            :type="form.status == item.id ? 'primary' : ''"
            v-for="(item, index) in btnType"
            :key="index"
            @click="changeBtn(item)"
            >{{ item.type }}</el-button
          >
        </div>
        <template v-if="form.status == 3 || form.status == 4 ">
          <div class="desk_type">
              <el-radio v-model="form.seatUse" label="1">默认</el-radio>
              <el-radio v-model="form.seatUse" label="2">宴请</el-radio>
              <el-radio v-model="form.seatUse" label="3">赠送</el-radio>
          </div>
          <!-- <div class="inp">
              <label for="">客户名称：</label>
              <el-input v-model="form.userName" placeholder="请输入内容"></el-input>
              <el-checkbox v-model="form.loose">散客</el-checkbox>
          </div>
          <div class="inp">
              <label for="">销售名称：</label>
              <el-input v-model="form.marketName" placeholder="请输入内容"></el-input>
          </div> -->
        </template>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveEdit">确 定</el-button>
      </span>
    </el-dialog>
  </basic-container>
  <basic-container v-else> 本店铺不支持开台管理 </basic-container>
</template>

<script>
import {
  getFloorList,
  getFloorInfo,
  updateSeatStatus,
} from "@/api/store/storeSetUp";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      storeType: this.$store.state.storeType,

      dialogVisible: false,
      btnType: [
        { id: 1, type: "可预订" },
        { id: 2, type: "不可预定" },
        { id: 3, type: "已预订" },
        { id: 4, type: "使用中" },
      ],
      desks: [],
      floors: [],
      form: {
        id: "",
        seatUse: 0,
        loose: false,
        userName: "",
        marketName: "",
        status:''
      },
      selectFloor: 0,
    };
  },
  created() {
    this.getData();
  },

  methods: {
    getData() {
      getFloorList().then((res) => {
        if (res.data.code == 200) {
          this.floors = res.data.data;
          this.editfloors(this.floors[0], 0);
        } else {
          this.$message.warning(res.data.msg);
        }
      });
    },
    editDesk(row) {
      this.form = row;
      this.dialogVisible = true;
      this.form.seatUse = row.seatUse.toString()
    },
    editfloors(row, index) {
      this.selectFloor = index;
      getFloorInfo({ storeFloorId: row.id }).then((res) => {
        if (res.data.code == 200) {
          res.data.data.forEach(v=>{
            switch (v.status) {
              case 1:
                v["color"] = "#349B58";
                v['typeText'] = '可预订'
                break;
              case 2:
                v["color"] = "#485162";
                v['typeText'] = '不可预定'
                break;
              case 3:
                v["color"] = "#AC5C56";
                v['typeText'] = '已预订'
                break;
              case 4:
                v["color"] = "#BC9D1D";
                v['typeText'] = '使用中'
                break;
            }
          })
          this.desks = res.data.data;
          
          this.desks.forEach((v) => {
            switch (v.seatType) {
              case 0:
                v["type"] = "卡座";
                break;
              case 1:
                v["type"] = "散客";
                break;
              case 2:
                v["type"] = "独立高脚凳";
                break;
              case 3:
                v["type"] = "吧台";
                break;
              case 4:
                v["type"] = "沙发";
                break;
            }
          });
        } else {
          this.$message.warning(res.data.msg);
        }
      });
    },
    changeBtn(row) {
      this.form.status = row.id;
    },
    saveEdit() {
      let data = {
        seatId: this.form.id,
        status: this.form.status,
        seatAttribute:1,
        seatUse:this.form.seatUse || ''
      };
      updateSeatStatus(data).then((res) => {
        if (res.data.code == 200) {
          this.$message.success("更新成功");
          this.dialogVisible = false;
          this.getData()
        } else {
          this.$message.warning(res.data.msg);
        }
      });
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
  .all_floors {
    margin-bottom: 20px;
    .floors {
      display: inline-block;
      margin-right: 10px;
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