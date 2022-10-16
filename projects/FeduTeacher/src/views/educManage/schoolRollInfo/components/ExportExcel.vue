<template>
  <div
    class="upload-box"
    @mouseenter="isShowList = true"
    @mouseleave="isShowList = false"
  >
    <span class="choose-item">
      <ui-icon icon="icon-a-31"></ui-icon>
      导出学籍
    </span>
    <div v-show="isShowList" class="export-list">
      <p @click="handleUpload(1)">导出Excel格式</p>
      <p @click="handleUpload(2)">导出Word格式</p>
    </div>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, PropType, ref } from "vue";
import { download, downloadZipGet, batchDownloadZipPost } from "@/base/common";
import qs from "qs";
import Message from "@/themes/message";
import { InfantTableList } from "../index";

export default defineComponent({
  props: {
    uploadProps: {
      type: Object,
      required: true,
    },
    tableData: {
      type: Array as PropType<InfantTableList[]>,
      required: true,
    },
    checkRowInfo: {
      type: Array as PropType<InfantTableList[]>,
    },
  },
  setup(props) {
    const isShowList = ref(false);
    const tableData = computed(() => props.tableData);
    const checkRowInfo = computed(
      () => props.checkRowInfo as InfantTableList[]
    );
    const uploadProps = computed(() => props.uploadProps);

    // 导出
    function handleExport(index: number) {
      const { clazzId, stuStatus, startTime, endTime, name, setSchoolRoll } =
        uploadProps.value;

      const str = qs.stringify({
        clazzId,
        stuStatus,
        startTime,
        endTime,
        name,
        setSchoolRoll,
        schoolId: sessionStorage.getItem("schoolId"),
      });

      if (tableData.value.length > 0) {
        if (index === 1) {
          // 导出excel格式
          download(
            process.env.VUE_APP_BASE_API +
              `/schools/api/schoolRoll/exportExcel?${str}`,
            "幼儿学籍信息"
          );
        } else {
          if (checkRowInfo.value?.length > 0) {
            const ids: any = checkRowInfo.value
              .filter((item) => {
                if (item.schoolRollId) {
                  return item.schoolRollId;
                }
              })
              .map((item) => item.schoolRollId);
            if (ids.length > 0) {
              // 批量导word
              batchDownloadZipPost(
                process.env.VUE_APP_BASE_API +
                  `/schools/api/schoolRoll/batchDownZipById`,
                "幼儿学籍信息",
                ids
              );
            } else {
              Message.warning("您所勾选的学生中暂无学籍可导出");
            }
          } else {
            // 导出word格式
            downloadZipGet(
              process.env.VUE_APP_BASE_API +
                `/schools/api/schoolRoll/batchDownZip?${str}`,
              "幼儿学籍信息"
            );
          }
        }
      } else {
        Message.warning("暂无数据可导出");
      }
    }

    function handleUpload(index: number) {
      handleExport(index);
      isShowList.value = false;
    }

    return {
      isShowList,
      handleUpload,
    };
  },
});
</script>
<style lang="less" scoped>
.body-text-box {
  font-size: 14px;
  color: #f56060;
  margin: 20px 0 40px 0;
}

.upload-box {
  position: relative;
  height: 100%;
  display: flex;
  align-items: center;

  .choose-item {
    font-size: 14px;
    color: #222;
  }

  .export-list {
    display: flex;
    width: 121px;
    height: 80px;
    background: #ffffff;
    box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.2);
    border-radius: 3px;
    flex-direction: column;
    justify-content: center;
    position: absolute;
    top: 32px;
    left: -14px;
    z-index: 999;

    &::before {
      display: block;
      content: "";
      width: 0;
      position: absolute;
      left: 50%;
      top: -18px;
      margin-left: -10px;
      border: 10px solid transparent;
      border-bottom: 10px solid #fff;
    }

    > p {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 34px;
      color: #222;
      font-size: 14px;
      cursor: pointer;

      &:hover {
        background: #f0f0f0;
      }
    }
  }
}
</style>
