<template>
  <public-article-list/>
</template>

<script>
import PublicArticleList from '~/components/pages/PublicArticleList'
import * as types from '~/store/mutation-types'

export default {
  components: {
    PublicArticleList
  },
  async fetch({ store }) {
    await store.dispatch('article/getPublicArticles', { userId: '1' })
    const { publicArticles } = store.state.article
    await store.dispatch('article/getUserInfos', { articles: publicArticles })
    await store.dispatch('article/getAlisTokens', { articles: publicArticles })
    const { userInfos, alisTokens } = store.state.article
    store.commit(`article/${types.SET_USER_INFO_TO_ARTICLES}`, {
      articles: publicArticles,
      userInfos,
      type: 'public'
    })
    store.commit(`article/${types.SET_ALIS_TOKEN_TO_ARTICLES}`, {
      articles: publicArticles,
      alisTokens,
      type: 'public'
    })
  }
}
</script>
