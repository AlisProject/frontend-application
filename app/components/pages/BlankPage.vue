<template>
  <div class="blank-page-container">
    <app-header />
  </div>
</template>

<script>
import AppHeader from '../organisms/AppHeader'

export default {
  components: {
    AppHeader
  }
}
</script>

<style lang="scss" scoped>
.blank-page-container {
  display: grid;
  grid-template-rows: 100px;
  grid-template-columns: minmax(0, 1fr) 640px minmax(0, 1fr);
  /* prettier-ignore */
  grid-template-areas:
    "app-header  app-header app-header";
}
</style>
