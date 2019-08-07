<template>
  <top-page />
</template>

<script>
import TopPage from '~/components/pages/TopPage'

export default {
  components: {
    TopPage
  },
  async fetch({ store, query, from = {}, error }) {
    try {
      // アイキャッチ・オススメ記事の初期化
      // オススメ記事への切り替えを行った場合のみ記事データの初期化を行う。
      // 記事から遷移してきた場合は、スクロール位置を保持させたいので初期化はしない。
      if (from.name === 'articles-recent' || from.name === 'articles-popular') {
        store.dispatch('article/resetArticleData')
      }

      await store.dispatch('article/getTopics')
    } catch (e) {
      error({ statusCode: 404 })
    }
  },
  head() {
    return {
      titleTemplate: ''
    }
  }
}
</script>
