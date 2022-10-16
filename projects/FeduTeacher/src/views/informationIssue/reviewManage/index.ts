export const staticData = {
  topTypeList: [
    {
      label: "校园动态",
      value: 1,
    },
    {
      label: "食谱动态",
      value: 2,
    },
  ],
};

export interface ReviewItem {
  relatedId: string;
  comment: string;
  commentType: string;
  createTime: string;
  roleType: number;
  shareUrl: string;
  sysUserName: string;
  title: string | null;
  userPortait: string;
  uuid: string;
  [key: string]: any;
}
