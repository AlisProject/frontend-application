<template>
  <app-modal title="" class="cover-screen">
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
