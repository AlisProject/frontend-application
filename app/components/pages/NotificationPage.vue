<template>
  <div class="notification-list-container">
    <app-header />
    <h1 class="area-title">{{ title }}</h1>
    <notification-card-list :notifications="notifications"/>
    <the-loader :isLoading="hasNotificationsLastEvaluatedKey"/>
    <app-footer/>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import AppHeader from '../organisms/AppHeader'
import NotificationCardList from '../organisms/NotificationCardList'
import TheLoader from '../atoms/TheLoader'
import AppFooter from '../organisms/AppFooter'
import { isPageScrollable } from '~/utils/client'

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
    ...mapGetters('user', ['notifications', 'hasNotificationsLastEvaluatedKey']),
    ...mapGetters('presentation', ['notificationListScrollHeight'])
  },
  mounted() {
    window.addEventListener('scroll', this.infiniteScroll)

    if (this.notificationListScrollHeight) {
      this.$el.scrollTop = this.notificationListScrollHeight
    }
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.infiniteScroll)
    this.setNotificationListScrollHeight({ scrollHeight: this.$el.scrollTop })
  },
  data() {
    return {
      canLoadNextNotifications: true,
      isFetchingNotifications: false
    }
  },
  methods: {
    async infiniteScroll(event) {
      if (this.isFetchingNotifications) return
      try {
        this.isFetchingNotifications = true
        if (
          !this.canLoadNextNotifications ||
          window.innerHeight + window.pageYOffset < document.body.offsetHeight - 10
        ) {
          return
        }

        await this.getNotifications()
        this.canLoadNextNotifications = this.hasNotificationsLastEvaluatedKey
      } finally {
        this.isFetchingNotifications = false
      }
    },
    ...mapActions('user', ['getNotifications']),
    ...mapActions('presentation', ['setNotificationListScrollHeight'])
  },
  watch: {
    async notifications() {
      // ページの初期化時に取得した要素よりも画面の高さが高いとき、ページがスクロールできない状態になるため、
      // 画面の高さに合うまで要素を取得する。

      // 取得したデータが反映されるまで待つ
      await this.$nextTick()
      // 画面の高さに合っているかをスクロールできるかどうかで判定
      if (isPageScrollable(this.$el) || !this.hasNotificationsLastEvaluatedKey) return
      this.getNotifications()
    }
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
  grid-template-columns: 1fr 640px 1fr;
  grid-template-rows: 100px 50px 1fr 75px 75px;
}

.area-title {
  font-size: 20px;
  grid-area: title;
  letter-spacing: 1.33px;
  margin: 0;
}

@media screen and (max-width: 920px) {
  .notification-list-container {
    grid-template-columns: 1fr 70% 1fr;
  }
}

@media screen and (max-width: 640px) {
  .notification-list-container {
    grid-template-columns: 1fr 340px 1fr;
    grid-template-rows: 100px 40px 1fr 75px min-content;
  }

  .area-title {
    font-size: 16px;
  }
}

@media screen and (max-width: 370px) {
  .notification-list-container {
    grid-template-columns: 10px 1fr 10px;
  }
}
</style>
