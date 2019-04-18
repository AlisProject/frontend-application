<template>
  <edit-application />
</template>

<script>
import EditApplication from '~/components/pages/EditApplication'
import { isMobile } from '~/utils/device'

export default {
  components: {
    EditApplication
  },
  mounted() {
    if (isMobile()) this.$router.replace('/')
  }
}
</script>
