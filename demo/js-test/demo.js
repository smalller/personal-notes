function urlToObj(url) {
  if(!url) return {}
  const path = url.split('?')[0]
  const queryList = url.split('?')[1].replace(/=/g,':').split('&')

  let query = {}
  for(let key of queryList) {
    const queryKer = key.split(':')[0]
    const queryVal = key.split(':')[1]
    query[queryKer] = queryVal
  }

  return {
    path,
    query
  }
}

const url = 'https://www.douyin.com/abc?foo=1&bar=2';
const urlObj = urlToObj(url);
// console.log(urlObj);


function objToUrl(obj) {
  const {path,query} = obj

  let queryList = []
  for(let key in query) {
    queryList.push(`${key}=${query[key]}`)
  }

  const queryStr = queryList.join('&')
  return `${path}?${queryStr}`
}

urlObj.query.coo = '3'
const newUrl = objToUrl(urlObj);
console.log(newUrl);



function compareVersion(source, target) {
  const sourceV = source.split('.');
  const targetV = target.split('.');
  for (let i = 0; i < sourceV.length || i < targetV.length; i++) {
      let x = 0, y = 0;
      if (i < sourceV.length) {
          x = parseInt(sourceV[i]);
      }
      if (i < targetV.length) {
          y = parseInt(targetV[i])
      }
      if (x > y) return 1;
      if (x < y) return -1;
  }
}

// console.log(compareVersion('1.0.3', '1.0.5'));
// console.log(compareVersion('1.0.7', '1.0.5'));
// console.log(compareVersion('1.1.3', '1.0.5'));
