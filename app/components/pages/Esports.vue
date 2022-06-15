<template>
  <div class="esports-container">
    <app-header />
    <h1 class="area-title">
      GameFi大会一覧
    </h1>
    <div class="area-contents">
      <div v-for="item in items" class="esports">
        <nuxt-link :to="item.articleUrl" class="esports-link">
          <img class="image" :src="`/d/nuxt/dist/img/static/esports/${item.imageSrc}`">
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
/* eslint-disable */
import AppHeader from '../organisms/AppHeader'
import AppFooter from '../organisms/AppFooter'

export default {
  components: {
    AppHeader,
    AppFooter
  },
  data() {
    return {
      items: [
        {
          imageSrc: 'illuvium.png',
          articleUrl: '/uniquejp/articles/aZq9eJPzJ1ob',
          description: '【国内初】illuviumのイベント開催！エントリー募集中！'
        },
        {
          imageSrc: 'blankos.png',
          articleUrl: '/uniquejp/articles/KJNWgB4Jrwdx',
          description: 'Blankos block part国内イベント開催中！'
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.esports-container {
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

.esports {
  width: 500px;
  margin: 20px;

  .esports-link {
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
  .esports-container {
    grid-template-rows: 100px 30px 70px minmax(0, 1fr) 75px;
    grid-template-columns: 80px minmax(0, 1fr) 80px;
  }
}

@media screen and (max-width: 550px) {
  .esports-container {
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

  .esports {
    width: calc(100% - 20px);
    margin: 10px;

    .esports-link {
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
