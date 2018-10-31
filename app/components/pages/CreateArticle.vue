<template>
  <div class="new-editor-container">
    <app-header class="area-app-header-container" />
    <EditHeaderNav class="new-editor-head-nav" />
    <NewArticleEditor />
  </div>
</template>

<script>
import AppHeader from '~/components/organisms/AppHeader.vue'
import EditHeaderNav from '~/components/molecules/EditHeaderNav'
import NewArticleEditor from '~/components/organisms/NewArticleEditor.vue'

export default {
  name: 'create-article',
  components: {
    AppHeader,
    EditHeaderNav,
    NewArticleEditor
  }
}
</script>

<style lang="scss" scoped>
.new-editor-container .new-editor-head-nav {
  width: 880px;
  max-width: 100%;
}

.new-editor-container {
  width: 1100px;
  max-width: 100%;
  margin: 0 auto;
}

.area-app-header-container {
  width: 880px;
  max-width: 100%;
  margin: 0 auto;
  z-index: 2;
  position: relative;
}
</style>
