<template>
  <el-dropdown @command="handleCommand">
    <span class="avatar-dropdown">
      <img :src="userAvatar" alt="" class="user-avatar" />
      <div class="user-name">
        {{ username }}
        <vab-remix-icon icon="arrow-down-s-line" />
      </div>
    </span>

    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item command="changePass">
        <vab-remix-icon icon="lock-2-line" />
        {{ translateTitle('修改信息') }}
      </el-dropdown-item>
      <el-dropdown-item command="logout">
        <vab-remix-icon icon="logout-circle-r-line" />
        {{ translateTitle('退出登录') }}
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
  import { translateTitle } from '@/utils/i18n'
  import { mapActions, mapGetters } from 'vuex'
  import { GetFile } from '@/api/common'
  import { recordRoute } from '@/config'
  export default {
    name: 'Avatar',
    data() {
      return {
        userAvatar:
          'https://yjbfiles.oss-cn-shenzhen.aliyuncs.com/Th6/6d/Th68B4byvheRClUhh9H6d.jpg?w=1920&h=1080',
      }
    },
    computed: {
      ...mapGetters({
        avatar: 'user/avatar',
        username: 'user/username',
        data: 'user/',
      }),
    },
    created() {
      if (!!this.avatar) {
        console.log(this.avatar)
        GetFile(this.avatar).then((res) => {
          if (+res.code === 0) {
            this.userAvatar = res.data
          }
        })
      }
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
          case 'changePass':
            // eslint-disable-next-line vue/custom-event-name-casing
            this.$emit('changePass')
            break
        }
      },
      personalCenter() {
        this.$router.push('/personalCenter/personalCenter')
      },
      async logout() {
        console.log('退出')
        await this.$router.push('/')
        const fullPath = this.$route.path
        await this._logout()
        await this.delAllVisitedRoutes()
        if (recordRoute) {
          await this.$router.push(`/login?redirect=${fullPath}`)
        } else {
          await this.$router.push('/login')
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
