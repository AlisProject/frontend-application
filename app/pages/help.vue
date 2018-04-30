<template>
  <help-page/>
</template>

<script>
import HelpPage from '~/components/pages/HelpPage'

export default {
  components: {
    HelpPage
  },
  head: {
    title: 'ヘルプ',
    meta: [
      {
        hid: 'og:title',
        property: 'og:title',
        content: 'ヘルプ | ALIS'
      },
      {
        hid: 'og:description',
        property: 'og:description',
        content: 'ヘルプ'
      }
    ]
  }
}
</script>
