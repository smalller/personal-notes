<template>
  <div class="content-box">
    <div class="list-box">
      <!-- <span class="no-data" v-if="schoolRollInfo === null">暂无学籍信息</span> -->
      <ul>
        <li class="li-box">
          <div class="user-box">
            <div class="shu"></div>
            <div class="parent-relation">基本信息</div>
          </div>
          <div class="botom-box">
            <div class="school-roll-img-box">
              <img
                :src="
                  schoolRollInfo?.headerImg ||
                  require('@/assets/infant-avatar.png')
                "
                alt=""
              />
            </div>
            <!-- <ul class="botom-box-li school-roll">
              <li>姓名：{{ schoolRollInfo.studentName || "-" }}</li>
              <li>身份证件类型：{{ schoolRollInfo.stuCertType || "-" }}</li>
              <li>姓名拼音：{{ schoolRollInfo.pinyin || "-" }}</li>
              <li>证件号码：{{ schoolRollInfo.stuCertNo || "-" }}</li>
              <li>性别：{{ schoolRollInfo.stuSex || "-" }}</li>
              <li>班级：{{ schoolRollInfo.clazzName || "-" }}</li>
              <li>
                出生日期：{{ schoolRollInfo.birthTime || "-" }}
                <span
                  v-if="isOverSeven(schoolRollInfo.birthTime)"
                  class="over-seven"
                  >超过7岁</span
                >
              </li>
              <li>入园日期：{{ schoolRollInfo.admissionTime || "-" }}</li>
              <li>血型：{{ schoolRollInfo.bloodType || "-" }}</li>
            </ul> -->
            <ul class="botom-box-li school-roll">
              <li>
                姓名：{{ schoolRollInfo?.studentName || INFANT_INFO?.name }}
              </li>
              <li>身份证件类型：{{ schoolRollInfo?.stuCertType || "-" }}</li>
              <li>姓名拼音：{{ schoolRollInfo?.pinyin || "-" }}</li>
              <li>证件号码：{{ schoolRollInfo?.stuCertNo || "-" }}</li>
              <li>
                性别：{{
                  schoolRollInfo?.stuSex || INFANT_INFO?.sex === 1 ? "男" : "女"
                }}
              </li>
              <li>
                班级：{{ schoolRollInfo?.clazzName || INFANT_INFO?.clazzName }}
              </li>
              <li>
                出生日期：{{
                  schoolRollInfo?.birthTime || INFANT_INFO?.birthTime
                }}
                <span
                  v-if="
                    isOverSeven(
                      schoolRollInfo?.birthTime || INFANT_INFO?.birthTime
                    )
                  "
                  class="over-seven"
                  >超过7岁</span
                >
              </li>
              <li>
                入园日期：{{
                  schoolRollInfo?.admissionTime || INFANT_INFO?.createTime
                    ? dayjs(INFANT_INFO?.createTime).format("YYYY-MM-DD")
                    : ""
                }}
              </li>
              <li>血型：{{ schoolRollInfo?.bloodType || "-" }}</li>
            </ul>
          </div>
        </li>
        <li class="li-box" v-if="schoolRollInfo?.huKouInfoPos">
          <div class="user-box">
            <div class="shu"></div>
            <div class="parent-relation">户籍信息</div>
          </div>
          <div class="guardian-box">
            <ul>
              <li>
                国籍：{{ schoolRollInfo.huKouInfoPos.nationality || "-" }}
              </li>
              <li>
                户口性质：{{ schoolRollInfo.huKouInfoPos.huKouNature || "-" }}
              </li>
              <li>民族：{{ schoolRollInfo.huKouInfoPos.nation || "-" }}</li>
              <li>
                非农业户口类型：{{
                  schoolRollInfo.huKouInfoPos.huKouType || "-"
                }}
              </li>
              <li>
                港澳台侨外：{{ schoolRollInfo.huKouInfoPos.overSeas || "-" }}
              </li>
              <li>
                户口所在地：{{
                  schoolRollInfo.huKouInfoPos.huKouLocation || "-"
                }}
              </li>
              <li>
                出生所在地：{{ schoolRollInfo.huKouInfoPos.birthPlace || "-" }}
              </li>
              <li>
                现住址：{{ schoolRollInfo.huKouInfoPos.actualAddress || "-" }}
              </li>
              <li>
                籍贯：{{ schoolRollInfo.huKouInfoPos.nativePlace || "-" }}
              </li>
              <li>
                现详细住址：{{
                  schoolRollInfo.huKouInfoPos.actualDetailAddress || "-"
                }}
              </li>
            </ul>
          </div>
        </li>
        <li class="li-box" v-if="schoolRollInfo?.familyInfoPos">
          <div class="user-box">
            <div class="shu"></div>
            <div class="parent-relation">家庭信息</div>
          </div>
          <div class="guardian-box">
            <ul>
              <li>
                就读方式：{{ schoolRollInfo.familyInfoPos.studyMode || "-" }}
              </li>
              <li>
                健康状况：{{ schoolRollInfo.familyInfoPos.healthStatus || "-" }}
              </li>
              <li>
                是否独生子女：{{
                  schoolRollInfo.familyInfoPos.isOnlyChild || "-"
                }}
              </li>
              <li>
                是否残疾幼儿：{{
                  schoolRollInfo.familyInfoPos.isDisabledChild || "-"
                }}
              </li>
              <li>
                是否留守儿童：{{
                  schoolRollInfo.familyInfoPos.isLeftBehindChild || "-"
                }}
              </li>
              <li>
                残疾幼儿类别：{{
                  schoolRollInfo.familyInfoPos.disabilityLevel || "-"
                }}
              </li>
              <li>
                是否进城务工人员子女：{{
                  schoolRollInfo.familyInfoPos.isPeasantWorker || "-"
                }}
              </li>
              <li>
                是否孤儿：{{ schoolRollInfo.familyInfoPos.isOrphan || "-" }}
              </li>
            </ul>
          </div>
        </li>
        <li class="li-box" v-if="schoolRollInfo?.stuGuardian">
          <div class="user-box">
            <div class="shu"></div>
            <div class="parent-relation">第一监护人</div>
          </div>
          <div class="guardian-box">
            <ul>
              <li>姓名：{{ schoolRollInfo.stuGuardian.name || "-" }}</li>
              <li>
                身份证类型：{{ schoolRollInfo.stuGuardian.cerType || "-" }}
              </li>
              <li>民族：{{ schoolRollInfo.stuGuardian.nation || "-" }}</li>
              <li>身份证号：{{ schoolRollInfo.stuGuardian.certNo || "-" }}</li>
              <li>
                幼儿关系：{{ schoolRollInfo.stuGuardian.familyRels || "-" }}
              </li>
              <li>
                工作单位：{{ schoolRollInfo.stuGuardian.workUnit || "-" }}
              </li>
              <li>电话：{{ schoolRollInfo.stuGuardian.mobile || "-" }}</li>
              <li>
                联系电话：{{ schoolRollInfo.stuGuardian.workPhone || "-" }}
              </li>
            </ul>
          </div>
        </li>
        <li class="li-box" v-if="schoolRollInfo?.stuGuardian2">
          <div class="user-box">
            <div class="shu"></div>
            <div class="parent-relation">第二监护人</div>
          </div>
          <div class="guardian-box">
            <ul>
              <li>姓名：{{ schoolRollInfo.stuGuardian2.name || "-" }}</li>
              <li>
                身份证类型：{{ schoolRollInfo.stuGuardian2.cerType || "-" }}
              </li>
              <li>民族：{{ schoolRollInfo.stuGuardian2.nation || "-" }}</li>
              <li>身份证号：{{ schoolRollInfo.stuGuardian2.certNo || "-" }}</li>
              <li>
                幼儿关系：{{ schoolRollInfo.stuGuardian2.familyRels || "-" }}
              </li>
              <li>
                工作单位：{{ schoolRollInfo.stuGuardian2.workUnit || "-" }}
              </li>
              <li>电话：{{ schoolRollInfo.stuGuardian2.mobile || "-" }}</li>
              <li>
                联系电话：{{ schoolRollInfo.stuGuardian2.workPhone || "-" }}
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, computed, ref } from "vue";
import { getSchoolRollDetail } from "@/api/infantManage";
import dayjs from "dayjs";

export default defineComponent({
  props: {
    studentId: {
      type: String,
      required: true,
    },
    infantInfo: {
      type: Object,
    },
  },
  setup(props) {
    const STUDENT_ID = computed(() => props.studentId);
    const INFANT_INFO = computed(() => props.infantInfo);
    const schoolRollInfo = ref(null) as any;

    // 获取学籍信息
    async function getgetSchoolRoll() {
      const { code, data } = await getSchoolRollDetail(STUDENT_ID.value);
      if (+code === 0) {
        schoolRollInfo.value = data;
      } else {
        schoolRollInfo.value = null;
      }
    }
    getgetSchoolRoll();

    // 判断年龄是否超过7岁
    function isOverSeven(birthTime: string) {
      const res = new Date().getFullYear() - new Date(birthTime).getFullYear();
      if (res > 7) {
        return true;
      } else {
        return false;
      }
    }

    return {
      schoolRollInfo,
      isOverSeven,
      INFANT_INFO,
      dayjs,
    };
  },
});
</script>
<style lang="less" scoped>
.content-box {
  margin-top: 15px;
}

.list-box {
  .no-data {
    font-size: 14px;
    color: #666666;
  }

  ul > li.li-box {
    border: 1px solid #e8e8e8;
    border-bottom: none;
    &:last-child {
      border-bottom: 1px solid #e8e8e8;
    }

    .user-box {
      height: 52px;
      padding: 15px 24px;
      box-sizing: border-box;
      background-color: #fafafa;
      border-bottom: 1px solid #e8e8e8;
      display: flex;
      align-items: center;
      .parent-relation {
        font-size: 16px;
        color: #222;
        > span {
          margin-right: 10px;
        }
      }
    }

    .guardian-box {
      padding: 18px 24px;
      color: #222;
      font-size: 14px;

      ul {
        display: flex;
        flex-wrap: wrap;

        > li {
          margin-bottom: 12px;
          width: 50%;
        }
      }
    }

    .botom-box {
      display: flex;
      padding: 18px 24px 20px 24px;
      background-color: #fff;
      font-size: 14px;
      color: #222;

      .school-roll-img-box {
        margin-right: 24px;
        > img {
          width: 106px;
          height: 148px;
          object-fit: cover;
          border: 1px solid rgba(0, 0, 0, 0.05);
        }
      }

      .img-box {
        margin-right: 30px;
        > img {
          width: 80px;
          height: 80px;
          border-radius: 50%;
        }
      }

      .botom-box-li {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;

        li {
          width: 50%;
        }

        li:nth-child(2n-1) {
          width: 252px;
        }

        li:nth-child(2n) {
          flex-grow: 1;
        }
      }

      .school-roll li {
        margin-bottom: 12px;

        .over-seven {
          width: 48px;
          height: 20px;
          border: 1px solid #ff9f3d;
          border-radius: 2px;
          font-size: 12px;
          color: #ff9f3d;
          padding: 2px;
        }
      }

      .parent-list li {
        margin-bottom: 8px;
      }
    }
  }
}
</style>
