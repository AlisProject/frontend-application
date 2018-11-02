<template>
  <div class="area-post-article">
    <article-editor-publish-button
      :publishable="publishable"
      :onClick="togglePopup"
    />
    <div v-show="isPopupShown" class="popup">
      <h3 class="headline">1. サムネイルの選択</h3>
      <div class="thumbnails">
        <span class="no-thumbnail-message" v-if="suggestedThumbnails.length === 0">
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
      <h3 class="headline">2. トピックの設定</h3>
      <div class="article-type-select-box">
        <no-ssr>
          <select required class="article-type-select" :value="topicType" @change="handleChangeTopicType">
            <option value='' disabled selected class="placeholder">選択してください</option>
            <option v-for="topic in topics" :value="topic.name">
              {{ topic.display_name }}
            </option>
          </select>
        </no-ssr>
      </div>
      <h3 class="headline">3. タグの設定</h3>
      <tags-input-form @change-tag-validation-state="onChangeTagValidationState"/>
      <button
        class="submit"
        @click="publish"
        :class="{ disable: !publishable || isInvalidTag}"
        :disabled="publishingArticle">
        公開する
      </button>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { ADD_TOAST_MESSAGE } from 'vuex-toast'
import ArticleEditorPublishButton from '~/components/atoms/ArticleEditor/ArticleEditorPublishButton.vue'
import TagsInputForm from '../molecules/TagsInputForm'

export default {
  components: {
    TagsInputForm,
    ArticleEditorPublishButton
  },
  data() {
    return {
      publishingArticle: false,
      isPopupShown: false,
      isThumbnailSelected: false,
      topic: null,
      isInvalidTag: false
    }
  },
  async created() {
    try {
      await this.getTopics()
    } catch (error) {
      this.sendNotification({
        text: 'エラーが発生しました。しばらく時間を置いて再度お試しください',
        type: 'warning'
      })
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
    this.resetArticleTopic()
    if (this._eventRemovers) {
      this._eventRemovers.forEach((eventRemover) => {
        eventRemover.remove()
      })
    }
  },
  methods: {
    async publish() {
      try {
        // 「公開する」ボタンを押した瞬間はisInvalidTagの値が更新されないため、
        // isInvalidTagの状態が更新されるまで待つ
        await this.$nextTick()

        if (!this.publishable || this.isInvalidTag) return
        this.publishingArticle = true
        const { articleId, title, body, topic } = this
        const overview = body
          .replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, '')
          .replace(/\r?\n?\s/g, ' ')
          .slice(0, 100)
        if (title === '') this.sendNotification({ text: 'タイトルを入力してください。' })
        if (overview === '') this.sendNotification({ text: '本文にテキストを入力してください。' })
        if (topic === null) this.sendNotification({ text: 'トピックを選択してください。' })
        if (title === '' || overview === '' || topic === null) {
          this.publishingArticle = false
          return
        }

        const article = { title, body, overview }

        if (this.thumbnail !== '') {
          article.eye_catch_url = this.thumbnail
        }

        // タグのデータ形式をAPIに適するように整形
        const tags = this.tags.map((tag) => tag.text)

        if (
          location.href.includes('/me/articles/draft') ||
          location.href.includes('/me/articles/new')
        ) {
          await this.putDraftArticle({ article, articleId })
          await this.publishDraftArticle({ articleId, topic, tags })
        } else if (location.href.includes('/me/articles/public')) {
          await this.putPublicArticle({ article, articleId })
          await this.republishPublicArticle({ articleId, topic, tags })
        }
        this.$router.push('/me/articles/public')
        this.sendNotification({ text: '記事を公開しました。' })
        this.resetArticleTopic()
      } catch (e) {
        this.publishingArticle = false
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
      this.isThumbnailSelected = true
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
    handleChangeTopicType(event) {
      this.$el.querySelector('.article-type-select').style.color = '#000'
      this.topic = event.target.value
      this.setArticleTopic({ topicType: this.topic })
    },
    onChangeTagValidationState(isInvalid) {
      this.isInvalidTag = isInvalid
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
      'setIsSaving',
      'getTopics',
      'resetArticleTopic',
      'setArticleTopic'
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
      'isEdited',
      'topics',
      'topicType',
      'tags'
    ])
  },
  watch: {
    suggestedThumbnails() {
      if (this.thumbnail !== '') return
      if (!this.isThumbnailSelected) {
        this.updateThumbnail({ thumbnail: this.suggestedThumbnails[0] })
        return
      }
      if (
        this.isThumbnailSelected &&
        Array.from(document.querySelectorAll('.thumbnails img')).filter(
          (img) => img.classList.contains('selected').length !== 0
        )
      ) {
        this.updateThumbnail({ thumbnail: this.suggestedThumbnails[0] })
      }
    },
    topicType() {
      if (this.topicType === null) return
      this.$el.querySelector('.article-type-select').style.color = '#000'
      this.topic = this.topicType
    }
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
  display: flex;
  align-self: center;
  justify-content: center;

  .popup {
    background-color: #ffffff;
    border-radius: 4px;
    box-shadow: 0 0 16px 0 rgba(192, 192, 192, 0.5);
    box-sizing: border-box;
    padding: 40px 20px;
    position: absolute;
    top: 30px;
    width: 350px;
    z-index: 1;

    .headline {
      color: #000000;
      font-size: 14px;
      font-weight: 500;
      line-height: 1.5;
      margin-top: 0;
      text-align: left;
    }

    .thumbnails {
      overflow-x: scroll;
      overflow-y: hidden;
      white-space: nowrap;
      margin-bottom: 40px;

      .no-thumbnail-message {
        font-size: 14px;
        margin-top: 20px;
        display: block;
      }

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

    .article-type-select-box {
      border-bottom: 1px dotted #232538;
      margin-bottom: 40px;
      padding: 6px 1px;
      position: relative;

      &::after,
      &::before {
        position: absolute;
        right: 0;
        width: 0;
        height: 0;
        padding: 0;
        content: '';
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        pointer-events: none;
      }

      &::after {
        top: 7px;
        border-bottom: 8px solid rgb(80, 81, 96);
      }

      &::before {
        top: 17px;
        border-top: 8px solid rgb(80, 81, 96);
      }

      .article-type-select {
        appearance: none;
        background-image: none;
        background: transparent;
        border: none;
        box-shadow: none;
        color: #cecece;
        cursor: pointer;
        font-size: 14px;
        outline: none;
        padding-right: 1em;
        text-indent: 0.01px;
        text-overflow: ellipsis;
        width: 100%;

        .placeholder {
          display: none;
        }

        &::-ms-expand {
          display: none;
        }
      }
    }

    .submit {
      background: white;
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

@-moz-document url-prefix() {
  .article-type-select-box {
    &::after {
      top: 15px !important;
    }

    &::before {
      top: 25px !important;
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
