import { title, titleReverse, titleSeparator } from '@/config'
import i18n from '@/i18n'
import request from '@/utils/request'
/**
 * @description 设置标题
 * @param pageTitle
 * @returns {string}
 */
export default function getPageTitle(pageTitle) {
  return new Promise((resolve) => {
    request({
      url: '/home/unAccess/share/getFirmName',
      method: 'GET',
    }).then((res) => {
      if (+res.code === 0) {
        document.title = res.data
        resolve(res.data)
      }
    })
  })

  //
  // if (i18n.te(`vabI18n.${pageTitle}`))
  //   pageTitle = i18n.t(`vabI18n.${pageTitle}`)
  // let newTitles = []
  // if (pageTitle) newTitles.push(pageTitle)
  // if (title) newTitles.push(title)
  // if (titleReverse) newTitles = newTitles.reverse()
  // return newTitles.join(titleSeparator)
}
