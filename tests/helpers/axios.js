import responses from './responses'

// Error を返したいときだけ false にする
let isSafetyMode = true

export default {
  setSafetyMode: (flag) => (isSafetyMode = flag),
  '$get': (key) => isSafetyMode ? Promise.resolve(responses['$get'][key]) : Promise.reject(Error('some error')),
  '$post': (key) => isSafetyMode ? Promise.resolve(responses['$post'][key]) : Promise.reject(Error('some error'))
}
