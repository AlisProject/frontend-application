<template>
  <story :story="story"/>
</template>

<script>
import Story from '~/components/pages/Story'

export default {
  components: {
    Story
  },
  data() {
    return {
      story: {
        id: 1,
        title: 'Whitepaperの要点を3分でお伝えする',
        body:
          '<p>多くのユーザーの皆様からALISに関する反響をいただくことができ、本当に嬉しく思います。一方で我々の至らない点があり、特にホワイトペーパーに関してはすべて読むのが難しいというお声を多数いただきま...</p>',
        tags: [
          { id: '1', name: '仮想通貨' },
          { id: '2', name: 'イーサリアム' },
          { id: '3', name: 'ブロックチェーン' },
          { id: '4', name: 'ICO' },
          { id: '5', name: 'ソーシャルメディア' }
        ],
        user: {
          username: '山田 太郎'
        },
        createdAt: '2017/12/11',
        tokenAmount: 1660,
        imageUrl: '~assets/story1.png'
      }
    }
  }
}
</script>
