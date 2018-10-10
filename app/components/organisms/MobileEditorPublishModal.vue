<template>
  <app-modal
    title="公開情報の確認"
    style="z-index: 2"
    class="mobile-editor-publish-modal"
    @close="handleCloseModal"
  >
    <div slot="modal-content">
      <div class="area-post-article">
          <h3 class="headline">1. サムネイルの選択</h3>
          <div class="thumbnails">
            <span class="no-thumbnail-message" v-if="thumbnails.length === 0">
              画像がありません
            </span>
            <img
              v-for="thumbnail in thumbnails"
              :src="thumbnail.payload.src"
              :key="thumbnail.id"
              :class="{ 'selected': thumbnail.id === selectedThumbnail }"
              @click.prevent="selectThumbnail(thumbnail)"
              class="thumbnail"/>
          </div>
          <h3 class="headline">2. トピックの設定</h3>
          <topic-selector
            :topics="topics"
            :value="topicType ? topicType.name : ''"
            @change="handleChangeTopicType"
          />
          <h3 class="headline">3. タグの設定</h3>
          <tags-input-form @change-tag-validation-state="onChangeTagValidationState"/>
          <rounded-button
            class="submit"
            :fluid="true"
            @click="publish"
            :class="{ disable: !publishable || isInvalidTag}"
            :disabled="publishingArticle">
            公開する
          </rounded-button>
      </div>
    </div>
  </app-modal>
</template>

<script>
import TopicSelector from '~/components/molecules/TopicSelector.vue'
import RoundedButton from '~/components/atoms/RoundedButton.vue'
import AppModal from '~/components/atoms/AppModal.vue'
import { mapGetters, mapActions } from 'vuex'
import { ADD_TOAST_MESSAGE } from 'vuex-toast'
import TagsInputForm from '../molecules/TagsInputForm'

export default {
  components: {
    AppModal,
    TagsInputForm,
    TopicSelector,
    RoundedButton
  },
  props: {
    thumbnails: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      publishingArticle: false,
      isPopupShown: false,
      topic: null,
      isInvalidTag: false,
      selectedThumbnail: null
    }
  },
  async created() {
    await this.getTopics()
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
    handleCloseModal() {
      this.$emit('close')
    },
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
          .replace(/\r?\n?\s/g, '')
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
    selectThumbnail(thumbnail) {
      this.selectedThumbnail = thumbnail.id
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
    handleChangeTopicType(name) {
      this.$el.querySelector('.article-type-select').style.color = '#000'
      this.topic = name
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
      'suggestedThumbnails',
      'isSaving',
      'isEdited',
      'topics',
      'topicType',
      'tags'
    ])
  },
  watch: {
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
  background-color: #ffffff;
  border-radius: 4px;
  box-sizing: border-box;
  padding: 20px 10px;
  z-index: 1;

  .post-article {
    color: #858dda;
    cursor: pointer;
    user-select: none;
    display: inline-block;

    &.disable {
      cursor: not-allowed;
    }
  }

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
      object-fit: cover;
    }

    .selected {
      border: 2px solid #99a2ff;
    }
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

<style>
@media screen and (max-width: 550px) {
  div.mobile-editor-publish-modal .modal-wrapper {
    width: 100%;
    height: 100vh;
    padding-bottom: 0;
    overflow: hidden;
  }
  .mobile-editor-publish-modal .modal-wrapper .modal-container {
    width: 100%;
    height: 100%;
  }
}
</style>
