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
    this.$el.querySelector('.area-body').dataset.placeholder = 'あなたの物語を教えてください･･･'
  },
  head
}
</script>
