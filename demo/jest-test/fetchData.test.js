import {
  fetchData1,
  fetchData2,
  fetchData3
} from './fetchData.js'


describe('测试用例总分组', () => {
  beforeAll(() => {
    console.log('在所有测试用例之前执行');
  })


  beforeEach(() => {
    console.log('在每一个测试用例之前都会执行');
  })


  describe('测试用例分组1', () => {
    //测试走then
    test('fetchData1 方法测试', () => {
      return fetchData1().then(res => {
        expect(res.data).toEqual({
          "code": 240,
          "msg": "缺少key参数"
        })
      })
    })


    //测试走catch
    test('fetchData2 方法测试', () => {
      expect.assertions(1) //断言，意为必须执行一次expect（如果走catch就要写这一步）
      return fetchData2().catch(err => {
        console.log(err.toString())
        //匹配错误信息
        expect(err.toString().indexOf('ENOTFOUND') !== -1).toBe(true)
      })
    })
  })


  describe('测试用例分组2', () => {
    //测试走then，并且使用async方式
    test('fetchData3 方法测试', async () => {
      const res = await fetchData3();
      expect(res.data).toEqual({
        "code": 240,
        "msg": "缺少key参数"
      })
    })
  })


  afterEach(() => {
    console.log('在每一个测试用例之后都会执行');
  })


  afterAll(() => {
    console.log('在所有测试用例之后执行');
  })
})