interface Response {
  code: number;
  success: boolean;
  msg: string;
  data: any;
  [key: string]: any;
}

export function getList(): Response {
  const response: Response = {
    code: 0,
    success: true,
    msg: "操作成功",
    data: {
      list: [
        {
          id: 1,
          avatar: "https://devops.aliyun.com/api/images/avatars/1.png",
          name: "张晓华",
          identity: "老师",
          content: "照片拍摄的很棒，宝宝太可爱了！照片拍摄的很棒，",
          reviewObj: "宝宝班级手工活动做的太好了！",
          time: "16小时前",
          isTeacher: true,
          replyReviewList: [
            {
              id: 1,
              avatar: "https://devops.aliyun.com/api/images/avatars/1.png",
              name: "张晓华",
              identity: "老师",
              content: "照片拍摄的很棒，宝宝太可爱了！照片拍摄的很棒，",
              reviewObj: "宝宝班级手工活动做的太好了！",
              time: "16小时前",
              isTeacher: true,
            },
            {
              id: 2,
              avatar: "https://devops.aliyun.com/api/images/avatars/1.png",
              name: "李晓梅",
              identity: "妈妈",
              content: "照片拍摄的很棒，宝宝太可爱了！照片拍摄的很棒，",
              reviewObj: "宝宝班级手工活动做的太好了！",
              time: "16小时前",
              isTeacher: false,
            },
            {
              id: 3,
              avatar: "https://devops.aliyun.com/api/images/avatars/1.png",
              name: "李华",
              identity: "爸爸",
              content: "照片拍摄的很棒，宝宝太可爱了！照片拍摄的很棒，",
              reviewObj: "宝宝班级手工活动做的太好了！",
              time: "16小时前",
              isTeacher: false,
            },
          ],
        },
        {
          id: 2,
          avatar: "https://devops.aliyun.com/api/images/avatars/1.png",
          name: "李晓明",
          identity: "爸爸",
          content:
            "1不错营养丰富，搭配合理，看上去就很好吃！不错营养丰富，搭配合理，看上去就很好吃！不错营养丰富，搭配合理，看上去就很好吃！不错营养丰富，搭配合理，看上去就很好吃！不错营养丰富，搭配合理，看上去就很好吃！不错营养丰富，搭配合理，看上去就很好吃！不错营养丰富，搭配合理，看上去就很好吃！不错营养丰富，搭配合理，看上去就很好吃！不错营养丰富，搭配合理，看上去就很，不错",
          time: "16小时前",
          reviewObj: "宝宝班级手工活动做的太好了！宝宝班级手工活动做的太好了！",
          isTeacher: false,
          replyReviewList: [],
        },
        {
          id: 3,
          avatar: "https://devops.aliyun.com/api/images/avatars/1.png",
          name: "李晓明",
          identity: "妈妈",
          content: "照片拍摄的很棒，宝宝太可爱了！照片拍摄的很棒，",
          reviewObj:
            "宝宝班级手工活动做的太好了！宝宝班级手工活动做的太好了！宝宝班级手工活动做的太好了！",
          time: "16小时前",
          isTeacher: false,
          replyReviewList: [
            {
              id: 1,
              avatar: "https://devops.aliyun.com/api/images/avatars/1.png",
              name: "张晓华",
              identity: "老师",
              content: "照片拍摄的很棒，宝宝太可爱了！照片拍摄的很棒，",
              reviewObj: "宝宝班级手工活动做的太好了！",
              time: "16小时前",
              isTeacher: true,
            },
            {
              id: 2,
              avatar: "https://devops.aliyun.com/api/images/avatars/1.png",
              name: "李晓梅",
              identity: "妈妈",
              content: "照片拍摄的很棒，宝宝太可爱了！照片拍摄的很棒，",
              reviewObj: "宝宝班级手工活动做的太好了！",
              time: "16小时前",
              isTeacher: false,
            },
          ],
        },
        {
          id: 4,
          avatar: "https://devops.aliyun.com/api/images/avatars/1.png",
          name: "李晓明",
          identity: "爸爸",
          content:
            "不错营养丰富，搭配合理，看上去就很好吃！不错营养丰富，搭配合理，看上去就很好吃！不错营养丰富，搭配合理，看上去就很好吃！不错营养丰富，搭配合理，看上去就很好吃！不错营养丰富，搭配合理，看上去就很好吃！不错营养丰富，搭配合理，看上去就很好吃！不错营养丰富，搭配合理，看上去就很好吃！不错营养丰富，搭配合理，看上去就很好吃！不错营养丰富，搭配合理，看上去就很，不错营养丰富，搭配合理，看上去就很好吃！不错营养丰富，搭配合理，看上去就很好吃！不错营养丰富，搭配合理，看上去就很好吃！不错营养丰富，搭配合理，看上去就很好吃！不错营养丰富，搭配合理，看上去就很好吃！不错营养丰富，搭配合理，看上去就很好吃！不错营养丰富，搭配合理，看上去就很好吃！不错营养丰富，搭配合理，看上去就很好吃！不错营养丰富，搭配合理，看上去就很，不错营养丰富，搭配合理，看上去就很好吃！不错营养丰富，搭配合理，看上去就很好吃！不错营养丰富，搭配合理，看上去就很好吃！不错营养丰富，搭配合理，看上去就很好吃！不错营养丰富，搭配合理，看上去就很好吃！不错营养丰富，搭配合理，看上去就很好吃！不错营养丰富，搭配合理，看上去就很好吃！不错营养丰富，搭配合理，看上去就很好吃！不错营养丰富，搭配合理，看上去就很，不错营养丰富，搭配合理，看上去就很好吃！不错营养丰富，搭配合理，看上去就很好吃！不错营养丰富，搭配合理，看上去就很好吃！不错营养丰富，搭配合理，看上去就很好吃！不错营养丰富，搭配合理，看上去就很好吃！不错营养丰富，搭配合理，看上去就很好吃！不错营养丰富，搭配合理，看上去就很好吃！不错营养丰富，搭配合理，看上去就很好吃！不错营养丰富，搭配合理，看上去就很，",
          time: "16小时前",
          reviewObj: "宝宝班级手工活动做的太好了！宝宝班级手工活动做的太好了！",
          isTeacher: false,
          replyReviewList: [
            {
              id: 1,
              avatar: "https://devops.aliyun.com/api/images/avatars/1.png",
              name: "张晓华",
              identity: "老师",
              content: "照片拍摄的很棒，宝宝太可爱了！照片拍摄的很棒，",
              reviewObj: "宝宝班级手工活动做的太好了！",
              time: "16小时前",
              isTeacher: true,
            },
            {
              id: 2,
              avatar: "https://devops.aliyun.com/api/images/avatars/1.png",
              name: "李晓梅",
              identity: "妈妈",
              content: "照片拍摄的很棒，宝宝太可爱了！照片拍摄的很棒，",
              reviewObj: "宝宝班级手工活动做的太好了！",
              time: "16小时前",
              isTeacher: false,
            },
            {
              id: 3,
              avatar: "https://devops.aliyun.com/api/images/avatars/1.png",
              name: "李华",
              identity: "爸爸",
              content: "照片拍摄的很棒，宝宝太可爱了！照片拍摄的很棒，",
              reviewObj: "宝宝班级手工活动做的太好了！",
              time: "16小时前",
              isTeacher: false,
            },
          ],
        },
      ],
      page: { pageNo: 1, pageSize: 20, totalPage: 1, totalNum: 5 },
    },
  };
  return response;
}

export function getDynamicGiveLikeList(): Response {
  const response: Response = {
    code: 0,
    success: true,
    msg: "操作成功",
    data: {
      list: [
        {
          id: 1,
          avatar: "https://devops.aliyun.com/api/images/avatars/1.png",
          name: "张晓华",
          identity: "老师",
          time: "16小时前",
          isTeacher: true,
        },
        {
          id: 1,
          avatar: "https://devops.aliyun.com/api/images/avatars/1.png",
          name: "李华",
          identity: "爸爸",
          time: "16小时前",
          isTeacher: false,
        },
        {
          id: 1,
          avatar: "https://devops.aliyun.com/api/images/avatars/1.png",
          name: "李华",
          identity: "爸爸",
          time: "16小时前",
          isTeacher: false,
        },
        {
          id: 1,
          avatar: "https://devops.aliyun.com/api/images/avatars/1.png",
          name: "李华",
          identity: "爸爸",
          isTeacher: false,
          time: "16小时前",
        },
        {
          id: 1,
          avatar: "https://devops.aliyun.com/api/images/avatars/1.png",
          name: "李华",
          identity: "爸爸",
          isTeacher: false,
          time: "16小时前",
        },
        {
          id: 1,
          avatar: "https://devops.aliyun.com/api/images/avatars/1.png",
          name: "李华",
          identity: "爸爸",
          isTeacher: false,
          time: "16小时前",
        },
      ],
      page: { pageNo: 1, pageSize: 20, totalPage: 1, totalNum: 5 },
    },
  };
  return response;
}
