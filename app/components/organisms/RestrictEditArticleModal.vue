<template>
  <app-modal title="" class="cover-screen">
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
