<template>
  <app-modal title>
    <div slot="modal-content">
      <labo-n-license-token-certificate-modal-content />
    </div>
  </app-modal>
</template>

<script>
import AppModal from '../atoms/AppModal'
import LaboNLicenseTokenCertificateModalContent from '../molecules/LaboNLicenseTokenCertificateModalContent'

export default {
  components: {
    AppModal,
    LaboNLicenseTokenCertificateModalContent
  }
}
</script>
