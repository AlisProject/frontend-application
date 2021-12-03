<template>
  <app-modal :title="'下書き記事の削除'" :show-modal-content="articleDeleteModal.isShow">
    <div slot="modal-content">
      <article-delete-confirmation-modal />
    </div>
  </app-modal>
</template>

<script>
import { mapGetters } from 'vuex'
import AppModal from '../atoms/AppModal'
import ArticleDeleteConfirmationModal from '../molecules/ArticleDeleteConfirmationModal'

export default {
  components: {
    AppModal,
    ArticleDeleteConfirmationModal
  },
  computed: {
    isConfirmationModal() {
      return this.articleDeleteConfirmModal.isConfirmationModal
    },
    ...mapGetters('articleModals', ['articleDeleteModal'])
  }
}
</script>
