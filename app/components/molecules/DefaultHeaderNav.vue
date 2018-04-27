<template>
  <nav class="area-nav">
    <template v-if="!showOnlyLogo && !showOnlySessionLinks">
      <nuxt-link
        to="/"
        class="nav-link area-popular-articles"
        @click.native="resetScrollPosition">人気記事</nuxt-link>
      <nuxt-link
        to="/articles/recent"
        class="nav-link area-new-articles"
        @click.native="resetScrollPosition">新着記事</nuxt-link>
    </template>
  </nav>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  props: {
    showOnlyLogo: {
      type: Boolean,
      default: false
    },
    showOnlySessionLinks: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    resetScrollPosition() {
      this.setTopPageScroll({ scroll: 0 })
    },
    ...mapActions('presentation', ['setTopPageScroll'])
  }
}
</script>

<style lang="scss" scoped>
.area-nav {
  grid-area: nav;
  display: grid;
  text-align: center;
  grid-template-rows: 1fr 30px 1fr;
  grid-template-columns: 1fr 60px 42px 60px 1fr;
  /* prettier-ignore */
  grid-template-areas:
    "... ...             ... ...         ..."
    "... popular-articles ... new-articles ..."
    "... ...             ... ...         ...";
}

.nav-link {
  font-size: 14px;
  text-decoration: none;
  color: #525256;
}

.area-popular-articles {
  grid-area: popular-articles;
}

.area-new-articles {
  grid-area: new-articles;
}

.popular-articles .area-popular-articles {
  color: white;
  display: block;
  border-bottom: 2px solid white;
}

.new-articles .area-new-articles {
  color: white;
  display: block;
  border-bottom: 2px solid white;
}

@media screen and (max-width: 920px) {
  .article-container {
    .area-nav {
      grid-gap: 20px;
      /* prettier-ignore */
      grid-template-areas:
      'popular-articles new-articles';
      grid-template-columns: 48px 48px;
      grid-template-rows: 32px;
      text-align: left;
    }

    .nav-link {
      display: none;
    }
  }
}

@media screen and (max-width: 550px) {
  .area-nav {
    grid-gap: 20px;
    /* prettier-ignore */
    grid-template-areas:
      'popular-articles new-articles';
    grid-template-columns: 48px 48px;
    grid-template-rows: 36px;
    text-align: left;
  }

  .nav-link {
    line-height: 30px;
    font-size: 12px;
  }

  .popular-articles .area-popular-articles {
    color: #99a2ff;
    border-bottom: 1px solid #99a2ff;
  }

  .new-articles .area-new-articles {
    color: #99a2ff;
    border-bottom: 1px solid #99a2ff;
  }
}
</style>
