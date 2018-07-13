import users from './users'
import articles from './articles'

export default {
  '$get': {
    ...users.get,
    ...articles.get
  },
  '$post': {
  }
}
