<template>
  <div class="notification-list-container" @scroll="infiniteScroll">
    <app-header showDefaultHeaderNav class="logo-original"/>
    <h1 class="area-title">{{ title }}</h1>
    <notification-card-list :notifications="notifications"/>
    <the-loader :lastEvaluatedKey="notificationsLastEvaluatedKey"/>
    <app-footer/>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import AppHeader from '../organisms/AppHeader'
import NotificationCardList from '../organisms/NotificationCardList'
import TheLoader from '../atoms/TheLoader'
import AppFooter from '../organisms/AppFooter'

export default {
  components: {
    AppHeader,
    NotificationCardList,
    TheLoader,
    AppFooter
  },
  computed: {
    title() {
      return 'お知らせ'
    },
    ...mapGetters('user', ['notifications', 'notificationsLastEvaluatedKey'])
  },
  mounted() {
    if (this.articleListScrollHeight) {
      this.$el.scrollTop = this.articleListScrollHeight
    }
  },
  beforeDestroy() {
    this.setArticleListScrollHeight({ scrollHeight: this.$el.scrollTop })
  },
  methods: {
    infiniteScroll(event) {
      if (event.target.scrollTop + event.target.offsetHeight >= event.target.scrollHeight - 10) {
        this.getNotifications()
      }
    },
    ...mapActions('user', ['getNotifications']),
    ...mapActions('presentation', ['setArticleListScrollHeight'])
  }
}
</script>

<style lang="scss" scoped>
.notification-list-container {
  background-size: contain;
  display: grid;
  /* prettier-ignore */
  grid-template-areas:
    "app-header  app-header             app-header"
    "...         title                  ...       "
    "...         notification-card-list ...       "
    "...         loader                 ...       "
    "app-footer  app-footer             app-footer";
  grid-template-columns: 1fr 710px 1fr;
  grid-template-rows: 100px 80px 1fr 75px 75px;
  height: 100vh;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.area-title {
  font-size: 25px;
  grid-area: title;
  letter-spacing: 0.05em;
}

@media screen and (max-width: 1296px) {
  .notification-list-container {
    grid-template-columns: 1fr 710px 1fr;
  }
}

@media screen and (max-width: 920px) {
  .notification-list-container {
    grid-template-columns: 1fr 340px 1fr;
  }
}

@media screen and (max-width: 550px) {
  .notification-list-container {
    grid-template-columns: 1fr 350px 1fr;
  }
}

@media screen and (max-width: 370px) {
  .notification-list-container {
    grid-template-columns: 10px 1fr 10px;
  }
}
</style>
