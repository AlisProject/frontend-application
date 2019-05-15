<template>
  <app-modal title="認証コードの確認">
    <div slot="modal-content">
      <input-withdraw-auth-code-modal-form />
    </div>
  </app-modal>
</template>

<script>
import AppModal from '../atoms/AppModal'
import InputWithdrawAuthCodeModalForm from '../molecules/InputWithdrawAuthCodeModalForm'

export default {
  components: {
    AppModal,
    InputWithdrawAuthCodeModalForm
  }
}
</script>
