// import readXlsxFile from 'read-excel-file'
import {mapGetters,mapActions} from 'vuex'
export default {
  data() {
    return {
      worker: null
    }
  },
  computed: {
    ...mapGetters([])
  },
  methods: {
    ...mapActions(['setExcelData']),
    readExcel() {
      const data = require('./data.json')
      this.setExcelData(data)
      console.log(data)
      // fetch('./childTemplate.xlsx', {
      //   method: 'get',
      //   responseType: 'blob'
      // }).then(res => res.blob()).then(blob => {
      //   const file = new File([blob],'test.xls',{
      //     type:  blob.type
      //   })
      //   const arr = []
      //   readXlsxFile(file, {
      //   }).then(res => {
      //     res[1].forEach((item, index) => {
      //       // console.log(item)
      //       if(item) {
      //         let data = res.map(j => j[index])
      //         data = data.filter(j => j&&j!==item)
      //         arr.push({
      //           key: item,
      //           data
      //         })
      //       }
      //     })
      //   })
      //
      //   setTimeout(() => {
      //     console.log(JSON.stringify(arr))
      //   }, 500)
      //
      // })
    }
  },
  created() {
   this.readExcel()
  }
}
