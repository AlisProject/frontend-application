<template>
  <header class="area-app-header-container">
    <nuxt-link to="/" class="area-logo">logo here</nuxt-link>
    <default-header-nav v-show="showDefaultHeaderNav"/>
    <edit-header-nav v-show="showEditHeaderNav" :showPostStoryLink="showPostStoryLink"/>
  </header>
</template>

<script>
import DefaultHeaderNav from '../molecules/DefaultHeaderNav'
import EditHeaderNav from '../molecules/EditHeaderNav'

export default {
  props: {
    showDefaultHeaderNav: {
      type: Boolean,
      default: false
    },
    showEditHeaderNav: {
      type: Boolean,
      default: false
    },
    showPostStoryLink: {
      type: Boolean,
      default: false
    }
  },
  components: {
    DefaultHeaderNav,
    EditHeaderNav
  }
}
</script>


<style lang="scss" scoped>
.area-app-header-container {
  display: grid;
  grid-area: app-header;
  grid-template-rows: 100px;
  grid-template-columns: 100px 1fr 100px;
  /* prettier-ignore */
  grid-template-areas:
    "logo nav";
  position: relative;
}

.area-logo {
  grid-area: logo;
}
</style>
