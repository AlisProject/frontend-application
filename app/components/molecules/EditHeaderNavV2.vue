<template>
  <nav class="area-nav" :class="{ 'is-fixed': isFixed }">
    <div class="area-nav-inner">
      <nuxt-link
        v-if="type === 'public-article'"
        :to="`/users/${currentUserInfo.user_id}`"
        class="area-articles-link"
      >
        公開中
      </nuxt-link>
      <nuxt-link
        v-if="type === 'draft-article'"
        :to="`/users/${currentUserInfo.user_id}/drafts`"
        class="area-articles-link"
      >
        下書き
      </nuxt-link>
      <span class="area-save-status">{{ saveStatus }}</span>
      <div v-if="type === 'draft-article'" class="area-article-menu" @click="toggleArticlePopup">
        <div v-show="isArticlePopupShown" class="article-popup">
          <nuxt-link
            class="article-popup-content"
            :to="`${historiesPath}`"
            @click.native="resetHistories()"
          >
            編集履歴一覧
          </nuxt-link>
          <span class="article-popup-content" @click="showArticleDeleteModal">
            削除
          </span>
        </div>
      </div>
      <nuxt-link
        v-if="type !== 'draft-article'"
        :to="`${historiesPath}`"
        class="area-article-histories fa fa-history"
        @click.native="resetHistories()"
      />
      <edit-header-nav-post-article-v2 />
    </div>
  </nav>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import EditHeaderNavPostArticleV2 from '../molecules/EditHeaderNavPostArticleV2'

export default {
  components: {
    EditHeaderNavPostArticleV2
  },
  props: {
    type: {
      type: String,
      default: 'public-article'
    }
  },
  data() {
    return {
      isArticlePopupShown: false,
      isFixed: false
    }
  },
  mounted() {
    this.listen(window, 'click', (event) => {
      if (
        this.$el.querySelector('.area-article-menu') &&
        !this.$el.querySelector('.area-article-menu').contains(event.target)
      ) {
        this.closeEtcPopup()
      }
    })
    this.listen(window, 'touchstart', (event) => {
      if (
        this.$el.querySelector('.area-article-menu') &&
        !this.$el.querySelector('.area-article-menu').contains(event.target)
      ) {
        this.closeEtcPopup()
      }
    })
    window.addEventListener('scroll', this.handleScroll)
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  destroyed() {
    if (this._eventRemovers) {
      this._eventRemovers.forEach((eventRemover) => {
        eventRemover.remove()
      })
    }
  },
  computed: {
    historiesPath() {
      const articleStatus = this.$route.path.startsWith('/me/articles/public/') ? 'public' : 'draft'
      return `/me/articles/${articleStatus}/v2/${this.articleId}/content_edit_histories`
    },
    ...mapGetters('article', ['articleId', 'saveStatus']),
    ...mapGetters('user', ['currentUserInfo'])
  },
  methods: {
    showArticleDeleteModal() {
      this.setArticleDeleteModal({ isShow: true })
    },
    toggleArticlePopup() {
      this.isArticlePopupShown = !this.isArticlePopupShown
    },
    closeEtcPopup() {
      this.isArticlePopupShown = false
    },
    handleScroll() {
      this.isFixed = window.scrollY >= 100
    },
    resetHistories() {
      this.resetArticleContentEditHistories()
    },
    listen(target, eventType, callback) {
      if (!this._eventRemovers) {
        this._eventRemovers = []
      }
      target.addEventListener(eventType, callback)
      this._eventRemovers.push({
        remove: function() {
          target.removeEventListener(eventType, callback)
        }
      })
    },
    ...mapActions('article', ['resetArticleContentEditHistories']),
    ...mapActions('articleModals', ['setArticleDeleteModal'])
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
    grid-template-columns: 70px minmax(0, 1fr) 90px min-content;
    margin: auto;
    width: 640px;
    /* prettier-ignore */
    grid-template-areas:
      "articles-link ... save-status article-menu post-article";
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

.area-article-histories {
  grid-area: article-menu;
  align-items: center;
  color: gray;
  display: flex;
  font-size: 22px;
  justify-content: flex-start;
  letter-spacing: 1.6px;
  line-height: 24px;
  text-decoration: none;
  padding: 0px 7px 0px 0px;

  &:hover,
  &:focus {
    color: #0086cc;
  }
}

.area-article-menu {
  grid-area: article-menu;
  background: #fff url('~assets/images/pc/article/icon_etc.png') no-repeat;
  background-size: 24px;
  cursor: pointer;
  position: relative;
  width: 30px;
  margin: 5px 8px 8px 8px;

  .article-popup {
    background-color: #ffffff;
    border-radius: 4px;
    filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.25));
    cursor: default;
    box-sizing: border-box;
    font-size: 14px;
    padding: 8px 16px;
    position: absolute;
    right: 0px;
    top: 24px;
    z-index: 1;

    .article-popup-content {
      color: #6e6e6e;
      cursor: pointer;
      display: inline-block;
      font-size: 14px;
      font-weight: 500;
      line-height: 2;
      text-align: left;
      text-decoration: none;
      user-select: none;
      white-space: nowrap;
      width: 100%;
    }
  }
}

.area-save-status {
  grid-area: save-status;
  display: flex;
  justify-content: flex-end;
  padding: 0 2px 0 0;
  align-items: center;
  white-space: nowrap;
  color: lightgray;
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
