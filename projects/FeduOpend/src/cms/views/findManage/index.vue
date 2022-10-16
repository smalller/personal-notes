<template>
  <div class="find">
    <div class="videoBox">
      <div class="videoBoxHead">
        <span>视频专辑</span>
        <span>更多></span>
      </div>
      <div class="videoBoxContent itemBox">
        <div v-for="item in videoItemList" :key="item.index">
          <div v-if="item.show" class="itemSelect">
            <span @click="openVideoSelect(item, 1)">添加</span>
            <i class="el-icon-plus" @click="openVideoSelect(item, 1)"></i>
          </div>
          <div v-else class="itemsShow">
            <div class="btnBox">
              <el-button type="text" @click="updateAlbum(item, 1)">
                更换
              </el-button>
              <el-button type="text" @click="closeVideoSelect(item.item)">
                删除
              </el-button>
            </div>
            <div class="nameBox">
              {{ item.item.albumName }}
            </div>
            <img :src="item.item.cover" alt="" />
          </div>
        </div>
      </div>
    </div>
    <div class="audioBox">
      <div class="videoBoxHead">
        <span>音乐专辑</span>
        <span>更多></span>
      </div>
      <div class="videoBoxContent itemBox">
        <div v-for="item in audioItemList" :key="item.index">
          <div v-if="item.show" class="itemSelect">
            <span @click="openVideoSelect(item, 2)">添加</span>
            <i class="el-icon-plus" @click="openVideoSelect(item, 2)"></i>
          </div>
          <div v-else class="itemsShow">
            <div class="btnBox">
              <el-button type="text" @click="updateAlbum(item, 2)">
                更换
              </el-button>
              <el-button type="text" @click="closeVideoSelect(item.item)">
                删除
              </el-button>
            </div>
            <div class="nameBox">
              {{ item.item.albumName }}
            </div>
            <img :src="item.item.cover" alt="" />
          </div>
        </div>
      </div>
    </div>

    <div class="textBox">
      <div class="videoBoxHead">
        <span>图文专辑</span>
        <span>更多></span>
      </div>
      <div class="videoBoxContent itemBox">
        <div v-for="item in textItemList" :key="item.index">
          <div v-if="item.show" class="itemSelect">
            <span @click="getTextList(item)">添加</span>
            <i class="el-icon-plus" @click="getTextList(item)"></i>
          </div>
          <div v-else class="itemsShow">
            <div class="btnBox">
              <el-button type="text" @click="updateTextItem(item)">
                更换
              </el-button>
              <el-button type="text" @click="closeTextSelect(item.item)">
                删除
              </el-button>
            </div>
            <div class="nameBox">
              {{ item.item.title }}
            </div>
            <img :src="item.item.cover" alt="" />
          </div>
        </div>
      </div>
    </div>
    <el-dialog :visible.sync="videoMadelShow" @close="videoMadelShow = false">
      <!--      <el-table-->
      <!--        :data="list"-->
      <!--        highlight-current-row-->
      <!--        @current-change="handleCurrentChange"-->
      <!--      >-->
      <!--        <el-table-column label="专辑名称">-->
      <!--          <template #default="{ row }">-->
      <!--            <span-->
      <!--              style="-->
      <!--                overflow: hidden;-->
      <!--                text-overflow: ellipsis;-->
      <!--                white-space: nowrap;-->
      <!--              "-->
      <!--            >-->
      <!--              {{ row.albumName }}-->
      <!--            </span>-->
      <!--          </template>-->
      <!--        </el-table-column>-->
      <!--        <el-table-column>-->
      <!--          <template #default="{ row }">-->
      <!--            <img style="width: 80px; height: 45px" :src="row.cover" alt="" />-->
      <!--          </template>-->
      <!--        </el-table-column>-->
      <!--      </el-table>-->
      <table cellpadding="0" border="1" cellspacing="0" class="tableBox">
        <tr>
          <th>专辑名称</th>
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
          <tr v-for="item in list" :key="item.id">
            <td>{{ item.albumName }}</td>
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
      <el-pagination
        small
        layout="prev, pager, next"
        :current-page.sync="pageFrom.pageNo"
        :page-size="pageFrom.pageSize"
        :total="pageFrom.total"
        @current-change="currentChange"
      ></el-pagination>
      <div>
        <el-button
          :disabled="!currentRow.id"
          type="primary"
          @click="setVideoPosition()"
        >
          确定
        </el-button>
        <el-button @click="videoMadelShow = false">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="textMadelShow" @close="textMadelShow = false">
      <!--      <el-table-->
      <!--        :data="list"-->
      <!--        highlight-current-row-->
      <!--        @current-change="handleCurrentChange"-->
      <!--      >-->
      <!--        <el-table-column label="专辑名称">-->
      <!--          <template #default="{ row }">-->
      <!--            <span-->
      <!--              style="-->
      <!--                overflow: hidden;-->
      <!--                text-overflow: ellipsis;-->
      <!--                white-space: nowrap;-->
      <!--              "-->
      <!--            >-->
      <!--              {{ row.title }}-->
      <!--            </span>-->
      <!--          </template>-->
      <!--        </el-table-column>-->
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
          <tr v-for="item in list" :key="item.id">
            <td>{{ item.title }}</td>
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

      <el-pagination
        small
        layout="prev, pager, next"
        :current-page.sync="pageFrom.pageNo"
        :page-size="pageFrom.pageSize"
        :total="pageFrom.total"
        @current-change="currentChange"
      ></el-pagination>

      <div>
        <el-button
          type="primary"
          :disabled="!currentRow.id"
          @click="setTextPosition()"
        >
          确定
        </el-button>
        <el-button @click="textMadelShow = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    EditArticleItem,
    EditMediaAlbum,
    EditMediaAlbumPopular,
    QueryMediaAlbum,
    QueryTextList,
  } from '@/cms/api/mediaSetting'

  export default {
    data() {
      return {
        videoMadelShow: false,
        textMadelShow: false,
        list: [],
        type: 0,
        currentRow: {},
        position: 0,
        videoList: [],
        audioList: [],
        textList: [],
        isUpdate: false,
        updateItem: {},
        pageFrom: {
          pageNo: 1,
          pageSize: 10,
          total: 50,
        },
      }
    },
    computed: {
      videoItemList() {
        let list = []
        for (let i = 0; i < 6; i++) {
          const item = this.videoList.find(
            (item) => +item.popular === 1 && +item.popularSeq === i + 1
          )
          list.push({
            item: item,
            index: i + 1,
            show: !item,
          })
        }
        return list
      },
      audioItemList() {
        let list = []
        for (let i = 0; i < 3; i++) {
          const item = this.audioList.find(
            (item) => +item.popular === 1 && +item.popularSeq === i + 1
          )
          list.push({
            item: item,
            index: i + 1,
            show: !item,
          })
        }
        return list
      },
      textItemList() {
        let list = []
        for (let i = 0; i < 4; i++) {
          const item = this.textList.find(
            (item) => +item.popular === 1 && +item.popular_seq === i + 1
          )
          // console.log(this.textList)
          list.push({
            item: item,
            index: i + 1,
            show: !item,
          })
        }
        return list
      },
    },
    created() {
      this.init()
    },
    methods: {
      currentChange() {
        this.fetchData1()
        this.fetchData2()
      },
      prevClick() {
        this.$set(this.pageFrom, 'pageNo', this.pageFrom.pageNo--)
      },
      nextClick() {
        this.$set(this.pageFrom, 'pageNo', this.pageFrom.pageNo++)
      },
      handleCurrentChange(val) {
        this.currentRow = val.id === this.currentRow.id ? {} : val
      },
      init() {
        QueryMediaAlbum({
          type: 1,
          popular: 1,
        }).then((res) => {
          if (+res.code === 0) {
            this.videoList = res.data.list
          }
        })
        QueryMediaAlbum({
          type: 2,
          popular: 1,
        }).then((res) => {
          if (+res.code === 0) {
            this.audioList = res.data.list
          }
        })
        QueryTextList({
          popular: 1,
        }).then((res) => {
          if (+res.code === 0) {
            this.textList = res.data.list
          }
        })
        this.isUpdate = false
        this.currentRow = {}
        this.updateItem = {}
      },
      // 跟换专辑
      updateAlbum(val, type) {
        this.isUpdate = true
        this.updateItem = Object.assign({}, val.item)
        this.openVideoSelect(val, type)
      },
      // 选择视频专辑
      openVideoSelect(val, type) {
        this.position = val.index
        this.fetchData(type)
        this.videoMadelShow = true
      },
      async closeVideoSelect(val) {
        const params = {
          popular: 0,
          popularSeq: this.position,
          id: val.id,
          type: val.type,
        }
        await EditMediaAlbumPopular(params)
        this.init()
      },
      async fetchData(type) {
        this.type = type
        await this.fetchData1()
      },
      async fetchData1() {
        this.pageFrom.type = this.type
        this.pageFrom.enableStatus = 1
        const { data } = await QueryMediaAlbum(this.pageFrom)
        this.list = data.list
        this.pageFrom = {
          pageNo: data.page.pageNo,
          pageSize: data.page.pageSize,
          total: data.page.totalNum,
        }
      },
      // 设置发现页位置
      async setVideoPosition() {
        console.log(this.updateItem)
        if (this.isUpdate) {
          await EditMediaAlbumPopular({
            popular: 0,
            popularSeq: 1,
            id: this.updateItem.id,
            type: this.updateItem.type,
          })
        }
        const params = {
          popular: 1,
          popularSeq: this.position,
          id: this.currentRow.id,
          type: this.currentRow.type,
        }
        await EditMediaAlbumPopular(params)
        this.init()
        this.videoMadelShow = false
      },
      // 删除图文推荐信息
      async closeTextSelect(val) {
        const params = {
          popular: 0,
          popularSeq: this.position,
          id: val.id,
        }
        await EditArticleItem(params)
        this.init()
      },
      // 设置发现页图文位置
      async setTextPosition() {
        console.log(this.updateItem)
        if (this.isUpdate) {
          await EditArticleItem({
            popular: 0,
            popularSeq: 1,
            id: this.updateItem.id,
          })
        }
        const params = {
          popular: 1,
          popularSeq: this.position,
          id: this.currentRow.id,
        }
        await EditArticleItem(params)
        this.init()
        this.textMadelShow = false
      },
      // 获取图文新闻列表
      getTextList(val) {
        this.pageFrom = {
          pageNo: 1,
          pageSize: 10,
        }
        this.position = val.index
        this.textMadelShow = true
        this.fetchData2()
      },
      fetchData2() {
        this.pageFrom.status = 3
        QueryTextList(this.pageFrom).then((res) => {
          if (+res.code === 0) {
            // console.log(res.data.list)
            this.list = res.data.list
            this.pageFrom = {
              pageNo: res.data.page.pageNo,
              pageSize: res.data.page.pageSize,
              total: res.data.page.totalNum,
            }
          }
        })
      },
      // 跟换图文列表
      updateTextItem(val) {
        this.isUpdate = true
        this.updateItem = Object.assign({}, val.item)
        this.getTextList(val)
      },
    },
  }
</script>

<style lang="scss">
  * {
    box-sizing: border-box;
  }
  .find {
    width: 400px;
    padding: 10px;
    border: 1px solid #b2afaf;
    border-radius: 4px;
    .videoBox {
      padding: 24px 10px;
      .videoBoxHead {
        display: flex;
        justify-content: space-between;
        span {
          &:first-child {
          }
        }
      }
      .videoBoxContent {
        display: grid;
        grid-template-rows: 150px 150px;
        grid-template-columns: 30% 30% 30%;
        grid-row-gap: 24px;
        grid-column-gap: 5%;
        padding-top: 20px;
        > div {
          background: #d7d3d3;
          border-radius: 4px;
          .itemSelect {
            position: relative;
            width: 100%;
            height: 100%;
            span {
              padding-top: 5px;
              padding-left: 5px;
              cursor: pointer;
            }
            i {
              position: absolute;
              top: 50%;
              left: 50%;
              font-size: 36px;
              font-weight: bold;
              cursor: pointer;
              transform: translate(-50%, -50%);
            }
          }
        }
      }
    }
    .audioBox {
      padding: 0 10px;
      .videoBoxHead {
        display: flex;
        justify-content: space-between;
        span {
          &:first-child {
          }
        }
      }
      .videoBoxContent {
        display: grid;
        grid-template-rows: 100px 100px 100px;
        grid-template-columns: 100%;
        grid-row-gap: 10px;
        grid-column-gap: 5%;
        padding-top: 20px;
        > div {
          background: #d7d3d3;
          border-radius: 4px;
          .itemSelect {
            position: relative;
            width: 100%;
            height: 100%;
            span {
              padding-top: 5px;
              padding-left: 5px;
              cursor: pointer;
            }
            i {
              position: absolute;
              top: 50%;
              left: 50%;
              font-size: 36px;
              font-weight: bold;
              cursor: pointer;
              transform: translate(-50%, -50%);
            }
          }
          .itemsShow {
            .btnBox {
              top: auto;
              right: 30px;
              bottom: 0;
              z-index: 2;
              width: 50px;
            }
            img {
              position: absolute;
              top: 5px;
              left: 5px;
              width: 90px;
              height: 90px;
            }
            .nameBox {
              position: absolute;
              top: 10px;
              left: 110px;
              width: calc(100% - 120px);
            }
          }
        }
      }
    }
    .textBox {
      padding: 0 10px;
      .videoBoxHead {
        display: flex;
        justify-content: space-between;
        span {
          &:first-child {
          }
        }
      }
      .videoBoxContent {
        display: grid;
        grid-template-rows: 100px 100px 100px 100px;
        grid-template-columns: 100%;
        grid-row-gap: 10px;
        grid-column-gap: 5%;
        padding-top: 20px;
        > div {
          background: #d7d3d3;
          border-radius: 4px;
          .itemSelect {
            position: relative;
            width: 100%;
            height: 100%;
            span {
              padding-top: 5px;
              padding-left: 5px;
              cursor: pointer;
            }
            i {
              position: absolute;
              top: 50%;
              left: 50%;
              font-size: 36px;
              font-weight: bold;
              cursor: pointer;
              transform: translate(-50%, -50%);
            }
          }
          .itemsShow {
            .btnBox {
              top: auto;
              right: 30px;
              bottom: 0;
              z-index: 2;
              width: 50px;
            }
            img {
              position: absolute;
              top: 5px;
              left: 5px;
              width: 90px;
              height: 90px;
            }
            .nameBox {
              position: absolute;
              top: 10px;
              left: 110px;
              width: calc(100% - 120px);
            }
          }
        }
      }
    }
    .itemBox {
      position: relative;
      .itemsShow {
        position: relative;
        width: 100%;
        height: 100%;
      }
      .btnBox {
        position: absolute;
        top: 0;
        display: flex;
        justify-content: space-between;
        width: 100%;
        span {
          font-size: 16px;
          color: red;
        }
      }
      .nameBox {
        position: absolute;
        bottom: -22px;
        width: 100%;
        overflow: hidden;
        font-size: 16px;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      img {
        width: 100%;
        height: 100%;
        object-fit: none;
      }
    }
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
            line-height: 32px;
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
