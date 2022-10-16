<template>
  <div class="roles-container">
    <el-alert
      v-if="!loginInterception"
      :closable="false"
      title="检测到您当前的登录拦截已关闭，无法模拟切换角色功能，请在src/config/settings.js中配置loginInterception为ture，开启登录拦截"
      show-icon
      type="success"
    ></el-alert>
    <el-alert
      :closable="false"
      :title="`当前路由模式为：{ authentication:${authentication} }，是否开启角色权限控制功能：{ rolesControl:${rolesControl} }`"
      show-icon
      type="success"
    ></el-alert>

    <h3>intelligence模式</h3>
    <p>前端根据roles角色和ability数组处理路由</p>
    <el-form ref="form" label-position="top" :model="form" label-width="140px">
      <el-form-item label="账号">
        <el-radio-group v-model="form.account" @change="handleChangeRole">
          <el-radio-button label="admin">admin</el-radio-button>
          <el-radio-button label="editor">editor</el-radio-button>
          <el-radio-button label="test">test</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="描述">
        当前账号拥有的角色{{ JSON.stringify(role) }}，权限点{{
          JSON.stringify(ability)
        }}
      </el-form-item>
      <el-form-item label="按钮级角色">
        <el-button v-permissions="['admin']" type="primary">
          拥有["admin"]角色的按钮
        </el-button>
        <el-button
          v-permissions="{ role: ['admin'], mode: 'except' }"
          type="danger"
        >
          未拥有["admin"]角色的按钮
        </el-button>
        <el-button v-permissions="['editor']" type="primary">
          拥有["editor"]角色的按钮
        </el-button>
        <el-button
          v-permissions="{ role: ['editor'], mode: 'except' }"
          type="danger"
        >
          未拥有["editor"]角色的按钮
        </el-button>
        <el-button
          v-permissions="{ role: ['admin', 'editor'], mode: 'allOf' }"
          type="primary"
        >
          同时拥有["admin","editor"]角色的按钮
        </el-button>
        <el-button v-permissions="['test']" type="primary">
          拥有["test"]角色的按钮
        </el-button>
      </el-form-item>
      <el-form-item label="按钮级权限点">
        <el-button v-permissions="{ ability: ['READ'] }" type="primary">
          拥有["READ"]权限点的按钮
        </el-button>
        <el-button
          v-permissions="{ ability: ['READ'], mode: 'except' }"
          type="danger"
        >
          未拥有["READ"]权限点的按钮
        </el-button>
        <el-button v-permissions="{ ability: ['WRITE'] }" type="primary">
          拥有["WRITE"]权限点的按钮
        </el-button>
        <el-button
          v-permissions="{ ability: ['WRITE'], mode: 'except' }"
          type="danger"
        >
          未拥有["WRITE"]权限点的按钮
        </el-button>
        <el-button v-permissions="{ ability: ['DELETE'] }" type="primary">
          拥有["DELETE"]权限点的按钮
        </el-button>
        <el-button
          v-permissions="{ ability: ['DELETE'], mode: 'except' }"
          type="danger"
        >
          未拥有["DELETE"]权限点的按钮
        </el-button>
      </el-form-item>
      <el-form-item label="按钮级角色&权限点">
        <el-button
          v-permissions="{ role: ['admin'], ability: ['DELETE'] }"
          type="primary"
        >
          拥有["admin"]角色或者["DELETE"]权限点的按钮
        </el-button>
        <el-button
          v-permissions="{ role: ['editor'], ability: ['READ'], mode: 'allOf' }"
          type="primary"
        >
          同时拥有editor和["READ"]权限点的按钮
        </el-button>
        <el-button
          v-permissions="{
            role: ['admin'],
            ability: ['DELETE'],
            mode: 'except',
          }"
          type="danger"
        >
          没有admin和["DELETE"]权限点的按钮
        </el-button>
      </el-form-item>
    </el-form>

    <h3>all模式</h3>
    <p>
      settings.js配置authentication为all即可路由交由后端控制,mock中有后端接口示例,角色繁琐,有几十种角色的项目直接用这种,
      当开启rolesControl:true时前端也可以根据roles角色和ability数组处理路由
    </p>
    <el-row :gutter="20">
      <el-col :span="24">
        <el-table
          :data="tableData"
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
          default-expand-all
          row-key="path"
        >
          <el-table-column
            align="center"
            label="name"
            prop="name"
            width="220"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            align="center"
            label="path"
            prop="path"
            width="220"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            align="center"
            label="component"
            prop="component"
            width="220"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            align="center"
            label="redirect"
            prop="redirect"
            width="220"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            align="center"
            label="title"
            prop="meta.title"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            align="center"
            label="remixIcon"
            show-overflow-tooltip
          >
            <template #default="{ row }">
              <span v-if="row.meta">
                <vab-remix-icon
                  v-if="row.meta.remixIcon"
                  :icon="row.meta.remixIcon"
                />
              </span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="affix" show-overflow-tooltip>
            <template #default="{ row }">
              <span v-if="row.meta">
                {{ row.meta.affix || false }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="noKeepAlive"
            show-overflow-tooltip
            width="100"
          >
            <template #default="{ row }">
              <span v-if="row.meta">
                <template v-if="!row.meta.noKeepAlive">false</template>
                <template v-else>true</template>
              </span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="badge" show-overflow-tooltip>
            <template #default="{ row }">
              <span v-if="row.meta">
                {{ row.meta.badge }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="isCustomSvgIcon"
            show-overflow-tooltip
            width="140"
          >
            <template #default="{ row }">
              <span v-if="row.meta">
                {{ row.meta.isCustomSvgIcon || false }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="tagHidden"
            show-overflow-tooltip
          >
            <template #default="{ row }">
              <span v-if="row.meta">
                <template v-if="!row.meta.tagHidden">false</template>
                <template v-else>true</template>
              </span>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import {
    authentication,
    loginInterception,
    rolesControl,
    tokenTableName,
  } from '@/config'
  import { getRouterList } from '@/api/router'
  import { filterRoutes } from '@/utils/routes'

  export default {
    name: 'Roles',
    components: {},
    data() {
      return {
        form: {
          account: '',
        },
        tableData: [],
        res: [],
        authentication,
        loginInterception,
        rolesControl,
      }
    },
    computed: {
      ...mapGetters({
        username: 'user/username',
        role: 'acl/role',
        ability: 'acl/ability',
      }),
    },
    created() {
      this.form.account = this.username
      this.fetchData()
    },
    methods: {
      async handleChangeRole() {
        this.$baseLoading(0, '正在切换账号请稍后...')
        await localStorage.setItem(
          tokenTableName,
          `${this.form.account}-accessToken`
        )
        await location.reload()
      },
      async fetchData() {
        const res = await getRouterList()
        this.tableData = filterRoutes([...res.data])
      },
    },
  }
</script>
<style lang="scss" scoped>
  ::v-deep {
    .el-button {
      margin-right: 10px;
    }
    .el-button + .el-button {
      margin-right: 10px;
      margin-left: 0;
    }
    .el-form-item--small.el-form-item {
      margin-bottom: 0;
      .el-form-item__content {
        > * {
          margin-bottom: 10px;
        }
      }
    }
  }
</style>
