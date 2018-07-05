<template>
  <div class="area-post-article">
    <span class="nav-link post-article" :class="{ disable: !publishable }" @click="togglePopup">
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
          :class="{ 'selected': img === thumbnail }"
          @click.prevent="selectThumbnail"
          class="thumbnail"/>
      </div>
      <hr class="hr">
      <button class="submit" @click="publish" :class="{ disable: !publishable }">公開する</button>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { ADD_TOAST_MESSAGE } from 'vuex-toast'

export default {
  data() {
    return {
      isPopupShown: false
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
      if (!this.publishable) return
      const { articleId, title, body } = this
      const overview = body
        .replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, '')
        .replace(/\r?\n?\s/g, '')
        .slice(0, 100)
      if (title === '') this.sendNotification({ text: 'タイトルを入力してください。' })
      if (overview === '') this.sendNotification({ text: '本文にテキストを入力してください。' })
      if (title === '' || overview === '') return

      const article = { title, body, overview }

      if (this.thumbnail !== '') {
        article.eye_catch_url = this.thumbnail
      }

      try {
        if (
          location.href.includes('/me/articles/draft') ||
          location.href.includes('/me/articles/new')
        ) {
          await this.putDraftArticle({ article, articleId })
          await this.publishDraftArticle({ article, articleId })
        } else if (location.href.includes('/me/articles/public')) {
          await this.putPublicArticle({ article, articleId })
          await this.republishPublicArticle({ article, articleId })
        }
        this.$router.push('/me/articles/public')
        this.sendNotification({ text: '記事を公開しました。' })
      } catch (e) {
        this.sendNotification({ text: '記事の公開に失敗しました。', type: 'warning' })
        console.error(e)
      }
    },
    togglePopup() {
      if (!this.publishable) return
      this.isPopupShown = !this.isPopupShown
    },
    closePopup() {
      this.isPopupShown = false
    },
    selectThumbnail({ target }) {
      this.updateThumbnail({ thumbnail: target.src === this.thumbnail ? '' : target.src })
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
    ...mapActions({
      sendNotification: ADD_TOAST_MESSAGE
    }),
    ...mapActions('article', [
      'updateThumbnail',
      'publishDraftArticle',
      'republishPublicArticle',
      'putDraftArticle',
      'putPublicArticle',
      'updateSuggestedThumbnails',
      'postArticleImage',
      'updateBody',
      'setIsSaving'
    ])
  },
  computed: {
    publishable() {
      return !this.isEdited && !this.isSaving
    },
    ...mapGetters('article', [
      'articleId',
      'title',
      'body',
      'thumbnail',
      'suggestedThumbnails',
      'isSaving',
      'isEdited'
    ])
  }
}
</script>

<style lang="scss" scoped>
.nav-link {
  font-size: 14px;
  text-decoration: none;
  color: #929292;
}

.area-post-article {
  grid-area: post-article;
  position: relative;

  .post-article {
    cursor: pointer;
    user-select: none;
    display: inline-block;

    &.disable {
      cursor: not-allowed;
    }
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

        &.disable {
          background: #fff;
          color: #99a2ff;
          cursor: not-allowed;
        }
      }
    }
  }
}

@media screen and (max-width: 640px) {
  .area-post-article {
    display: none;
  }
}

@media screen and (max-width: 550px) {
  .nav-link {
    font-size: 12px;
    line-height: 30px;
    text-align: center;
  }
}
</style>
