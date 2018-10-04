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
    // &from=top のパラメータは、遷移先でTOPページからのリダイレクトで遷移されたかの判定に使用
    redirect('/articles/popular?topic=crypto&from=top')
  },
  head() {
    return {
      titleTemplate: ''
    }
  }
}
</script>
