<template>
  <app-modal title>
    <div slot="modal-content">
      <restrict-edit-article-modal-content />
    </div>
  </app-modal>
</template>

<script>
import AppModal from '../atoms/AppModal'
import RestrictEditArticleModalContent from '../molecules/RestrictEditArticleModalContent'

export default {
  components: {
    AppModal,
    RestrictEditArticleModalContent
  }
}
</script>
