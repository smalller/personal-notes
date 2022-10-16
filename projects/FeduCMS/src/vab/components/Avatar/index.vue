<template>
  <div>
    <el-dropdown @command="handleCommand">
      <span class="avatar-dropdown">
        <img
          :src="
            avatar ||
            'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1090569018,652262806&fm=26&gp=0.jpg'
          "
          alt=""
          class="user-avatar"
        />
        <div class="user-name">
          {{ username }}
          <vab-remix-icon icon="arrow-down-s-line" />
        </div>
      </span>

      <el-dropdown-menu slot="dropdown">
        <!-- <el-dropdown-item v-if="isSchool !== 'login'" command="changePass">
          <vab-remix-icon icon="lock-2-line" />
          {{ translateTitle('修改密码') }}
        </el-dropdown-item> -->
        <el-dropdown-item v-if="isSchool === 'login'" command="setSchool">
          <vab-remix-icon icon="home-3-line" />
          切换学校
        </el-dropdown-item>
        <el-dropdown-item command="logout">
          <vab-remix-icon icon="logout-circle-r-line" />
          {{ translateTitle('退出登录') }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <el-dialog
      title="选择学校"
      :visible.sync="dialogVisible"
      width="30%"
      center
    >
      <div>
        <span>学校名称：</span>
        <el-select v-model="selectSchool" placeholder="请选择学校">
          <el-option
            v-for="(item, index) in schoolList"
            :key="index"
            :label="item.schoolName"
            :value="item.schoolId"
            :disabled="+item.code === 1"
          ></el-option>
        </el-select>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setSchool">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import { translateTitle } from '@/utils/i18n'
  import { mapActions, mapGetters } from 'vuex'
  import { recordRoute } from '@/config'
  export default {
    name: 'Avatar',
    data() {
      return {
        dialogVisible: false,
        schoolList: [],
        selectSchool: '',
        isSchool: sessionStorage.getItem('loginAgent'),
      }
    },
    computed: {
      ...mapGetters({
        avatar: 'user/avatar',
        username: 'user/username',
      }),
    },
    created() {
      // console.log('头像页面', this.avatar)
    },
    methods: {
      translateTitle,
      ...mapActions({
        _logout: 'user/logout',
        delAllVisitedRoutes: 'tabsBar/delAllVisitedRoutes',
      }),
      handleCommand(command) {
        switch (command) {
          case 'logout':
            this.logout()
            break
          case 'setSchool':
            this.getSchool()
            break
          case 'changePass':
            // eslint-disable-next-line vue/custom-event-name-casing
            this.$emit('changePass')
            break
        }
      },
      personalCenter() {
        this.$router.push('/personalCenter/personalCenter')
      },
      getSchool() {
        console.log('8787899999999999999999')
        let data = JSON.parse(sessionStorage.getItem('schoolInfo'))
        this.selectSchool = sessionStorage.getItem('zdyjb_schoolId')
        if (data.length > 1) {
          this.dialogVisible = true
          this.schoolList = [...data]
          console.log(this.schoolList)
        } else {
          this.$message.warning('暂无其它学校')
        }
      },
      setSchool() {
        if (this.selectSchool) {
          sessionStorage.setItem('zdyjb_schoolId', this.selectSchool)
          let schoolName = this.schoolList.filter(
            (item) => item.schoolId === this.selectSchool
          )[0].schoolName
          sessionStorage.setItem('jsy_schoolName', schoolName)
          location.reload()
        }
      },
      async logout() {
        await this.$router.push('/')
        const fullPath = this.$route.path
        await this._logout()
        await this.delAllVisitedRoutes()
        if (sessionStorage.getItem('loginAgent') === 'login') {
          await this.$router.push('/login')
        } else {
          await this.$router.push('/login/agent')
        }
      },
    },
  }
</script>
<style lang="scss" scoped>
  .avatar-dropdown {
    display: flex;
    align-content: center;
    align-items: center;
    justify-content: center;
    justify-items: center;

    .user-avatar {
      width: 40px;
      height: 40px;
      margin-left: 15px;
      cursor: pointer;
      border-radius: 50%;
    }

    .user-name {
      position: relative;
      display: flex;
      align-content: center;
      align-items: center;
      height: 40px;
      margin-left: 6px;
      line-height: 40px;
      cursor: pointer;

      [class*='ri-'] {
        margin-left: 0 !important;
      }
    }
  }
</style>
