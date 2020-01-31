<template>
  <badge-list />
</template>

<script>
import BadgeList from '~/components/pages/BadgeList'

export default {
  components: {
    BadgeList
  },
  async fetch({ store, params }) {
    await store.dispatch('user/setUserInfo', { userId: params.userId })
  },
  head: {
    title: 'バッジ一覧'
  }
}
</script>
