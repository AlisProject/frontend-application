<template>
  <div class="oauth-authenticate-container">
    <app-header />
    <div class="area-confirm">
      <h1 class="title">
        以下サービスへ情報の提供を<span class="br" />許可しますか？
      </h1>
      <h2 class="sub-title">
        クライアント名
      </h2>
      <!-- TODO: APIから取得 -->
      <p class="description">
        ほげほげほげほげほげほげほげほげほほげほげほげほげほげほげほ..
      </p>
      <h2 class="sub-title">
        クライアントの説明
      </h2>
      <!-- TODO: APIから取得し、なかった場合の処理を確認（「なし」と表示するなど） -->
      <p class="description mb40">
        ほげほげほげほげほげほげほげほげほほげほげほげほげほげほげほげほげほげほげほほげほげほげほげほげほげほげほげほげほげほげほほげほげほげほげほげほげほげほげほげほげほげほほげほげほげほげほげほげほげほげほ..
      </p>
      <h2 class="sub-title">
        このアプリケーションは次の情報について、取得{{
          isWrite ? '、作成、変更、削除' : ''
        }}が可能です
      </h2>
      <p class="description">
        ・記事情報<br>
        ・コメント情報<br>
        ・トークン情報<br>
        ・プロフィール情報<br>
        ・通知情報<br>
        ・記事、ユーザへの報告情報<br>
        ※今後実行可能になる機能に紐づく情報も含まれております
      </p>
      <h2 class="sub-title">
        このアプリケーションは次の情報へはアクセスできません
      </h2>
      <p class="description">
        ・メールアドレス、パスワード、電話番号<br>
        ・ウォレットの入出金情報
      </p>
      <app-button class="allow-button" @click="allowAccess">
        アクセスを許可する
      </app-button>
      <app-button type="secondary" class="cancel-button">
        <nuxt-link to="/">
          キャンセル
        </nuxt-link>
      </app-button>
    </div>
    <app-footer />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
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
    isWrite() {
      return this.$route.query.scope === 'write'
    }
  },
  methods: {
    async allowAccess() {
      try {
        const {
          call_back_url: callBackUrl,
          client_id: clientId,
          code_challenge: codeChallenge,
          scope
        } = this.$route.query
        const data = {
          response_type: 'code',
          client_id: clientId,
          redirect_uri: callBackUrl,
          scope: `openid ${scope}`,
          code_challenge: codeChallenge,
          code_challenge_method: 'S256'
        }
        const params = new URLSearchParams(data)
        const idToken = this.getIdToken()
        const response = await this.postOAuthAuthorization({ idToken, params })
        // TODO: responseから取得したURLにリダイレクトする処理を追加
        console.log(response)
      } catch (error) {
        console.error(error)
      }
    },
    getIdToken() {
      const clientId = process.env.CLIENT_ID
      const currentUser = localStorage.getItem(
        `CognitoIdentityServiceProvider.${clientId}.LastAuthUser`
      )
      const idToken = localStorage.getItem(
        `CognitoIdentityServiceProvider.${clientId}.${currentUser}.idToken`
      )
      return idToken
    },
    ...mapActions('user', ['postOAuthAuthorization'])
  }
}
</script>

<style lang="scss" scoped>
.oauth-authenticate-container {
  display: grid;
  grid-row-gap: 20px;
  /* prettier-ignore */
  grid-template-areas:
    "app-header app-header  app-header"
    "...        confirm     ...       "
    "app-footer app-footer  app-footer";
  grid-template-columns: 1fr 500px 1fr;
  grid-template-rows: 100px auto 75px;
  min-height: 100vh;
}

.area-confirm {
  grid-area: confirm;
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
  margin: 0 0 40px;
  line-height: 1.5;
}

.sub-title {
  width: 400px;
  color: #030303;
  font-size: 12px;
  font-weight: bold;
  letter-spacing: 0.69px;
  line-height: 1.5;
  margin: 0 0 4px;
}

.description {
  width: 400px;
  color: #6e6e6e;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.69px;
  line-height: 1.5;
  margin: 0 0 20px;
}

.mb40 {
  margin-bottom: 40px;
}

.allow-button {
  margin: 20px 0;
}

.cancel-button {
  margin: 0 0 40px;
}

@media screen and (max-width: 640px) {
  .oauth-authenticate-container {
    grid-template-rows: 100px auto min-content;
  }
}

@media screen and (max-width: 550px) {
  .oauth-authenticate-container {
    grid-template-rows: 66px auto min-content;
    grid-template-columns: 20px 1fr 20px;
  }

  .title {
    font-size: 14px;
    letter-spacing: 0.8px;
  }

  .sub-title,
  .description {
    width: 100%;
  }
}

@media screen and (max-width: 320px) {
  .br {
    &:before {
      content: '\A';
      white-space: pre;
    }
  }
}
</style>
