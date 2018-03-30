<template>
  <div />
</template>

<script>
export default {
  async created() {
    const { code, user } = this.$route.query
    try {
      const result = await this.$store.dispatch('user/confirmEmail', { code, user })
      if (result === 'SUCCESS') location.href = '/signup-login'
    } catch (error) {
      console.error(error)
    }
  }
}
</script>
