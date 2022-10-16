<template>
  <div class="home">
    <el-card class="box-card">
      <!-- <vab-cropper ref="vabCropper" @sendPhoto="getArticlePhoto" /> -->
      <div class="step">
        <el-steps
          :active="active"
          finish-status="success"
          direction="vertical"
          align-center
        >
          <el-step
            v-for="(item, index) in steps"
            :key="index"
            :class="
              active === index
                ? 'active'
                : active > index
                ? 'isActive'
                : 'unActive'
            "
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
      <!-- <div class="content">
        <div class="phone-header">
          <img
            style="width: 95%; height: 35px"
            src="../../assets/images/title.png"
          />
        </div>
        <div class="from">
          <el-form
            v-show="+active === 0"
            :model="ruleFrom.data"
            label-width="100px"
            style="margin-bottom: 30px; padding-top: 20px"
          >
            <el-row>
              <el-col :span="11">
                <el-form-item label="幼儿园名称">
                  <el-input
                    v-model="ruleFrom.data.schoolName"
                    type="text"
                    style="width: 220px"
                    placeholder="请输入"
                    maxlength="20"
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
                    style="width: 220px"
                    class="input-with-select"
                  >
                    <template #append>
                      <el-button
                        icon="el-icon-search"
                        @click="mapNameChange"
                      ></el-button>
                    </template>
                  </el-input>
                </el-form-item>
              </el-col>
              <div style="width: 100%; height: 300px">
                <div class="map">
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
              v-model="ruleFrom.data.schoolDescribe"
              type="textarea"
              :rows="6"
              style="width: 320px; margin-left: 15px"
              placeholder="请输入内容"
              maxlength="200"
              show-word-limit
            ></el-input>
            <p
              style="
                width: 100%;
                text-align: center;
                color: #dddddd;
                display: block;
                margin-top: 5px;
              "
            >
              添加封面宣传图片（最多六张）
            </p>
            <div class="photo-list">
              <div
                v-for="(item, index) in ruleFrom.data.publicity"
                :key="index"
              >
                <div
                  class="avatar-uploader"
                  @click="openCropper('setImg', index)"
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
            <div
              v-for="(item, index) in ruleFrom.data.teacherRemark"
              :key="index"
            >
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
                style="margin-top: 10px; width: 320px"
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
            <div
              v-for="(item, index) in ruleFrom.data.parentComments"
              :key="index"
            >
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
            <div v-for="(item, index) in ruleFrom.data.stuWork" :key="index">
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
                    style="width: 200px; margin-top: 25px"
                    class="input-with-select"
                    type="text"
                    maxlength="20"
                  />
                  <el-input
                    v-model="item.workRemark"
                    placeholder="请输入作品名称"
                    style="width: 200px; margin-top: 15px"
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
              ref="ruleFrom.data"
              :model="ruleFrom.data"
              label-position="top"
              label-width="300px"
              style="margin-bottom: 10px; margin-top: 10px; margin-left: 20px"
            >
              <el-row>
                <el-col :span="16">
                  <el-form-item label="招生标题">
                    <el-input
                      v-model="ruleFrom.data.admissionsTitle"
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
                      v-model="ruleFrom.data.admissionsCrowd"
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
                      v-model="ruleFrom.data.admissionsNum"
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
                      v-model="ruleFrom.data.admissionsTel"
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
                      v-model="ruleFrom.data.admissionsPrecautions"
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
            style="margin-left: 30px"
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
      </div> -->
    </el-card>
  </div>
  <cms-upload ref="upload"></cms-upload>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, onMounted } from "vue";
import Message from "@/themes/message";
import { useStore } from "vuex";
declare const BMap: any;
import { GetEnrollment, SendEnrollment } from "@/api/common";
import { ruleFromDemo } from "./index";
import CmsUpload from "@/base/cmsUpload.vue";

export default defineComponent({
  components: { CmsUpload },
  setup() {
    const $store = useStore();
    const active = ref(2);
    const upload = ref(null);
    const ruleFrom = reactive({
      data: {
        admissionsCrowd: "",
        admissionsNum: "",
        admissionsPrecautions: "",
        admissionsTel: "",
        admissionsTitle: "",
        createUser: "string",
        enableStatus: 0,
        parentComments: [{}],
        publicity: [
          { names: "", img: "", imgOrder: "", imgUrl: "", workRemark: "" },
        ],
        schoolAreaName: "",
        schoolAreaNo: "",
        schoolDescribe: "",
        schoolGps: "",
        schoolId: "",
        schoolName: "",
        schoolRemark: "",
        stuWork: [{}],
        teacherRemark: [{}],
      } as ruleFromDemo,
    });
    const steps = reactive([
      {
        value: 0,
        name: "首页",
      },
      {
        value: 1,
        name: "关于我们",
      },
      {
        value: 2,
        name: "教师风采",
      },
      {
        value: 3,
        name: "家长评语",
      },
      {
        value: 4,
        name: "幼儿作品",
      },
      {
        value: 5,
        name: "招生简章",
      },
    ]);
    const dialogMap = ref(false);
    const mapPointName = ref("");
    const selectedType = ref("");
    const selectedIndex = ref("");
    const schoolName = ref("");
    const loading = ref(false);
    const geoc = ref(BMap);
    const mapGetshow = ref(true);
    const map = ref(BMap);

    //撤销更改
    const returnFix = () => {
      getSchoolInfo();
    };
    // 获取简章信息
    const getSchoolInfo = () => {
      let schoolId = $store.state.user.schoolId;
      if (schoolId) {
        GetEnrollment(schoolId).then((res) => {
          if (+res.code === 0 && res.data !== null) {
            // active.value = 0;
            ruleFrom.data = Object.assign({}, res.data);
            schoolName.value = res.data.schoolName;
            mapPointName.value = res.data.schoolAreaName;
          } else {
            for (let i = 0; i < 5; i++) {
              ruleFrom.data.publicity.push({
                names: "",
                img: "",
                imgOrder: "",
                imgUrl: "",
                workRemark: "",
              });
            }
          }
        });
      }
    };
    onMounted(() => {
      getSchoolInfo();
    });
    //搜索地图
    const mapNameChange = () => {
      let local = searchMap();
      local.search(schoolName.value);
    };
    const searchMap = () => {
      let point,
        marker = null;
      let local = new BMap.LocalSearch(map.value, {
        renderOptions: { map: map.value },
        onSearchComplete: () => {
          if (local.getResults() != undefined) {
            geoc.value = new BMap.Geocoder();
            map.value.clearOverlays(); //清除地图上所有覆盖物
            if (local.getResults().getPoi(0)) {
              mapPointName.value = local.getResults().getPoi(0).address;
              ruleFrom.data.schoolAreaName = local
                .getResults()
                .getPoi(0).address;
              ruleFrom.data.schoolGps =
                local.getResults().getPoi(0).point.lat +
                "," +
                local.getResults().getPoi(0).point.lng;
              point = local.getResults().getPoi(0).point; //获取第一个智能搜索的结果
              map.value.centerAndZoom(point, 18);
              marker = new BMap.Marker(point); // 创建标注
              map.value.addOverlay(marker); // 将标注添加到地图中
              marker.enableDragging(); // 可拖拽
              // geoc.value.getLocation(point, function () {
              // })
            } else {
              Message.warning("未匹配到地点!可拖动地图上的红色图标到精确位置");
            }
          } else {
            Message.warning("未匹配到地点!可拖动地图上的红色图标到精确位置");
          }
        },
      });
      return local;
    };
    onMounted(() => {
      mapBuild();
    });
    //地图显示
    const mapBuild = () => {
      geoc.value = new BMap.Geocoder();
      dialogMap.value = !dialogMap.value;
      setTimeout(() => {
        if (mapGetshow.value) {
          map.value = new BMap.Map("myMap");
          let point = "";
          if (ruleFrom.data.schoolGps) {
            let gps = ruleFrom.data.schoolGps.split(",");
            point = new BMap.Point(gps[1], gps[0]);
            let marker = new BMap.Marker(point); // 创建标注
            map.value.addOverlay(marker);
            map.value.centerAndZoom(point, 18);
            map.value.enableScrollWheelZoom();
          } else {
            map.value.setCurrentCity("成都");
            point = new BMap.Point(104.072458, 30.578248);
            map.value.centerAndZoom(point, 12);
            map.value.enableScrollWheelZoom();
          }
          //鼠标点击
          map.value.addEventListener("click", function (e: any) {
            var pt = e.point;
            var marker = new BMap.Marker(pt); // 创建标注
            map.value.clearOverlays();
            map.value.addOverlay(marker);
            geoc.value.getLocation(pt, function (rs: any) {
              var addComp = rs.addressComponents;
              mapPointName.value =
                addComp.province +
                addComp.city +
                addComp.district +
                addComp.street +
                addComp.streetNumber;
              ruleFrom.data.schoolAreaName = rs.address;
              ruleFrom.data.schoolGps = rs.point.lat + "," + rs.point.lng;
            });
          });
        }
      }, 1000);
    };

    //增加列表信息 教师/家长/学生
    const addPoster = (type: string) => {
      let data = {
        names: "",
        img: "",
        imgOrder: "",
        imgUrl: "",
        workRemark: "",
      };
      switch (type) {
        case "teacher":
          if (ruleFrom.data.teacherRemark.length >= 50) {
            Message.warning("已超出最大数量");
          } else {
            ruleFrom.data.teacherRemark.push(data);
          }
          break;
        case "group":
          if (ruleFrom.data.parentComments.length >= 50) {
            Message.warning("已超出最大数量");
          } else {
            ruleFrom.data.parentComments.push(data);
          }
          break;
        case "children":
          if (ruleFrom.data.stuWork.length >= 50) {
            Message.warning("已超出最大数量");
          } else {
            ruleFrom.data.stuWork.push(data);
          }
          break;
      }
    };
    const delPoster = (type: string, index: number) => {
      switch (type) {
        case "setImg":
          if (upload?.value) {
            (upload.value as any).upload("image/*").then((res: any) => {
              ruleFrom.data.publicity[index].img = res[0].data;
              ruleFrom.data.publicity[index].imgUrl = res[0].url;
            });
          }
          break;
        case "photo":
          ruleFrom.data.publicity[index].img = "";
          ruleFrom.data.publicity[index].imgUrl = "";

          break;
        case "teacher":
          // if (ruleFrom.data.teacherRemark.length === 1) {
          //   Message.warning("已达到最小数量");
          // } else {
          ruleFrom.data.teacherRemark.splice(index, 1);
          Message.success("删除成功");
          // }
          break;
        case "group":
          // if (ruleFrom.data.parentComments.length === 1) {
          //   Message.warning("已达到最小数量");
          // } else {
          ruleFrom.data.parentComments.splice(index, 1);
          Message.success("删除成功");
          // }
          break;
        case "children":
          // if (ruleFrom.data.stuWork.length === 1) {
          //   Message.warning("已达到最小数量");
          // } else {
          ruleFrom.data.stuWork.splice(index, 1);
          Message.success("删除成功");
          // }
          break;
      }
    };
    //调用截图工具
    const openCropper = (type: string, index: number) => {
      console.log(type, index);
      if (upload?.value) {
        (upload.value as any).upload("image/*").then((res: any) => {
          console.log(res);

          // ruleFrom.data.publicity[index].img = res[0].data;
          // ruleFrom.data.publicity[index].imgUrl = res[0].url;
          if (res.length) {
            switch (type) {
              case "setImg":
                ruleFrom.data.publicity[index].imgUrl = res[0].url;
                ruleFrom.data.publicity[index].img = res[0].data;
                console.log(ruleFrom.data);
                break;
              case "teacher":
                ruleFrom.data.teacherRemark[index].img = res[0].data;
                ruleFrom.data.teacherRemark[index].imgOrder = index;
                ruleFrom.data.teacherRemark[index].imgUrl = res[0].url;
                break;
              case "group":
                ruleFrom.data.parentComments[index].img = res[0].data;
                ruleFrom.data.parentComments[index].imgOrder = index;
                ruleFrom.data.parentComments[index].imgUrl = res[0].url;
                break;
              case "children":
                ruleFrom.data.stuWork[index].img = res[0].data;
                ruleFrom.data.stuWork[index].imgOrder = index;
                ruleFrom.data.stuWork[index].imgUrl = res[0].url;
                break;
            }
          }
        });
      }
    };
    // const getPicture = (data)=> {
    //   if (data) {
    //     GetFile(data).then((res) => {
    //       if (res.code == 0) {
    //         switch (selectedType.value) {
    //           case 'photo':
    //             ruleFrom.data.publicity[+selectedIndex.value].imgUrl = res.data
    //             ruleFrom.data.publicity[+selectedIndex.value].img = data
    //             break
    //           case 'teacher':
    //             ruleFrom.data.teacherRemark[+selectedIndex.value].img = data
    //             ruleFrom.data.teacherRemark[
    //               +selectedIndex.value
    //             ].imgOrder = selectedIndex.value
    //             ruleFrom.data.teacherRemark[+selectedIndex.value].imgUrl =
    //               res.data
    //             break
    //           case 'group':
    //             ruleFrom.data.parentComments[+selectedIndex.value].img = data
    //             ruleFrom.data.teacherRemark[
    //               +selectedIndex.value
    //             ].imgOrder = selectedIndex.value
    //             ruleFrom.data.parentComments[+selectedIndex.value].imgUrl =
    //               res.data
    //             break
    //           case 'children':
    //             ruleFrom.data.stuWork[+selectedIndex.value].img = data
    //             ruleFrom.data.teacherRemark[
    //               +selectedIndex.value
    //             ].imgOrder = selectedIndex.value
    //             ruleFrom.data.stuWork[+this.selectedIndex].imgUrl = res.data
    //             break
    //         }
    //       }
    //     })
    //   }
    // };
    //保存
    const save = (type: string) => {
      if (ruleFrom.data) {
        ruleFrom.data.schoolId = $store.state.user.schoolId;
        if (type == "draft") {
          ruleFrom.data.enableStatus = 0;
          SendEnrollment(ruleFrom.data).then((res) => {
            if (+res.code === 0) {
              active.value++;
            }
          });
        } else {
          ruleFrom.data.enableStatus = 1;
          SendEnrollment(ruleFrom.data).then((res) => {
            if (+res.code === 0) {
              Message.success("保存成功!");
            }
          });
        }
      }
    };

    return {
      steps,
      addPoster,
      delPoster,
      ruleFrom,
      active,
      mapPointName,
      selectedType,
      selectedIndex,
      schoolName,
      loading,
      upload,
      mapNameChange,
      save,
      returnFix,
      openCropper,
    };
  },
});
</script>
<style lang="less">
.el-textarea__inner {
  height: 120px !important;
}
&::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 6px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 8px;
  position: absolute;
  right: 0;
}
&::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  width: 6px;
  height: 90px;
  background-color: #bfbfbf;
  border-radius: 4px;
}
&::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  // -webkit-box-shadow: inset 0 0 5px rgba(0, 34, 68, 0.01);
  border-radius: 4px;
  background: rgba(0, 34, 68, 0);
}

.isActive {
  .el-step__head {
    color: #ffffff;
    .el-step__icon {
      background: #4fa8f9 !important;
      border-color: #4fa8f9;
    }
  }
}

.active {
  .el-step__head {
    color: #ffffff;
    .el-step__icon {
      background: #ff9900 !important;
      border-color: #ff9900;
    }
  }
}
.unActive {
  .el-step__head {
    color: #666666;
    .el-step__icon {
      background: #d8e0eb !important;
      border-color: #d8e0eb;
    }
  }
}
// .el-step__icon.is-text.isActive {
//   background: #f56c6c;
// }
// .el-step .is-vertical .unActive {
//   .el-step__head .is-success {
//   }
// }
// .el-step__icon.unActive {
//   background: #666666;
// }
</style>
<style lang="less" scoped>
.home {
  width: 900px;
  height: 850px;
  margin: auto;
  margin-top: 10px;
  touch-action: none;
}
.el-switch.is-checked {
  .el-switch__core {
    border-color: #ff9900 !important;
    background: #ff9900 !important;
  }
}
.step {
  height: 400px;
  .el-steps {
    width: 80%;
    margin: auto;
  }
}
.content {
  background: url("../../assets/images/phone.png");
  background-size: cover;
  width: 40%;
  padding: 10px;
  margin: auto;
  min-height: 740px;
  margin-top: 10px;
}
.from {
  border-top: 1px solid #eeeeee;
  height: 610px;
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
  margin-left: 15px;
}
.avatar-uploader {
  margin-top: 10px;
  margin-left: 10px;
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
  border-radius: 10px;
  padding: 30px 30px 30px 30px;
  border-style: dashed;
}
.avatar {
  width: 90px;
  height: 90px;
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
  border-radius: 50%;
  padding: 24px 24px 24px 24px;
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
  border-radius: 5px;
  padding: 30px 40px 30px 40px;
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
