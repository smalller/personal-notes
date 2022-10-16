const filter = {
  liveStatus(oldVal) {
    let newVal = ''
    switch (oldVal) {
      case 1:
        newVal = '待处理'
        break
      case 2:
        newVal = '待上线'
        break
      case 3:
        newVal = '已上线'
        break
      case 4:
        newVal = '已下线'
        break
    }
    return newVal
  },
}

export default filter
