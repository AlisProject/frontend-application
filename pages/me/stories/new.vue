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
  head
}
</script>
