<template>
  <app-modal title="PROFILE" @close="resetStates">
    <div slot="modal-content">
      <profile-settings-modal-form />
    </div>
  </app-modal>
</template>

<script>
import { mapActions } from 'vuex'
import AppModal from '../atoms/AppModal'
import ProfileSettingsModalForm from '../molecules/ProfileSettingsModalForm'

export default {
  components: {
    AppModal,
    ProfileSettingsModalForm
  },
  methods: {
    resetStates() {
      this.$v.profileSettingsModal.$reset()
      this.hideProfileSettingsErrors()
    },
    ...mapActions('user', ['hideProfileSettingsErrors'])
  },
  validations: {
    profileSettingsModal: {}
  }
}
</script>
