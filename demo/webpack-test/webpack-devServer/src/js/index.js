async function request() {
  const res = await fetch('/api/blade-system/store/list');
  console.log(res)
}
request()