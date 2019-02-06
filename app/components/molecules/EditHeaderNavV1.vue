<template>
  <nav class="area-nav" :class="{ 'is-fixed': isFixed }">
    <div class="area-nav-inner">
      <nuxt-link
        :to="`/users/${currentUserInfo.user_id}`"
        class="area-articles-link"
        v-if="type === 'public-article'">公開中</nuxt-link>
      <nuxt-link
        :to="`/users/${currentUserInfo.user_id}/drafts`"
        class="area-articles-link"
        v-if="type === 'draft-article'">下書き</nuxt-link>
      <span class="area-save-status">{{ saveStatus }}</span>
      <edit-header-nav-post-article-v1 />
    </div>
  </nav>
</template>

<script>
import { mapGetters } from 'vuex'
import EditHeaderNavPostArticleV1 from '../molecules/EditHeaderNavPostArticleV1'

export default {
  components: {
    EditHeaderNavPostArticleV1
  },
  props: {
    type: {
      type: String,
      default: 'public-article'
    }
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
    ...mapGetters('article', ['saveStatus']),
    ...mapGetters('user', ['currentUserInfo'])
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
  background: #fff;
  display: grid;
  grid-area: nav;
  height: 74px;
  text-align: center;
  transition: box-shadow 400ms ease;
  width: 100%;
  z-index: 2001;
  /* prettier-ignore */
  grid-template-areas:
    "nav-inner";

  .area-nav-inner {
    display: grid;
    grid-area: nav-inner;
    grid-template-columns: 70px 1fr 90px min-content;
    margin: auto;
    width: 640px;
    /* prettier-ignore */
    grid-template-areas:
      "articles-link ... save-status post-article";
  }

  &.is-fixed {
    box-shadow: 0 12px 12px -12px rgba(192, 192, 192, 0.7);
    left: 0;
    position: fixed;
    right: 0;
  }
}

.area-articles-link {
  grid-area: articles-link;
  align-items: center;
  color: #6e6e6e;
  display: flex;
  font-size: 16px;
  font-weight: bold;
  justify-content: flex-start;
  letter-spacing: 1.6px;
  line-height: 24px;
  text-decoration: none;
}

.area-save-status {
  grid-area: save-status;
  display: flex;
  justify-content: center;
  align-items: center;
  white-space: nowrap;
  color: #0086cc;
  font-size: 16px;
  letter-spacing: 1.6px;
  font-weight: bold;
}

@media screen and (max-height: 414px) {
  .area-nav {
    &.is-fixed {
      position: static;
    }
  }
}

.ios,
.android {
  .area-nav {
    display: none;
  }
}
</style>
