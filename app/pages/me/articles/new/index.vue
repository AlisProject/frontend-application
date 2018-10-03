<template>
  <create-article/>
</template>

<script>
import CreateArticle from '~/components/pages/CreateArticle'
import head from '~/utils/editor-head'

export default {
  components: {
    CreateArticle
  },
  mounted() {
    this.$el.querySelector('.area-body').dataset.placeholder = '本文を入力してください'
  },
  head: { ...head, title: '新規記事' }
}
</script>
