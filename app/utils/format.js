import moment from 'moment'

export function formatDate(date) {
  return moment(date, 'X')
    .locale('ja')
    .format('L')
}
