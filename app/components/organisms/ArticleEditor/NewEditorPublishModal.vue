<template>
  <app-modal
    title="公開情報の確認"
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
              :class="{ 'selected': thumbnail.payload.src === selectedThumbnail }"
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
            :disabled="!publishable">
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
import TagsInputForm from '~/components/molecules/TagsInputForm'

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
      topic: null,
      isInvalidTag: false,
      selectedThumbnail: null
    }
  },
  async created() {
    await this.getTopics()
  },
  destroyed() {
    this.resetArticleTopic()
  },
  methods: {
    handleCloseModal() {
      this.$emit('close')
    },
    async publish() {
      this.$emit('publish', {
        topic: this.topic.name,
        tags: this.tags.map((tag) => tag.text),
        thumbnail: this.selectedThumbnail
      })
    },
    selectThumbnail(thumbnail) {
      this.selectedThumbnail = thumbnail.payload.src
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
      'publishDraftArticle',
      'republishPublicArticle',
      'putDraftArticle',
      'putPublicArticle',
      'updateSuggestedThumbnails',
      'postArticleImage',
      'updateBody',
      'getTopics',
      'resetArticleTopic',
      'setArticleTopic'
    ])
  },
  computed: {
    publishable() {
      return !this.isEdited && !this.isSaving && this.topicType && this.selectedThumbnail
    },
    ...mapGetters('article', [
      'articleId',
      'title',
      'body',
      'isSaving',
      'isEdited',
      'topics',
      'topicType',
      'tags'
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

.mobile-editor-publish-modal {
  z-index: 100;
}

.area-post-article {
  background-color: #ffffff;
  border-radius: 4px;
  box-sizing: border-box;
  padding: 20px 10px;
  z-index: 1;
  flex-direction: column;

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
