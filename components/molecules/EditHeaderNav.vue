<template>
  <nav class="area-nav">
    <nuxt-link to="/me/articles/public" class="nav-link area-public-articles">公開済み</nuxt-link>
    <nuxt-link to="/me/articles/draft" class="nav-link area-drafts">下書き</nuxt-link>
    <a href="/me/articles/new" class="nav-link area-new-article">新規作成</a>
    <div class="area-post-article" v-show="showEditArticleLink">
      <a :href="`/me/articles/public/${this.$route.params.articleId}/edit`" class="nav-link post-article">
        編集する
      </a>
    </div>
    <div class="area-post-article" v-show="showPostArticleLink">
      <span class="nav-link post-article" @click="togglePopup">
        公開する
      </span>
      <div v-show="isPopupShown" class="popup">
        <h3 class="headline">サムネイルの画像を選択</h3>
        <div class="thumbnails">
          <span v-if="suggestedThumbnails.length === 0">
            画像がありません
          </span>
          <img
            v-for="img in suggestedThumbnails"
            :src="img"
            :key="img"
            @click.stop="selectThumbnail"
            class="thumbnail"/>
        </div>
        <hr class="hr">
        <button class="submit" @click="publish">公開する</button>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import { publishDraftArticle } from '~/api/article'
import * as types from '~/store/mutation-types'

export default {
  data() {
    return {
      isPopupShown: false,
      beforeSelected: null
    }
  },
  props: {
    showPostArticleLink: {
      type: Boolean,
      default: false
    },
    showEditArticleLink: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    this.listen(window, 'click', (event) => {
      if (!this.$el.contains(event.target)) {
        this.closePopup()
      }
    })
  },
  destroyed() {
    if (this._eventRemovers) {
      this._eventRemovers.forEach((eventRemover) => {
        eventRemover.remove()
      })
    }
  },
  methods: {
    async publish() {
      const article = {
        overview: this.body.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, ''),
        eye_catch_url: this.thumbnail
      }
      const { id: articleId } = this.$route.params

      try {
        await publishDraftArticle({ article, articleId })
        this.$router.push(`/user_id/articles/${articleId}`)
      } catch (e) {
        console.error(e)
      }
    },
    togglePopup() {
      this.isPopupShown = !this.isPopupShown
    },
    closePopup() {
      this.isPopupShown = false
    },
    selectThumbnail({ target }) {
      if (this.beforeSelected) {
        this.beforeSelected.classList.remove('selected')
      }
      target.classList.add('selected')
      this.updateThumbnail({ thumbnail: target.src })
      this.beforeSelected = target
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
    ...mapMutations('article', {
      updateThumbnail: types.UPDATE_THUMBNAIL
    })
  },
  computed: {
    ...mapGetters('article', ['body', 'thumbnail', 'suggestedThumbnails'])
  }
}
</script>

<style lang="scss" scoped>
.area-nav {
  grid-area: nav;
  display: grid;
  text-align: center;
  grid-template-rows: 1fr 30px 1fr;
  grid-template-columns: 1fr 70px 70px 70px 1fr 60px 1fr;
  grid-column-gap: 10px;
  /* prettier-ignore */
  grid-template-areas:
    "... ...            ...    ...       ... ...        ..."
    "... public-articles drafts new-article ... post-article ..."
    "... ...            ...    ...       ... ...        ...";
}

.nav-link {
  font-size: 14px;
  text-decoration: none;
  color: #929292;
}

.area-public-articles {
  grid-area: public-articles;
}

.public-articles .area-public-articles {
  color: #99a2ff;
  display: block;
  border-bottom: 2px solid #99a2ff;
}

.area-drafts {
  grid-area: drafts;
}

.drafts .area-drafts {
  color: #99a2ff;
  display: block;
  border-bottom: 2px solid #99a2ff;
}

.area-new-article {
  grid-area: new-article;
}

.area-post-article {
  grid-area: post-article;
  position: relative;

  .post-article {
    cursor: pointer;
    user-select: none;
  }

  .popup {
    background-color: #ffffff;
    border-radius: 4px;
    box-shadow: 0 4px 10px 0 rgba(192, 192, 192, 0.5);
    box-sizing: border-box;
    left: -30px;
    padding: 24px;
    position: absolute;
    top: 30px;
    width: 350px;
    z-index: 1;

    .headline {
      color: #000000;
      font-size: 16px;
      font-weight: 500;
      letter-spacing: 1px;
      line-height: 24px;
      margin-top: 0;
      text-align: left;
    }

    .thumbnails {
      height: 80px;
      overflow-x: scroll;
      overflow-y: hidden;
      white-space: nowrap;

      .thumbnail {
        box-sizing: border-box;
        cursor: pointer;
        display: inline-block;
        height: 80px;
        margin-right: 20px;
        overflow: hidden;
        width: 80px;
      }

      .selected {
        border: 2px solid #99a2ff;
      }
    }

    .hr {
      margin: 20px 0;
    }

    .submit {
      border-radius: 4px;
      border: 1.5px solid #99a2ff;
      color: #99a2ff;
      cursor: pointer;
      height: 37px;
      justify-content: center;
      width: 160px;

      &:hover {
        background: #99a2ff;
        color: #fff;
      }
    }
  }
}

@media screen and (max-width: 550px) {
  .area-nav {
    grid-gap: 20px;
    /* prettier-ignore */
    grid-template-areas:
      'public-articles drafts';
    grid-template-columns: 48px 48px;
    grid-template-rows: 42px;
    text-align: left;
  }

  .area-new-article {
    display: none;
  }

  .nav-link {
    font-size: 12px;
    line-height: 40px;
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
