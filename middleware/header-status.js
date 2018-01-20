import * as types from '~/store/mutation-types'

export default function({ store, route }) {
  let status = ''
  switch (route.name) {
    case 'stories-edit-id':
    case 'stories-new':
    case 'stories-public':
    case 'stories-draft':
      status = 'edit'
      break
    default:
  }
  store.commit(`header/${types.SET_STATUS}`, { status })
}
