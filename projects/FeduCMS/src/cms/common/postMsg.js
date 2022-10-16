export default function postMsg(key, type) {
  let classRoomOrigin = ''
  let classRoomName
  const eventList = {}
  if (type) {
    window.opener.postMessage(window.btoa('classroom'), '*')
  }
  window.addEventListener('message', (e) => {
    try {
      const str = atob(e.data)
      if (!type) {
        if (str === key) {
          classRoomOrigin = e.origin
          classRoomName = window.classRoom
          classRoomName.postMessage(btoa(key), classRoomOrigin)
          classRoomName.postMessage(
            btoa(
              JSON.stringify({
                key: 'status',
                value: 'ok',
              })
            ),
            classRoomOrigin
          )
          const item = eventList['connect']
          if (item) {
            item('ok')
          }
        }
      } else {
        try {
          const res = JSON.parse(str)
          if (res.key === 'status' && res.value === 'ok') {
            classRoomOrigin = e.origin
            classRoomName = window.opener
            const item = eventList['connect']
            if (item) {
              item('ok')
            }
          }
        } catch (e) {}
      }
      if (e.origin === classRoomOrigin) {
        const res = JSON.parse(decodeURI(atob(e.data)))
        const item = eventList[res.key]
        if (item) {
          item(res.value)
        }
      }
    } catch (e) {}
  })
  return {
    on: function (key, call) {
      eventList[key] = call
    },
    emit: function (key, val) {
      const params = btoa(
        encodeURI(
          JSON.stringify({
            key: key,
            value: val,
          })
        )
      )
      classRoomName.postMessage(params, classRoomOrigin)
    },
  }
}
