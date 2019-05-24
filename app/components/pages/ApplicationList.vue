<template>
  <div class="application-list-container">
    <app-header />
    <div class="area-applications">
      <h1 class="title">
        登録中のアプリケーション一覧
      </h1>
      <div class="applications">
        <template v-if="hasApplication">
          <nuxt-link
            v-for="application in applications"
            :key="application.clientId"
            class="application"
            :to="`/me/settings/applications/${application.clientId}/edit`"
          >
            クライアント名：<span class="client-name">{{ application.clientName }}</span>
          </nuxt-link>
        </template>
        <p v-else class="no-application">
          登録中のアプリケーションがありません
        </p>
      </div>
      <app-button class="submit-button" :disabled="!isRegisterable">
        <nuxt-link to="/me/settings/applications/new" :event="!isRegisterable ? '' : 'click'">
          アプリケーションを登録する
        </nuxt-link>
      </app-button>
    </div>
    <app-footer />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import AppHeader from '../organisms/AppHeader'
import AppButton from '../atoms/AppButton'
import AppFooter from '../organisms/AppFooter'

export default {
  components: {
    AppHeader,
    AppButton,
    AppFooter
  },
  computed: {
    isRegisterable() {
      return this.applications.length < 5
    },
    hasApplication() {
      return this.applications.length > 0
    },
    ...mapGetters('user', ['applications'])
  }
}
</script>

<style lang="scss" scoped>
.application-list-container {
  display: grid;
  grid-row-gap: 20px;
  /* prettier-ignore */
  grid-template-areas:
    "app-header app-header   app-header"
    "...        applications ...       "
    "app-footer app-footer   app-footer";
  grid-template-columns: 1fr 640px 1fr;
  grid-template-rows: 100px auto 75px;
  min-height: 100vh;
}

.area-applications {
  grid-area: applications;
  display: flex;
  flex-direction: column;
}

.title {
  color: #030303;
  font-size: 20px;
  font-weight: 500;
  letter-spacing: 5px;
  text-align: center;
}

.applications {
  width: 100%;
  margin-top: 60px;
  display: flex;
  flex-direction: column;
}

.application {
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.15);
  box-sizing: border-box;
  color: #030303;
  font-size: 14px;
  margin-bottom: 12px;
  padding: 12px;
  text-decoration: none;
  width: 100%;
}

.no-application {
  color: #030303;
  font-size: 14px;
  font-weight: bold;
  letter-spacing: 0.8px;
  margin-bottom: 30px;
  text-align: center;
}

.client-name {
  color: #6e6e6e;
}

.submit-button {
  margin: 30px auto;
}
</style>
