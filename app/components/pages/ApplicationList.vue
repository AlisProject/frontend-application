<template>
  <div class="application-list-container">
    <app-header />
    <div class="area-applications">
      <h1 class="title">
        登録中のアプリケーション一覧
      </h1>
      <app-button class="submit-button">
        <nuxt-link to="/me/settings/applications/new">
          アプリケーションを登録する
        </nuxt-link>
      </app-button>
    </div>
    <app-footer />
  </div>
</template>

<script>
import AppHeader from '../organisms/AppHeader'
import AppButton from '../atoms/AppButton'
import AppFooter from '../organisms/AppFooter'

export default {
  components: {
    AppHeader,
    AppButton,
    AppFooter
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
  align-items: center;
}

.title {
  color: #030303;
  font-size: 20px;
  font-weight: 500;
  letter-spacing: 5px;
  text-align: center;
}

.submit-button {
  margin: 30px auto;
}
</style>
