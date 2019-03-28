<template>
  <app-modal title="購入内容の確認">
    <div slot="modal-content">
      <confirm-purchase-article-modal-content />
    </div>
  </app-modal>
</template>

<script>
import AppModal from '../atoms/AppModal'
import ConfirmPurchaseArticleModalContent from '../molecules/ConfirmPurchaseArticleModalContent'

export default {
  components: {
    AppModal,
    ConfirmPurchaseArticleModalContent
  }
}
</script>
