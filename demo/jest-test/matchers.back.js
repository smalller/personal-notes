//toBe匹配器
test('toBe匹配器', () => {
  expect('001号').toBe('001号')
})


//toEqual匹配器
test('toEqual匹配器', () => {
  const a = {
    age: 28
  }
  expect(a).toEqual({
    age: 28
  })
})


//toNull匹配器
test('toBeNull匹配器', () => {
  const a = {
    age: null
  }
  expect(a.age).toBeNull()
})


//toBeUndefined匹配器
test('toBeUndefined匹配器', () => {
  const a = undefined
  expect(a).toBeUndefined()
})


//toBeDefined匹配器
test('toBeDefined匹配器', () => {
  const a = ''
  expect(a).toBeDefined()
})


//toBeTruthy匹配器
test('toBeTruthy匹配器', () => {
  const a = 10
  expect(a).toBeTruthy()
})


//toBeFalsy匹配器
test('toBeFalsy匹配器', () => {
  const a = 0
  expect(a).toBeFalsy()
})


//toBeGreaterThan匹配器
test('toBeGreaterThan匹配器', () => {
  const a = 10
  expect(a).toBeGreaterThan(9)
})


//toBeGreaterThanOrEqual匹配器
test('toBeGreaterThanOrEqual匹配器', () => {
  const a = 10
  expect(a).toBeGreaterThanOrEqual(10)
})


//toBeLessThan匹配器
test('toBeLessThan匹配器', () => {
  const a = 10
  expect(a).toBeLessThan(11)
})


//toBeLessThanOrEqual匹配器
test('toBeLessThanOrEqual匹配器', () => {
  const a = 10
  expect(a).toBeLessThanOrEqual(10)
})


//toBeCloseTo匹配器
test('toBeCloseTo匹配器', () => {
  const a = 0.1;
  const b = 0.2;
  expect(a + b).toBeCloseTo(0.3)
})


//toMatch匹配器
test('toMatch匹配器', () => {
  const a = '哈哈哈，嘻嘻嘻，哦哦哦';
  expect(a).toMatch('哈哈哈')
})



const throwNewErrorFunc = () => {
  // throw new Error('this is Error')
}

//toThrow匹配器
test('toThrow匹配器', () => {
  expect(throwNewErrorFunc).not.toThrow()
})