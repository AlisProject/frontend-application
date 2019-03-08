import dayjs from 'dayjs'
import 'dayjs/locale/ja'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

export function formatDate(date) {
  return dayjs
    .unix(date)
    .locale('ja')
    .format('YYYY/MM/DD')
}

export function formatDateWithTime(date) {
  return dayjs
    .unix(date)
    .locale('ja')
    .format('YYYY/MM/DD HH:mm')
}

export function formatDateFromNow(date) {
  return dayjs
    .unix(date)
    .locale('ja')
    .startOf('minute')
    .fromNow()
}
