const get = {
  '/articles/{article_1}/like': {
    likes_count: 10
  },
  '/articles/{article_1}/likes': {
    count: 10
  },
  '/articles/{article_1}/alistoken': {
    alis_token: 10,
    article_id: '1'
  },
  '/articles/{article_1}/comments': {
    Items: [
      {
        comment_id: '{comment_1}',
        sort_key: 1532731839017930,
        user_id: 'user_id',
        text: 'comment',
        created_at: 1532731839,
        article_id: '1'
      }
    ],
    Count: 1
  },
  '/articles/{article_1}': {
    article_id: '{article_1}',
    user_id: '{user_1}',
    title: 'Article title',
    overview: 'Article overview',
    eye_catch_url: 'string',
    body:
      'Article overview, Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    created_at: 0
  },
  '/articles/{article_id}': {
    article_id: '1',
    user_id: '{user_1}',
    title: 'Article title',
    overview: 'Article overview',
    eye_catch_url: 'string',
    body:
      'Article overview, Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    created_at: 0
  }
}

export default {
  get
}
