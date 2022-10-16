import { getUrl } from './base'

const base = {
  firmId: getUrl(window.location.host, '.'),
  // firmId: getUrl(window.location.host, '.')
}

for (const key in base) {
  window[key] = base[key]
}

const _log = console.log

console.debug = function () {
  const arr = [].slice.call(arguments)
  arr.splice(0, 1)
  arr.map((item) => (typeof item === 'object' ? JSON.stringify(item) : item))
  _log.call(
    console,
    `%c ${[].slice.call(arguments)[0]}`,
    'color: red;font-size:18px',
    arr
  )
}
