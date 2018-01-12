<template>
  <div class="top-container">
    <app-header/>
    <story-card-list :stories="stories"/>
    <app-footer/>
  </div>
</template>

<script>
import AppHeader from '../organisms/AppHeader'
import StoryCardList from '../organisms/StoryCardList'
import AppFooter from '../organisms/AppFooter'

export default {
  components: {
    AppHeader,
    StoryCardList,
    AppFooter
  },
  data() {
    return {
      stories: [
        {
          id: 1,
          title: 'Whitepaperの要点を3分でお伝えする',
          body:
            '多くのユーザーの皆様からALISに関する反響をいただくことができ、本当に嬉しく思います。一方で我々の至らない点があり、特にホワイトペーパーに関してはすべて読むのが難しいというお声を多数いただきま...',
          username: '山田 太郎',
          createdAt: '2017/12/11',
          tokenAmount: 1660,
          imageUrl: '~assets/story1.png'
        },
        {
          id: 2,
          title: 'ASICでビットコインをマイニングした際の期待値を計算してみた',
          body:
            '多くのユーザーの皆様からALISに関する反響をいただくことができ、本当に嬉しく思います。一方で我々の至らない点があり、特にホワイトペーパーに関してはすべて読むのが難しいというお声を多数いただきま...',
          username: '岸本 綾子',
          createdAt: '2017/12/11',
          tokenAmount: 1280,
          imageUrl: '~assets/story1.png'
        },
        {
          id: 3,
          title: 'ASICでビットコインをマイニングした際の期待値を計算してみた',
          body:
            '多くのユーザーの皆様からALISに関する反響をいただくことができ、本当に嬉しく思います。一方で我々の至らない点があり、特にホワイトペーパーに関してはすべて読むのが難しいというお声を多数いただきま...',
          username: '岸本 綾子',
          createdAt: '2017/12/11',
          tokenAmount: 1280,
          imageUrl: '~assets/story1.png'
        },
        {
          id: 4,
          title: 'ASICでビットコインをマイニングした際の期待値を計算してみた',
          body:
            '多くのユーザーの皆様からALISに関する反響をいただくことができ、本当に嬉しく思います。一方で我々の至らない点があり、特にホワイトペーパーに関してはすべて読むのが難しいというお声を多数いただきま...',
          username: '岸本 綾子',
          createdAt: '2017/12/11',
          tokenAmount: 1280,
          imageUrl: '~assets/story1.png'
        },
        {
          id: 5,
          title: 'ASICでビットコインをマイニングした際の期待値を計算してみた',
          body:
            '多くのユーザーの皆様からALISに関する反響をいただくことができ、本当に嬉しく思います。一方で我々の至らない点があり、特にホワイトペーパーに関してはすべて読むのが難しいというお声を多数いただきま...',
          username: '岸本 綾子',
          createdAt: '2017/12/11',
          tokenAmount: 1280,
          imageUrl: '~assets/story1.png'
        },
        {
          id: 6,
          title: 'ASICでビットコインをマイニングした際の期待値を計算してみた',
          body:
            '多くのユーザーの皆様からALISに関する反響をいただくことができ、本当に嬉しく思います。一方で我々の至らない点があり、特にホワイトペーパーに関してはすべて読むのが難しいというお声を多数いただきま...',
          username: '岸本 綾子',
          createdAt: '2017/12/11',
          tokenAmount: 1280,
          imageUrl: '~assets/story1.png'
        },
        {
          id: 7,
          title: 'ASICでビットコインをマイニングした際の期待値を計算してみた',
          body:
            '多くのユーザーの皆様からALISに関する反響をいただくことができ、本当に嬉しく思います。一方で我々の至らない点があり、特にホワイトペーパーに関してはすべて読むのが難しいというお声を多数いただきま...',
          username: '岸本 綾子',
          createdAt: '2017/12/11',
          tokenAmount: 1280,
          imageUrl: '~assets/story1.png'
        },
        {
          id: 8,
          title: 'ASICでビットコインをマイニングした際の期待値を計算してみた',
          body:
            '多くのユーザーの皆様からALISに関する反響をいただくことができ、本当に嬉しく思います。一方で我々の至らない点があり、特にホワイトペーパーに関してはすべて読むのが難しいというお声を多数いただきま...',
          username: '岸本 綾子',
          createdAt: '2017/12/11',
          tokenAmount: 1280,
          imageUrl: '~assets/story1.png'
        },
        {
          id: 9,
          title: 'ASICでビットコインをマイニングした際の期待値を計算してみた',
          body:
            '多くのユーザーの皆様からALISに関する反響をいただくことができ、本当に嬉しく思います。一方で我々の至らない点があり、特にホワイトペーパーに関してはすべて読むのが難しいというお声を多数いただきま...',
          username: '岸本 綾子',
          createdAt: '2017/12/11',
          tokenAmount: 1280,
          imageUrl: '~assets/story1.png'
        },
        {
          id: 10,
          title: 'ASICでビットコインをマイニングした際の期待値を計算してみた',
          body:
            '多くのユーザーの皆様からALISに関する反響をいただくことができ、本当に嬉しく思います。一方で我々の至らない点があり、特にホワイトペーパーに関してはすべて読むのが難しいというお声を多数いただきま...',
          username: '岸本 綾子',
          createdAt: '2017/12/11',
          tokenAmount: 1280,
          imageUrl: '~assets/story1.png'
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.top-container {
  display: grid;
  grid-template-rows: 100px 190px 1fr 75px 75px;
  grid-template-columns: 1fr 1082px 1fr;
  /* prettier-ignore */
  grid-template-areas:
    "app-header  app-header       app-header"
    "...         ...              ...       "
    "...         story-card-list  ...       "
    "...         ...              ...       "
    "...         app-footer       ...       ";
  background: linear-gradient(155deg, #99a1fb 0%, #99a1fb 32.5%, #f7f7f7 32.5%, #f7f7f7 100%);
}
</style>

