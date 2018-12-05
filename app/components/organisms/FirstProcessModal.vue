<template>
  <app-modal title>
    <div slot="modal-content">
      <first-process-liked-article-modal v-if="isLikedArticleModal" />
      <first-process-tipped-article-modal v-if="isTippedArticleModal" />
      <first-process-got-token-modal v-if="isGotTokenModal" />
    </div>
  </app-modal>
</template>

<script>
import { mapGetters } from 'vuex'
import AppModal from '../atoms/AppModal'
import FirstProcessLikedArticleModal from '../molecules/FirstProcessLikedArticleModal'
import FirstProcessTippedArticleModal from '../molecules/FirstProcessTippedArticleModal'
import FirstProcessGotTokenModal from '../molecules/FirstProcessGotTokenModal'

export default {
  components: {
    AppModal,
    FirstProcessLikedArticleModal,
    FirstProcessTippedArticleModal,
    FirstProcessGotTokenModal
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
    ...mapGetters('user', ['firstProcessModal'])
  }
}
</script>
