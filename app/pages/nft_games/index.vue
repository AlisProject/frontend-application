<template>
  <nft-games />
</template>

<script>
  import NftGames from '~/components/pages/NftGames'

  export default {
    components: {
      NftGames
    },
    head: {
      title: 'NFTゲーム-ランキング',
      link: [{
        rel: 'stylesheet',
        href: 'https://unpkg.com/vue-easytable/libs/theme-default/index.css'
      }],
      meta: [
        {
          hid: 'og:title',
          property: 'og:title',
          content: 'NFTゲーム-ランキング | ALIS'
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: 'NFTゲーム-ランキング'
        }
      ]
    }
  }
</script>
