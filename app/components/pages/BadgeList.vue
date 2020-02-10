<template>
  <div class="badge-list-container">
    <app-header />
    <user-article-list-user-info :user="isCurrentUser ? currentUserInfo : userInfo" />
    <no-ssr>
      <user-profile-nav :isCurrentUser="isCurrentUser" />
    </no-ssr>
    <the-loader v-if="isLoading" :is-loading="isLoading" />
    <no-ssr>
      <badge-wallet-address v-if="isCurrentUser && walletAddress && !isLoading" />
    </no-ssr>
    <badge-card-list v-if="!isLoading" :isCurrentUser="isCurrentUser" />
    <app-footer />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import AppHeader from '../organisms/AppHeader'
import UserArticleListUserInfo from '../atoms/UserArticleListUserInfo'
import UserProfileNav from '../molecules/UserProfileNav'
import BadgeWalletAddress from '../molecules/BadgeWalletAddress'
import BadgeCardList from '../organisms/BadgeCardList'
import TheLoader from '../atoms/TheLoader'
import AppFooter from '../organisms/AppFooter'

export default {
  components: {
    AppHeader,
    UserArticleListUserInfo,
    UserProfileNav,
    BadgeWalletAddress,
    BadgeCardList,
    TheLoader,
    AppFooter
  },
  data() {
    return {
      isLoading: true
    }
  },
  async created() {
    await this.removeBadgeInfo()
  },
  async mounted() {
    await this.fetchWalletAddress({ userId: this.$route.params.userId })
    if (this.walletAddress) {
      await this.fetchBadges({ walletAddress: this.walletAddress })
    }
    this.isLoading = false
  },
  computed: {
    isCurrentUser() {
      return this.loggedIn && this.$route.params.userId === this.currentUser.userId
    },
    ...mapGetters('user', ['userInfo', 'loggedIn', 'currentUser', 'currentUserInfo']),
    ...mapGetters('badge', ['walletAddress'])
  },
  methods: {
    ...mapActions('badge', ['fetchWalletAddress', 'fetchBadges', 'removeBadgeInfo'])
  }
}
</script>

<style lang="scss" scoped>
.badge-list-container {
  display: grid;
  grid-template-rows: 100px auto auto auto auto minmax(0, 1fr) 75px;
  grid-template-columns: minmax(0, 1fr) 710px minmax(0, 1fr);
  /* prettier-ignore */
  grid-template-areas:
    "app-header app-header        app-header"
    "...        user-info         ...       "
    "...        user-profile-nav  ...       "
    "...        loader            ...       "
    "...        wallet-address    ...       "
    "...        badge-card-list   ...       "
    "app-footer app-footer        app-footer";
  min-height: 100vh;
}

@media screen and (max-width: 920px) {
  .badge-list-container {
    grid-template-columns: minmax(0, 1fr) 340px minmax(0, 1fr);
  }
}

@media screen and (max-width: 550px) {
  .badge-list-container {
    background: #fff;
    grid-template-columns: minmax(0, 1fr) 380px minmax(0, 1fr);
    grid-template-rows: 66px min-content auto auto auto minmax(0, 1fr) min-content;
    grid-row-gap: 20px;
    /* prettier-ignore */
    grid-template-areas:
    "app-header       app-header        app-header      "
    "user-info        user-info         user-info       "
    "user-profile-nav user-profile-nav  user-profile-nav"
    "...              loader            ...             "
    "...              wallet-address    ...             "
    "...              badge-card-list   ...             "
    "app-footer       app-footer        app-footer      ";
  }
}

@media screen and (max-width: 370px) {
  .badge-list-container {
    grid-template-columns: 10px minmax(0, 1fr) 10px;
  }
}
</style>
