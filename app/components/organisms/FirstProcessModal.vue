<template>
  <app-modal title>
    <div slot="modal-content">
      <first-process-liked-article-modal v-if="isLikedArticleModal" />
      <first-process-tipped-article-modal v-if="isTippedArticleModal" />
    </div>
  </app-modal>
</template>

<script>
import { mapGetters } from 'vuex'
import AppModal from '../atoms/AppModal'
import FirstProcessLikedArticleModal from '../molecules/FirstProcessLikedArticleModal'
import FirstProcessTippedArticleModal from '../molecules/FirstProcessTippedArticleModal'

export default {
  components: {
    AppModal,
    FirstProcessLikedArticleModal,
    FirstProcessTippedArticleModal
  },
  computed: {
    isLikedArticleModal() {
      return this.firstProcessModal.isLikedArticleModal
    },
    isTippedArticleModal() {
      return this.firstProcessModal.isTippedArticleModal
    },
    ...mapGetters('user', ['firstProcessModal'])
  }
}
</script>
