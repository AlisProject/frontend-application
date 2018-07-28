import users from './users'
import articles from './articles'
import comments from './comments'

export default {
  $get: {
    ...users.get,
    ...articles.get,
    ...comments.get
  },
  $post: {}
}
