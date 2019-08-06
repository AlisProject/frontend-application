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
    title: 'ミュートユーザー一覧',
    meta: [
      {
        hid: 'og:title',
        property: 'og:title',
        content: 'ミュートユーザー一覧 | ALIS'
      },
      {
        hid: 'og:description',
        property: 'og:description',
        content: 'ミュートユーザー一覧'
      }
    ]
  }
}
</script>
