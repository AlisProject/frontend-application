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
    redirect('/articles/popular?topic=crypto')
  },
  head() {
    return {
      titleTemplate: ''
    }
  }
}
</script>
