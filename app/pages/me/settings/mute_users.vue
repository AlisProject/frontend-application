<template>
  <mute-user-list />
</template>

<script>
import MuteUserList from '~/components/pages/MuteUserList'

export default {
  components: {
    MuteUserList
  },
  head: {
    title: 'ミュートしたユーザー',
    meta: [
      {
        hid: 'og:title',
        property: 'og:title',
        content: 'ミュートしたユーザー | ALIS'
      },
      {
        hid: 'og:description',
        property: 'og:description',
        content: 'ミュートしたユーザー'
      }
    ]
  }
}
</script>
