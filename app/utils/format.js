import dayjs from 'dayjs'
import 'dayjs/locale/ja'
import relativeTime from 'dayjs/plugin/relativeTime'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'

dayjs.extend(relativeTime)
dayjs.extend(LocalizedFormat)

export function formatDate(date) {
  return dayjs
    .unix(date)
    .locale('ja')
    .format('L')
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
