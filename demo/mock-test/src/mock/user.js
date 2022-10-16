export function getUserInfo() {
  const josn = {
    code: 200,
    success: true,
    msg: '操作成功'
  }

  josn.data = [{
      name: 'small',
      age: 28,
      sex: 'male'
    },
    {
      name: 'lili',
      age: 24,
      sex: 'female'
    },
    {
      name: 'mike',
      age: 22,
      sex: 'undefined'
    }
  ];

  return josn
}