<template>
  <div class="home">
    <el-card class="box-card">
      <vab-cropper ref="vabCropper" @sendPhoto="getArticlePhoto" />
      <div class="step">
        <el-steps :active="active" finish-status="success" align-center>
          <el-step
            v-for="(item, index) in steps"
            :key="index"
            :title="item.name"
          ></el-step>
        </el-steps>
      </div>

      <el-button
        type="primary"
        style="float: right; margin-top: 20px; margin-right: 5%"
        @click="returnFix"
      >
        撤销更改
      </el-button>
      <div class="content">
        <div class="phone-header">
          <img
            style="width: 95%; height: 35px"
            src="../../assets/images/title.png"
          />
        </div>
        <div class="from">
          <el-form
            v-show="+active === 0"
            ref="ruleFrom"
            :model="ruleFrom"
            label-width="100px"
            style="margin-bottom: 30px; padding-top: 20px"
          >
            <el-row>
              <el-col :span="11">
                <el-form-item label="幼儿园名称">
                  <el-input
                    v-model="ruleFrom.schoolName"
                    type="text"
                    style="width: 200px"
                    placeholder="请输入"
                    maxlength="20"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11">
                <el-form-item label="一句话介绍">
                  <el-input
                    v-model="ruleFrom.schoolRemark"
                    type="text"
                    style="width: 200px"
                    placeholder="请输入学校介绍"
                    maxlength="50"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11">
                <el-form-item label="幼儿园位置">
                  <el-input
                    v-model="schoolName"
                    placeholder="请输入选择学校地址"
                    style="width: 200px"
                    class="input-with-select"
                  >
                    <el-button
                      slot="append"
                      icon="el-icon-search"
                      @click="mapNameChange"
                    ></el-button>
                  </el-input>
                </el-form-item>
              </el-col>
              <div style="width: 100%; height: 300px">
                <div v-loading="loading" class="map">
                  <div
                    id="myMap"
                    ref="allmap"
                    style="height: 300px; width: 100%"
                  ></div>
                  <div v-if="mapPointName" style="padding: 10px 0">
                    园所地址：{{ mapPointName }}
                  </div>
                </div>
              </div>
            </el-row>
          </el-form>
          <div
            v-if="+active === 1"
            style="margin-bottom: 30px; padding-top: 10px"
          >
            <span
              style="display: block; margin-bottom: 10px; margin-left: 15px"
            >
              幼儿园介绍:
            </span>
            <el-input
              v-model="ruleFrom.schoolDescribe"
              type="textarea"
              :rows="6"
              style="width: 290px; margin-left: 15px"
              placeholder="请输入内容"
              maxlength="200"
              show-word-limit
            ></el-input>
            <p
              style="
                width: 300px;
                text-align: center;
                color: #dddddd;
                display: block;
                margin-top: 5px;
              "
            >
              添加封面宣传图片（最多六张）
            </p>
            <div class="photo-list">
              <div v-for="(item, index) in ruleFrom.publicity" :key="index">
                <div
                  class="avatar-uploader"
                  @click="openCropper('photo', index)"
                >
                  <img v-if="item.imgUrl" :src="item.imgUrl" class="avatar" />
                  <i
                    v-if="!item.imgUrl"
                    class="el-icon-plus avatar-uploader-icon"
                  ></i>
                </div>
                <div class="el-delete">
                  <i
                    class="el-icon-delete"
                    @click="delPoster('photo', index)"
                  ></i>
                </div>
              </div>
            </div>
          </div>
          <div
            v-if="+active === 2"
            style="margin-bottom: 30px; padding-top: 0px; margin-left: 15px"
          >
            <div v-for="(item, index) in ruleFrom.teacherRemark" :key="index">
              <div style="display: flex">
                <div
                  class="teacher-uploader"
                  @click="openCropper('teacher', index)"
                >
                  <img v-if="item.imgUrl" :src="item.imgUrl" class="teacher" />
                  <i
                    v-if="!item.imgUrl"
                    class="el-icon-plus teacher-uploader-icon"
                  ></i>
                </div>
                <el-input
                  v-model="item.names"
                  placeholder="请输入教师姓名"
                  style="width: 200px; margin-top: 20px"
                  type="text"
                  class="input-with-select"
                  maxlength="20"
                />
                <div class="el-delete" style="margin-top: 25px">
                  <i
                    class="el-icon-delete"
                    @click="delPoster('teacher', index)"
                  ></i>
                </div>
              </div>
              <el-input
                v-model="item.workRemark"
                style="margin-top: 10px; width: 280px"
                type="textarea"
                :rows="6"
                placeholder="请输入教师介绍，100字以内"
                show-word-limit
                maxlength="100"
              ></el-input>
            </div>
            <el-button
              style="width: 200px; margin-left: 15%; margin-top: 10px"
              type="primary"
              icon="el-icon-plus"
              @click="addPoster('teacher')"
            >
              新增教职工风采
            </el-button>
          </div>
          <div
            v-if="+active === 3"
            style="margin-bottom: 30px; padding-top: 10px"
          >
            <div v-for="(item, index) in ruleFrom.parentComments" :key="index">
              <div style="display: flex; margin-bottom: 15px">
                <div
                  class="teacher-uploader"
                  @click="openCropper('group', index)"
                >
                  <img v-if="item.imgUrl" :src="item.imgUrl" class="teacher" />
                  <i
                    v-if="!item.imgUrl"
                    class="el-icon-plus teacher-uploader-icon"
                  ></i>
                </div>
                <el-input
                  v-model="item.workRemark"
                  type="textarea"
                  :rows="3"
                  placeholder="请输入家长评语，60字以内"
                  maxlength="60"
                  show-word-limit
                ></el-input>
                <div
                  class="el-delete"
                  style="margin-left: 10px; margin-top: 25px"
                >
                  <i
                    class="el-icon-delete"
                    @click="delPoster('group', index)"
                  ></i>
                </div>
              </div>
            </div>
            <el-button
              style="width: 200px; margin-left: 20%"
              type="primary"
              icon="el-icon-plus"
              @click="addPoster('group')"
            >
              新增家长评语
            </el-button>
          </div>
          <div
            v-if="+active === 4"
            style="margin-bottom: 30px; padding-top: 10px"
          >
            <div v-for="(item, index) in ruleFrom.stuWork" :key="index">
              <div style="display: flex; margin-bottom: 15px">
                <div
                  class="student-uploader"
                  @click="openCropper('children', index)"
                >
                  <img v-if="item.imgUrl" :src="item.imgUrl" class="student" />
                  <i
                    v-if="!item.imgUrl"
                    class="el-icon-plus student-uploader-icon"
                  ></i>
                </div>
                <div style="margin-left: 5px; margin-top: -25px">
                  <el-input
                    v-model="item.names"
                    placeholder="请输入作品作者"
                    style="width: 180px; margin-top: 25px"
                    class="input-with-select"
                    type="text"
                    maxlength="20"
                  />
                  <el-input
                    v-model="item.workRemark"
                    placeholder="请输入作品名称"
                    style="width: 180px; margin-top: 15px"
                    class="input-with-select"
                    type="text"
                    maxlength="20"
                  />
                </div>
                <div
                  class="el-delete"
                  style="margin-top: 5px; margin-left: 0px"
                >
                  <i
                    class="el-icon-delete"
                    @click="delPoster('children', index)"
                  ></i>
                </div>
              </div>
            </div>
            <el-button
              style="width: 200px; margin-left: 20%"
              type="primary"
              icon="el-icon-plus"
              @click="addPoster('children')"
            >
              新增幼儿作品
            </el-button>
          </div>
          <div
            v-if="+active === 5"
            style="margin-bottom: 30px; padding-top: 10px"
          >
            <el-form
              ref="ruleFrom"
              :model="ruleFrom"
              label-position="top"
              label-width="300px"
              style="margin-bottom: 10px; margin-top: 10px; margin-left: 10px"
            >
              <el-row>
                <el-col :span="16">
                  <el-form-item label="招生标题">
                    <el-input
                      v-model="ruleFrom.admissionsTitle"
                      style="width: 290px"
                      placeholder="20字以内"
                      type="text"
                      maxlength="20"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="11">
                  <el-form-item label="招生对象">
                    <el-input
                      v-model="ruleFrom.admissionsCrowd"
                      style="width: 290px"
                      placeholder="例：3-6岁幼儿（20字以内）"
                      type="text"
                      maxlength="20"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="11">
                  <el-form-item label="招生名额">
                    <el-input
                      v-model="ruleFrom.admissionsNum"
                      style="width: 290px"
                      placeholder="例：大班60人 中班 50人 （20字以内）"
                      type="text"
                      maxlength="20"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="11">
                  <el-form-item label="招生电话">
                    <el-input
                      v-model="ruleFrom.admissionsTel"
                      style="width: 290px"
                      placeholder="请输入招生电话"
                      maxlength="11"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="16">
                  <el-form-item label="报名要求和相关注意事项">
                    <el-input
                      v-model="ruleFrom.admissionsPrecautions"
                      class="school-tips"
                      type="textarea"
                      placeholder="请输入招生时间，报名流程，注意事项，收费标准等"
                      maxlength="200"
                      show-word-limit
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </div>
        <div style="padding-top: 10px; border-top: 1px solid #eeeeee">
          <el-button
            style="float: left; margin-left: 10px"
            type="primary"
            :disabled="active === 0"
            @click="active--"
          >
            返回上一步
          </el-button>
          <el-button
            v-if="active > 1 && +active <= 4"
            style="margin-left: 40px"
            @click="active++"
          >
            跳过
          </el-button>
          <el-button
            v-if="+active <= 4"
            style="float: right; margin-right: 10px"
            type="primary"
            @click="save('draft')"
          >
            下一步
          </el-button>
          <el-button
            v-if="+active === 5"
            style="float: right; margin-right: 10px"
            type="success"
            @click="save"
          >
            保存
          </el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
  import VabCropper from '@/extra/VabCropper'
  import { GetFile, SendEnrollment, GetEnrollment } from '../../api/commonArea'
  var map = null
  export default {
    components: { VabCropper },
    data() {
      return {
        active: 0,
        ruleFrom: {
          admissionsCrowd: '',
          admissionsNum: '',
          admissionsPrecautions: '',
          admissionsTel: '',
          admissionsTitle: '',
          createUser: 'string',
          enableStatus: 0,
          parentComments: [
            {
              names: '',
              img: '',
              imgOrder: '',
              imgUrl: '',
              workRemark: '',
            },
          ],
          publicity: [
            { names: '', img: '', imgOrder: '', imgUrl: '', workRemark: '' },
            { names: '', img: '', imgOrder: '', imgUrl: '', workRemark: '' },
            { names: '', img: '', imgOrder: '', imgUrl: '', workRemark: '' },
            { names: '', img: '', imgOrder: '', imgUrl: '', workRemark: '' },
            { names: '', img: '', imgOrder: '', imgUrl: '', workRemark: '' },
            { names: '', img: '', imgOrder: '', imgUrl: '', workRemark: '' },
          ],
          schoolAreaName: '',
          schoolAreaNo: '',
          schoolDescribe: '',
          schoolGps: '',
          schoolId: '',
          schoolName: '',
          schoolRemark: '',
          stuWork: [
            { names: '', img: '', imgOrder: '', imgUrl: '', workRemark: '' },
          ],
          teacherRemark: [
            { names: '', img: '', imgOrder: '', imgUrl: '', workRemark: '' },
          ],
        },
        steps: [
          {
            value: 0,
            name: '首页',
          },
          {
            value: 1,
            name: '关于我们',
          },
          {
            value: 2,
            name: '教师风采',
          },
          {
            value: 3,
            name: '家长评语',
          },
          {
            value: 4,
            name: '幼儿作品',
          },
          {
            value: 5,
            name: '招生简章',
          },
        ],
        dialogMap: false,
        mapName: '',
        mapPointName: '',
        loading: false,
        mapGetshow: true,
        dialogVisible: false,
        selectedType: '',
        selectedIndex: '',
        schoolName: '',
        geoc: null,
        mapInfo: null,
      }
    },
    mounted() {
      this.mapBuild()
      this.getSchoolInfo()
    },
    methods: {
      //撤销更改
      returnFix() {
        this.$baseConfirm('确认撤销更改', null, () => {
          this.getSchoolInfo()
        })
      },
      //搜索地图
      mapNameChange() {
        let local = this.searchMap()
        local.search(this.schoolName)
      },
      searchMap() {
        let that = this,
          point,
          marker = null
        let local = new BMap.LocalSearch(map, {
          renderOptions: { map: map },
          onSearchComplete: (res) => {
            if (local.getResults() != undefined) {
              that.geoc = new BMap.Geocoder()
              map.clearOverlays() //清除地图上所有覆盖物
              if (local.getResults().getPoi(0)) {
                that.mapPointName = local.getResults().getPoi(0).address
                that.ruleFrom.schoolAreaName = local
                  .getResults()
                  .getPoi(0).address
                that.ruleFrom.schoolGps =
                  local.getResults().getPoi(0).point.lat +
                  ',' +
                  local.getResults().getPoi(0).point.lng
                point = local.getResults().getPoi(0).point //获取第一个智能搜索的结果
                map.centerAndZoom(point, 18)
                marker = new BMap.Marker(point) // 创建标注
                map.addOverlay(marker) // 将标注添加到地图中
                marker.enableDragging() // 可拖拽
                that.geoc.getLocation(point, function (rs) {
                  var addComp = rs.addressComponents
                })
              } else {
                this.$message.warning(
                  '未匹配到地点!可拖动地图上的红色图标到精确位置'
                )
              }
            } else {
              this.message.warning(
                '未匹配到地点!可拖动地图上的红色图标到精确位置'
              )
            }
          },
        })
        return local
      },
      //地图显示
      mapBuild() {
        let that = this
        that.geoc = new BMap.Geocoder()
        this.dialogMap = !this.dialogMap
        setTimeout(function () {
          if (that.mapGetshow) {
            that.mapInfo = new BMap.Map('myMap')
            map = that.mapInfo
            let point = ''
            if (that.ruleFrom.schoolGps) {
              let gps = that.ruleFrom.schoolGps.split(',')
              point = new BMap.Point(gps[1], gps[0])
              let marker = new BMap.Marker(point) // 创建标注
              map.addOverlay(marker)
              map.centerAndZoom(point, 18)
              map.enableScrollWheelZoom()
            } else {
              map.setCurrentCity('成都')
              point = new BMap.Point(104.072458, 30.578248)
              map.centerAndZoom(point, 12)
              map.enableScrollWheelZoom()
            }

            //鼠标点击
            map.addEventListener('click', function (e) {
              var pt = e.point
              var marker = new BMap.Marker(pt) // 创建标注
              map.clearOverlays()
              map.addOverlay(marker)
              that.geoc.getLocation(pt, function (rs) {
                var addComp = rs.addressComponents
                that.mapPointName =
                  addComp.province +
                  addComp.city +
                  addComp.district +
                  addComp.street +
                  addComp.streetNumber
                that.ruleFrom.schoolAreaName = rs.address
                that.ruleFrom.schoolGps = rs.point.lat + ',' + rs.point.lng
              })
            })
          }
        }, 1000)
      },
      //增加列表信息 教师/家长/学生
      addPoster(type) {
        let data = {
          names: '',
          img: '',
          imgOrder: '',
          imgUrl: '',
          workRemark: '',
        }
        switch (type) {
          case 'teacher':
            if (this.ruleFrom.teacherRemark.length >= 50) {
              this.$message.warning('已超出最大数量')
            } else {
              this.ruleFrom.teacherRemark.push(data)
            }
            break
          case 'group':
            if (this.ruleFrom.parentComments.length >= 50) {
              this.$message.warning('已超出最大数量')
            } else {
              this.ruleFrom.parentComments.push(data)
            }
            break
          case 'children':
            if (this.ruleFrom.stuWork.length >= 50) {
              this.$message.warning('已超出最大数量')
            } else {
              this.ruleFrom.stuWork.push(data)
            }
            break
        }
      },
      delPoster(type, index) {
        switch (type) {
          case 'photo':
            this.ruleFrom.publicity[index].img = ''
            this.ruleFrom.publicity[index].imgUrl = ''
            break
          case 'teacher':
            if (this.ruleFrom.teacherRemark.length === 1) {
              this.$message.warning('已达到最小数量')
            } else {
              this.ruleFrom.teacherRemark.splice(index, 1)
              this.$message.success('删除成功')
            }
            break
          case 'group':
            if (this.ruleFrom.parentComments.length === 1) {
              this.$message.warning('已达到最小数量')
            } else {
              this.ruleFrom.parentComments.splice(index, 1)
              this.$message.success('删除成功')
            }
            break
          case 'children':
            if (this.ruleFrom.stuWork.length === 1) {
              this.$message.warning('已达到最小数量')
            } else {
              this.ruleFrom.stuWork.splice(index, 1)
              this.$message.success('删除成功')
            }
            break
        }
      },
      //调用截图工具
      openCropper(type, index) {
        this.selectedType = ''
        this.selectedIndex = ''
        if (type) {
          this.selectedType = type
          this.selectedIndex = index
          this.$refs['vabCropper'].dialogVisible = true
        }
      },
      async getArticlePhoto(data) {
        if (data) {
          this.getPicture(data)
        }
      },
      getPicture(data) {
        if (data) {
          GetFile(data).then((res) => {
            if (+res.code === 0) {
              switch (this.selectedType) {
                case 'photo':
                  this.ruleFrom.publicity[+this.selectedIndex].imgUrl = res.data
                  this.ruleFrom.publicity[+this.selectedIndex].img = data
                  break
                case 'teacher':
                  this.ruleFrom.teacherRemark[+this.selectedIndex].img = data
                  this.ruleFrom.teacherRemark[
                    +this.selectedIndex
                  ].imgOrder = this.selectedIndex
                  this.ruleFrom.teacherRemark[+this.selectedIndex].imgUrl =
                    res.data
                  break
                case 'group':
                  this.ruleFrom.parentComments[+this.selectedIndex].img = data
                  this.ruleFrom.teacherRemark[
                    +this.selectedIndex
                  ].imgOrder = this.selectedIndex
                  this.ruleFrom.parentComments[+this.selectedIndex].imgUrl =
                    res.data
                  break
                case 'children':
                  this.ruleFrom.stuWork[+this.selectedIndex].img = data
                  this.ruleFrom.teacherRemark[
                    +this.selectedIndex
                  ].imgOrder = this.selectedIndex
                  this.ruleFrom.stuWork[+this.selectedIndex].imgUrl = res.data
                  break
              }
            }
          })
        }
      },
      save(type) {
        if (this.ruleFrom) {
          this.ruleFrom.schoolId = sessionStorage.getItem('zdyjb_schoolId')
          if (type == 'draft') {
            this.ruleFrom.enableStatus = 0
            SendEnrollment(this.ruleFrom).then((res) => {
              if (+res.code === 0) {
                this.active++
              }
            })
          } else {
            this.ruleFrom.enableStatus = 1
            SendEnrollment(this.ruleFrom).then((res) => {
              if (+res.code === 0) {
                this.$message.success('保存成功!')
              }
            })
          }
        }
      },
      getSchoolInfo() {
        let schoolId = sessionStorage.getItem('zdyjb_schoolId')
        if (schoolId) {
          GetEnrollment(schoolId).then((res) => {
            if (+res.code === 0 && res.data) {
              this.active = 0
              this.ruleFrom = res.data
              this.schoolName = res.data.schoolName
              this.mapPointName = res.data.schoolAreaName
            }
          })
        }
      },
    },
  }
</script>
<style lang="scss">
  .el-textarea__inner {
    height: 120px !important;
  }
</style>
<style lang="scss" scoped>
  .home {
    width: 900px;
    height: 775px;
    margin: auto;
    margin-top: 10px;
    touch-action: none;
  }
  .step {
    .el-steps {
      width: 80%;
      margin: auto;
    }
  }
  .content {
    background: url('../../assets/images/phone.png');
    background-size: cover;
    width: 40%;
    padding: 10px;
    margin: auto;
    min-height: 720px;
    margin-top: 10px;
  }
  .from {
    border-top: 1px solid #eeeeee;
    height: 550px;
    overflow-y: scroll;
    margin-top: 10px;

    .school-tips {
      width: 290px;
    }
  }
  .map {
    width: 95%;
    margin-left: 10px;
    height: 200px;
  }
  .addHospital {
    width: 100%;
    height: 100%;
    .map {
      padding: 10px;

      .map-btn {
        padding: 10px 20px;
        margin: auto;
        text-align: right;
        button {
          padding: 12px 30px;
        }
      }
    }
  }
  .photo-list {
    display: flex;
    flex-wrap: wrap;
  }
  .avatar-uploader {
    margin-top: 10px;
    margin-left: 20px;
  }
  .avatar-uploader :hover {
    cursor: pointer;
  }
  .avatar-uploader .el-upload {
    border: 1px;
    border-radius: 20px;
    cursor: pointer;
    width: 80px;
    height: 80px;
    border: 1px solid red;
    position: relative;
  }
  .avatar-uploader .el-upload:hover {
    border-color: lightgreen;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: lightgreen;
    width: 80px;
    height: 80px;
    border-radius: 10px;
    padding: 22px 0px 0 22px;
    border-style: dashed;
  }
  .avatar {
    width: 80px;
    height: 80px;
    border-radius: 10px;
  }

  .teacher-uploader {
    margin-top: 10px;
    margin-right: 10px;
    margin-left: 5px;
  }
  .teacher-uploader :hover {
    cursor: pointer;
  }
  .teacher-uploader .el-upload {
    border: 1px;
    border-radius: 50%;
    cursor: pointer;
    width: 80px;
    height: 80px;
    border: 1px solid red;
    position: relative;
  }
  .teacher-uploader .el-upload:hover {
    border-color: lightgreen;
  }
  .teacher {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: 1px solid;
  }
  .teacher-uploader-icon {
    font-size: 18px;
    color: lightblue;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    padding: 15px 0 0 15px;
    border: 1px solid;
    border-style: dashed;
  }
  .student-uploader {
    margin-left: 10px;
  }
  .student-uploader :hover {
    cursor: pointer;
  }
  .student-uploader .el-upload {
    border: 1px;
    border-radius: 5px;
    cursor: pointer;
    width: 90px;
    height: 80px;
    border: 1px solid red;
    position: relative;
  }
  .student-uploader .el-upload:hover {
    border-color: lightgreen;
  }
  .student-uploader-icon {
    font-size: 18px;
    color: lightblue;
    width: 90px;
    height: 80px;
    border-radius: 5px;
    padding: 30px 0 0 35px;
    border: 1px solid;
    border-style: dashed;
  }
  .student {
    width: 90px;
    height: 80px;
    border-radius: 5px;
    border: 1px solid;
  }
  .el-delete {
    margin-top: 5px;
    text-align: center;
    margin-left: 20px;
  }
  .el-delete :hover {
    cursor: pointer;
    color: #f56c6c;
    margin-top: 2px;
  }
</style>
