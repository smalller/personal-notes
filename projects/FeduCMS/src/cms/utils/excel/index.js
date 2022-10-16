/**
 * excel导出函数
 * @param tableList 表格数组
 * @param tableHeader 表格头部数组
 * @param tableKeys 表格对应keys
 * @param name 导出的excel名称
 */
export function outExcel(tableList, tableHeader, name = '导出的excel') {
  if (!tableList || !tableHeader) throw new Error('args must no be empty')
  require.ensure([], () => {
    const {
      export_json_to_excel,
    } = require('@/cms/utils/excel/require/Export2Excel') //注意这个Export2Excel路径
    const keys = Object.keys(tableList[0])
    const data = formatJson(keys, tableList)
    export_json_to_excel(tableHeader, data, name) //最后一个是表名字
  })
}

function formatJson(filterVal, jsonData) {
  return jsonData.map((v) => filterVal.map((j) => v[j]))
}
