<template>
  <create-application />
</template>

<script>
import CreateApplication from '~/components/pages/CreateApplication'
import { isMobile } from '~/utils/device'

export default {
  components: {
    CreateApplication
  },
  mounted() {
    if (isMobile()) this.$router.replace('/')
  }
}
</script>
