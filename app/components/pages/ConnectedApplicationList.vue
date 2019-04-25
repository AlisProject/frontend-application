<template>
  <div class="connected-application-list-container">
    <app-header />
    <div class="area-applications">
      <h1 class="title">
        連携中のアプリケーション一覧
      </h1>
      <!-- TODO: アプリケーションが一つもない場合の画面作成 -->
      <div class="applications">
        <div
          v-for="application in connectedApplications"
          :key="application.clientId"
          class="application"
        >
          <div class="app-info">
            <div class="client-name">
              {{ application.clientName }}
            </div>
            <div class="description">
              {{ application.description }}
            </div>
            <div class="created-at">
              {{ application.createdAt | formatDate }}
            </div>
          </div>
          <app-button type="secondary" class="delete-button">
            削除する
          </app-button>
        </div>
      </div>
    </div>
    <app-footer />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import AppHeader from '../organisms/AppHeader'
import AppButton from '../atoms/AppButton'
import AppFooter from '../organisms/AppFooter'
import { formatDate } from '~/utils/format'

export default {
  components: {
    AppHeader,
    AppButton,
    AppFooter
  },
  computed: {
    ...mapGetters('user', ['connectedApplications'])
  },
  filters: {
    formatDate
  }
}
</script>

<style lang="scss" scoped>
.connected-application-list-container {
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
  margin: 10px 0 0;
}

.applications {
  width: 100%;
  margin-top: 60px;
  display: flex;
  flex-direction: column;
}

.application {
  display: flex;
  flex-direction: row;
  border-bottom: 1px solid rgba(206, 206, 206, 0.3);
  padding: 20px 0;

  &:last-child {
    border-bottom: none;
  }
}

.app-info {
  width: 496px;
}

.client-name {
  color: #030303;
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 8px;
}

.description {
  color: #6e6e6e;
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 4px;
}

.created-at {
  color: #6e6e6e;
  font-size: 14px;
  line-height: 1.5;
}

.delete-button {
  border-radius: 4px;
  color: #fff;
  font-size: 14px;
  font-weight: bold;
  height: 34px;
  line-height: 2.5;
  text-align: center;
  width: 96px;
  margin: 24px 0 0 48px;
}

@media screen and (max-width: 640px) {
  .connected-application-list-container {
    grid-template-rows: 100px auto min-content;
    grid-template-columns: 20px 1fr 20px;
  }

  .application {
    flex-direction: column;
  }

  .app-info {
    width: 100%;
  }

  .delete-button {
    margin: 24px 0 0 auto;
  }
}

@media screen and (max-width: 550px) {
  .connected-application-list-container {
    grid-template-rows: 66px auto min-content;
  }

  .applications {
    margin-top: 40px;
  }

  .title {
    font-size: 14px;
    letter-spacing: 0.8px;
    margin: 10px 0 0;
  }
}
</style>
