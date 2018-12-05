<template>
  <app-modal title>
    <div slot="modal-content">
      <first-process-liked-article-modal v-if="isLikedArticleModal" />
      <first-process-tipped-article-modal v-if="isTippedArticleModal" />
      <first-process-got-token-modal v-if="isGotTokenModal" />
      <first-process-created-article-modal v-if="isCreatedArticleModal" />
    </div>
  </app-modal>
</template>

<script>
import { mapGetters } from 'vuex'
import AppModal from '../atoms/AppModal'
import FirstProcessLikedArticleModal from '../molecules/FirstProcessLikedArticleModal'
import FirstProcessTippedArticleModal from '../molecules/FirstProcessTippedArticleModal'
import FirstProcessGotTokenModal from '../molecules/FirstProcessGotTokenModal'
import FirstProcessCreatedArticleModal from '../molecules/FirstProcessCreatedArticleModal'

export default {
  components: {
    AppModal,
    FirstProcessLikedArticleModal,
    FirstProcessTippedArticleModal,
    FirstProcessGotTokenModal,
    FirstProcessCreatedArticleModal
  },
  computed: {
    isLikedArticleModal() {
      return this.firstProcessModal.isLikedArticleModal
    },
    isTippedArticleModal() {
      return this.firstProcessModal.isTippedArticleModal
    },
    isGotTokenModal() {
      return this.firstProcessModal.isGotTokenModal
    },
    isCreatedArticleModal() {
      return this.firstProcessModal.isCreatedArticleModal
    },
    ...mapGetters('user', ['firstProcessModal'])
  }
}
</script>
