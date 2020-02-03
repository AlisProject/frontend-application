<template>
  <app-modal
    :title="badgeDescriptionModal.metadata.name"
    :show-modal-content="badgeDescriptionModal.isShow"
  >
    <div slot="modal-content">
      <badge-description-modal-content />
    </div>
  </app-modal>
</template>

<script>
import { mapGetters } from 'vuex'
import AppModal from '../atoms/AppModal'
import BadgeDescriptionModalContent from '../molecules/BadgeDescriptionModalContent'

export default {
  components: {
    AppModal,
    BadgeDescriptionModalContent
  },
  computed: {
    ...mapGetters('badge', ['badgeDescriptionModal'])
  }
}
</script>
