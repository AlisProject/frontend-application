import moment from 'moment'

export function formatDate(date) {
  return moment(date, 'X')
    .locale('ja')
    .format('L')
}

export function formatDateWithTime(date) {
  return moment(date, 'X')
    .locale('ja')
    .format('YYYY/MM/DD HH:MM')
}
