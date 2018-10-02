<template>
  <nav class="area-nav" :class="{ 'is-fixed': isFixed }">
    <nuxt-link to="/me/articles/public" class="nav-link area-public-articles">公開中</nuxt-link>
    <nuxt-link to="/me/articles/draft" class="nav-link area-drafts">下書き</nuxt-link>
    <span class="area-save-status">{{ saveStatus }}</span>
    <edit-header-nav-post-article />
  </nav>
</template>

<script>
import { mapGetters } from 'vuex'
import EditHeaderNavPostArticle from '../molecules/EditHeaderNavPostArticle'

export default {
  components: {
    EditHeaderNavPostArticle
  },
  data() {
    return {
      isFixed: false
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll)
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  computed: {
    ...mapGetters('article', ['saveStatus'])
  },
  methods: {
    handleScroll() {
      this.isFixed = window.scrollY >= 100
    }
  }
}
</script>

<style lang="scss" scoped>
.area-nav {
  grid-area: nav;
  display: grid;
  text-align: center;
  grid-template-columns: 70px 70px 1fr 90px auto;
  /* prettier-ignore */
  grid-template-areas:
    "public-articles drafts ... save-status post-article";
  background: #fff;
  border-bottom: 1px solid rgba(#6e6e6e, 0.1);
  height: 40px;
  margin: auto;
  width: 640px;
  z-index: 2001;

  &.is-fixed {
    left: 0;
    position: fixed;
    right: 0;
  }
}

.area-save-status {
  grid-area: save-status;
  color: #6e6e6e;
  font-size: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  white-space: nowrap;
}

.nav-link {
  font-size: 14px;
  text-decoration: none;
  color: #929292;
  display: flex;
  justify-content: center;
  align-items: center;
}

.area-public-articles {
  grid-area: public-articles;
}

.public-article .area-public-articles,
.public-articles .area-public-articles {
  color: #99a2ff;
  border-bottom: 2px solid #99a2ff;
  margin-top: 2px;
}

.area-drafts {
  grid-area: drafts;
}

.drafts .area-drafts {
  color: #99a2ff;
  border-bottom: 2px solid #99a2ff;
  margin-top: 2px;
}

.area-new-article {
  align-items: center;
  background: linear-gradient(314.72deg, #232538 0%, #858dda 100%);
  border-radius: 4px;
  color: white;
  display: flex;
  font-size: 14px;
  grid-area: new-article;
  justify-content: center;
  text-decoration: none;
}

@media screen and (max-width: 640px) {
  .area-save-status,
  .area-new-article {
    display: none;
  }
}

@media screen and (max-width: 550px) {
  .area-nav {
    grid-gap: 20px;
    /* prettier-ignore */
    grid-template-areas:
      'public-articles drafts';
    grid-template-columns: 48px 48px;
    grid-template-rows: 36px;
    text-align: left;
  }

  .public-article .nav-link {
    display: none;
  }

  .nav-link {
    font-size: 12px;
    line-height: 30px;
    text-align: center;
  }

  .public-articles .area-public-articles {
    border-bottom: 1px solid #99a2ff;
  }

  .drafts .area-drafts {
    border-bottom: 1px solid #99a2ff;
  }
}
</style>
