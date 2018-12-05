<template>
  <app-modal title>
    <div slot="modal-content">
      <first-process-liked-article-modal v-if="isLikedArticleModal" />
    </div>
  </app-modal>
</template>

<script>
import { mapGetters } from 'vuex'
import AppModal from '../atoms/AppModal'
import FirstProcessLikedArticleModal from '../molecules/FirstProcessLikedArticleModal'

export default {
  components: {
    AppModal,
    FirstProcessLikedArticleModal
  },
  computed: {
    isLikedArticleModal() {
      return this.firstProcessModal.isLikedArticleModal
    },
    ...mapGetters('user', ['firstProcessModal'])
  }
}
</script>
