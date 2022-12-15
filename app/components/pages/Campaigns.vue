<template>
  <div class="campaigns-container">
    <app-header />
    <h1 class="area-title">
      NFTがもらえる一覧
    </h1>
    <div class="area-contents">
      <div v-for="item in campaigns" class="campaign">
        <nuxt-link :to="item.articleUrl" class="campaign-link">
          <img class="image" :src="`/d/nuxt/dist/img/static/campaigns/${item.imageSrc}`">
          <div class="description">
            {{ item.description }}
          </div>
        </nuxt-link>
      </div>
    </div>
    <app-footer />
  </div>
</template>

<script>
import AppHeader from '../organisms/AppHeader'
import AppFooter from '../organisms/AppFooter'

export default {
  components: {
    AppHeader,
    AppFooter
  },
  data() {
    return {
      campaigns: [
        {
          imageSrc: 'lok.png',
          articleUrl: '/ALIS-official/articles/365Rb1VZYWkw',
          description: '先着50名！$49.99の「Ready for Battle Pack」をゲットできるコラボ実施中！'
        },
        {
          imageSrc: 'splinterlands.png',
          articleUrl: '/ALIS-official/articles/3751dAZ9YDLP',
          description: '先着100名！カードパックをゲットできるコラボ実施中！'
        },
        {
          imageSrc: 'cryptospelles.png',
          articleUrl: '/ALIS-official/articles/KOwJdwy0xb9z',
          description: '先着200名！「蒼炎の崇拝者」をゲットできるコラボ実施中！'
        },
        {
          imageSrc: 'liker_badge.png',
          articleUrl: '/ALIS-official/articles/KJNWZJPrLp8b',
          description: 'NFT獲得サービスを開始！「いいね」をしてALIS限定のNFTをゲットしよう！'
        },
        {
          imageSrc: 'writer_badge.png',
          articleUrl: '/ALIS-official/articles/K0Z1P57ELWEb',
          description: '新たなNFT獲得サービスを開始！記事を書いてALIS限定のNFTをゲットしよう！'
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.campaigns-container {
  display: grid;
  grid-template-rows: 100px 30px 70px minmax(0, 1fr) 75px;
  grid-template-columns: minmax(0, 1fr) 1080px minmax(0, 1fr);
  /* prettier-ignore */
  grid-template-areas:
    'app-header       app-header       app-header      '
    '...              ...              ...             '
    '...              title            ...             '
    '...              contents         ...             '
    'app-footer       app-footer       app-footer      ';
  background: white;
}

.area-title {
  grid-area: title;
  font-size: 25px;
  letter-spacing: 0.05em;
  justify-content: center;
  text-align: center;
}

.area-contents {
  grid-area: contents;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  margin-bottom: 350px;
}

.campaign {
  width: 500px;
  margin: 20px;

  .campaign-link {
    color: #6e6e6e;
    text-decoration: none;
  }
  .image {
    width: 500px;
    height: 280px;
  }
  .description {
    margin-top: 16px;
    height: 80px;
  }
}

@media screen and (max-width: 1080px) {
  .campaigns-container {
    grid-template-rows: 100px 30px 70px minmax(0, 1fr) 75px;
    grid-template-columns: 80px minmax(0, 1fr) 80px;
  }
}

@media screen and (max-width: 550px) {
  .campaigns-container {
    grid-template-rows: 70px 10px 50px minmax(0, 1fr) min-content;
    grid-template-columns: 10px minmax(0, 1fr) 10px;
  }

  .area-article {
    grid-template-columns: 8px auto 8px;
    grid-gap: 10px;
    /* prettier-ignore */
    grid-template-areas:
      '...            title             ...           '
      '...            content           ...           ';
  }

  .area-content {
    width: 90vw;
  }

  .area-title {
    font-size: 18px;
    grid-area: title;
    letter-spacing: 0.1em;
  }

  .campaign {
    width: calc(100% - 20px);
    margin: 10px;

    .campaign-link {
      color: #6e6e6e;
      text-decoration: none;
    }
    .image {
      width: 100%;
      height: calc((100vw - 40px) / 16 * 9);
    }
    .description {
    }
  }
}
</style>
