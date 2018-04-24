<template>
  <privacy-policy/>
</template>

<script>
import PrivacyPolicy from '~/components/pages/PrivacyPolicy'

export default {
  components: {
    PrivacyPolicy
  },
  head: {
    title: 'プライバシーポリシー',
    meta: [
      {
        hid: 'og:title',
        name: 'og:title',
        content: 'プライバシーポリシー | ALIS'
      },
      {
        hid: 'og:description',
        name: 'og:description',
        content: 'プライバシーポリシー'
      }
    ]
  }
}
</script>
