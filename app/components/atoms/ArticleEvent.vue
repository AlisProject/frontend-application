<template>
  <div class="area-event-info" :style="eventInfoStyle">
    <div class="event-info">
      <img class="area-icon" :alt="eventInfo.iconCaption" :src="eventInfo.iconUrl">
      <div class="area-name">
        {{ eventInfo.name }}(PR)
      </div>
      <div class="area-description">
        {{ eventInfo.description }}
      </div>
      <div class="area-link-button">
        <app-button class="official-article">
          <nuxt-link to="/tag/クリプトモン">
            コミュニティ・ページ
          </nuxt-link>
        </app-button>
        <app-button class="official-site">
          <nuxt-link :to="eventInfo.officialPageUrl" target="_blank">
            オフィシャルサイト <i class="fas fa-external-link-alt" />
          </nuxt-link>
        </app-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import AppButton from '../atoms/AppButton'

export default {
  components: {
    AppButton
  },
  computed: {
    eventInfo() {
      return this.eventsInfo.find((eventInfo) => eventInfo.key === 'クリプトモン')
    },
    eventInfoStyle() {
      return {
        '--banner-background': `#fff url(${this.eventInfo.bannerUrl}) no-repeat`,
        '--banner-background-sp': `#fff url(${this.eventInfo.bannerSpUrl}) no-repeat`
      }
    },
    ...mapGetters('article', ['tagArticles', 'eventsInfo'])
  },
  mounted() {
    // google optimize
    window.dataLayer.push({
      event: 'optimize.activate',
      key: this.eventInfo.key
    })
  }
}
</script>

<style lang="scss" scoped>
.area-event-info {
  grid-area: article-registration;
  margin-top: -40px;
  position: relative;
  text-decoration: none;

  .event-info {
    display: grid;
    grid-template-columns: 60px 410px 170px;
    grid-template-rows: 26px 34px;
    /* prettier-ignore */
    grid-template-areas:
        "event-icon event-name        event-link-button"
        "event-icon event-description event-link-button";
    height: 60px;
    margin-top: 30px;

    .area-icon {
      grid-area: event-icon;
      background-size: 58px;
      text-align: center;
      width: 100%;
      height: 100%;
    }
    .area-name {
      grid-area: event-name;
      font-size: 18px;
      color: #030303;
      font-weight: bold;
      letter-spacing: 0.25px;
      margin: 0 15px 0 15px;
    }
    .area-description {
      grid-area: event-description;
      font-size: 12px;
      color: #6e6e6e;
      overflow: hidden;
      text-align: left;
      text-overflow: ellipsis;
      word-break: break-all;
      margin: 5px 10px 0 15px;
    }
    .area-link-button {
      grid-area: event-link-button;
      .official-article {
        border-radius: 4px;
        box-shadow: none;
        font-size: 14px;
        font-weight: bold;
        height: 26px;
        line-height: 26px;
        width: 100%;
        background: #df772b;
        &:hover,
        &:focus {
          background: #df772b;
        }
      }
      .official-site {
        border-radius: 4px;
        box-shadow: none;
        font-size: 14px;
        font-weight: bold;
        height: 26px;
        line-height: 26px;
        width: 100%;
        margin-top: 8px;
        &:hover,
        &:focus {
          background: #0086cc;
        }
      }
    }
  }
}

@media screen and (max-width: 640px) {
  .area-event-info {
    box-shadow: none;
    padding: 0 0 0 0;
    margin-top: -10px;

    .event-info {
      grid-template-columns: 73px minmax(0, 1fr);
      grid-template-rows: 14px 57px 70px;
      /* prettier-ignore */
      grid-template-areas:
          "event-icon        event-name       "
          "event-icon        event-description"
          "event-link-button event-link-button";
      margin-top: 8px;
      height: 170px;

      .area-icon {
        background-position: top;
        width: 100%;
        height: 100%;
      }
      .area-name {
        grid-area: event-name;
        font-size: 12px;
        color: #030303;
        font-weight: bold;
        letter-spacing: 0.25px;
        margin: 0 15px 0 15px;
      }
      .area-description {
        grid-area: event-description;
        font-size: 12px;
        color: #6e6e6e;
        overflow: hidden;
        text-align: left;
        text-overflow: ellipsis;
        word-break: break-all;
        margin: 2px 0 0 15px;
      }
      .area-sns {
        .sns-icon {
          font-size: 16px;
        }
      }
      .area-link-button {
        grid-area: event-link-button;
        .official-article {
          font-size: 12px;
          height: 21px;
          line-height: 21px;
          width: 100%;
          margin-top: 10px;
        }
        .official-site {
          font-size: 12px;
          height: 21px;
          line-height: 21px;
          width: 100%;
          margin-top: 7px;
        }
      }
    }
  }
}
</style>
