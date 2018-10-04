<template>
  <popular-article-list/>
</template>

<script>
import PopularArticleList from '~/components/pages/PopularArticleList'

export default {
  components: {
    PopularArticleList
  },
  fetch({ redirect }) {
    // メタタグ内のタイトルをトップページのものにするために &from=top のパラメータを付与
    redirect('/articles/popular?topic=crypto&from=top')
  },
  head() {
    return {
      titleTemplate: ''
    }
  }
}
</script>
