<template>
  <app-modal title>
    <div slot="modal-content">
      <request-login-modal-content />
    </div>
  </app-modal>
</template>

<script>
import AppModal from '../atoms/AppModal'
import RequestLoginModalContent from '../molecules/RequestLoginModalContent'

export default {
  components: {
    AppModal,
    RequestLoginModalContent
  }
}
</script>
