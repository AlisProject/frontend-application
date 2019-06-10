<template>
  <app-modal title="公開情報の確認">
    <div slot="modal-content">
      <mobile-editor-header-post-article-modal-content />
    </div>
  </app-modal>
</template>

<script>
import AppModal from '../atoms/AppModal'
import MobileEditorHeaderPostArticleModalContent from '../molecules/MobileEditorHeaderPostArticleModalContent'

export default {
  components: {
    AppModal,
    MobileEditorHeaderPostArticleModalContent
  }
}
</script>
