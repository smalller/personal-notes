import {
  fn1,
  fn2
} from './demo'


test('方法fn1-100元', () => {
  expect(fn1(100)).toBe('至尊享受')
})

test('方法fn2-1000元', () => {
  expect(fn2(1000)).toBe('双人服务')
})