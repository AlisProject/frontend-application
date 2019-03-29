<template>
  <select-paypart />
</template>

<script>
import SelectPaypart from '~/components/pages/SelectPaypart'

export default {
  components: {
    SelectPaypart
  },
  fetch({ store, redirect }) {
    const { price, title, body } = store.state.user.selectPayment
    if (price === '0' || !title || !body) redirect('/')
  }
}
</script>
