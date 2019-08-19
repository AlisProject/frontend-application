<template>
  <app-modal title>
    <div slot="modal-content">
      <labo-n-license-token-transfer-modal-content />
    </div>
  </app-modal>
</template>

<script>
import AppModal from '../atoms/AppModal'
import LaboNLicenseTokenTransferModalContent from '../molecules/LaboNLicenseTokenTransferModalContent'

export default {
  components: {
    AppModal,
    LaboNLicenseTokenTransferModalContent
  }
}
</script>
