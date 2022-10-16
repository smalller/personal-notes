<template>
  <div>
    <el-table
      border
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
    >
      <el-table-column label="ID" fixed type="index"></el-table-column>
      <el-table-column prop="name" label="姓名"> </el-table-column>
      <el-table-column prop="sex" label="性别">
        <template slot-scope="scope">
          <span>{{ scope.row.sex | sex }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="phone" label="手机号码"></el-table-column>
      <el-table-column label="操作" fixed="right">
        <template slot-scope="scope">
          <el-button type="primary" @click="viewUserInfo(scope.row.id)"
            >查看详情</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 查看用户信息 -->
    <el-dialog title="用户信息" :visible.sync="dialog" append-to-body="true">
      <div class="user-info">
        <ul>
          <li>
            名字：<span>{{ userInfo.realName }}</span>
          </li>
          <li>
            用户编号：<span>{{ userInfo.codeNs }}</span>
          </li>
          <li>
            性别：<span>{{ userInfo.sex | sex }}</span>
          </li>
          <li>
            出生日期： <span>{{ userInfo.birthday }}</span>
          </li>
          <li>
            所在地：<span>{{ userInfo.fullAddress }}</span>
          </li>
          <li>
            手机号码：<span>{{ userInfo.phone }}</span>
          </li>
          <li>
            邮箱： <span>{{ userInfo.email }}</span>
          </li>
          <li>
            身份证号码： <span>{{ userInfo.idCard }}</span>
          </li>
          <li>
            最后登录时间：<span>{{ userInfo.timeLast }}</span>
          </li>
          <li>
            是否实名认证：<span>{{ userInfo.isCertification }}</span>
          </li>
          <li>
            财富等级：<span>{{ userInfo.wealthLevel }}</span>
          </li>
          <li>
            总消费金额：<span>{{ userInfo.moneyConsume }}</span>
          </li>
          <li>
            用户状态：<span>{{ userInfo.statusRestrict }}</span>
          </li>
        </ul>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialog = false">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getList } from "@/api/system/userManagement";

export default {
  props: ["tableData"],
  data() {
    return {
      dialog: false,
      userInfo: {},
    };
  },
  methods: {
    //查看用户详情
    async viewUserInfo(id) {
      const res = await getList(1, 10, { id });
      if (res.data.code === 200) {
        this.userInfo = res.data.data.records[0];
        this.dialog = true;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.user-info {
  ul,
  li {
    list-style: none;
  }

  ul {
    display: flex;
    flex-wrap: wrap;

    li {
      width: 50%;
      font-size: 16px;
      margin-bottom: 30px;
    }
  }
}
</style>