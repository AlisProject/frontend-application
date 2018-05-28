<template>
  <div>
    <app-header class="logo-original" showDefaultHeaderNav showOnlyLogo/>
    <div class="logo-mobile"></div>
    <div v-if="error.statusCode === 404">
      <div class="page-404-container">
        <h1 class="title">お探しのページは見つかりませんでした</h1>
        <p class="description">
          アクセスしようとしたページは削除、変更されたか、<br>
          現在利用できない可能性があります。
        </p>
        <app-button class="to-top-button">
          <nuxt-link to="/">
            トップに戻る
          </nuxt-link>
        </app-button>
      </div>
    </div>
    <div v-else-if="error.statusCode >= 500">
      <div class="page-500-container">
        <h1 class="title">
          システムエラーが発生しました。<br>
          お手数ですが、時間をおいて再度お試しください。
        </h1>
        <p class="description">
          障害が発生している場合はツイッターにて状況を配信させていただきます。
        </p>
        <a
          class="twitter-timeline"
          data-width="380"
          data-height="500"
          href="https://twitter.com/ALIS_media?ref_src=twsrc%5Etfw">
          Tweets by ALIS_media
        </a>
        <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
      </div>
    </div>
  </div>
</template>

<script>
import AppHeader from '~/components/organisms/AppHeader'
import AppButton from '~/components/atoms/AppButton'

export default {
  components: {
    AppHeader,
    AppButton
  },
  props: ['error'],
  head() {
    return {
      title: this.error.statusCode
    }
  }
}
</script>

<style lang="scss" scoped>
.page-500-container,
.page-404-container {
  background: url('~/assets/images/pc/common/image_bg404.jpg') no-repeat;
  background-position: center bottom;
  background-size: 600px;
  height: calc(100vh - 100px);
  text-align: center;
  width: 100%;

  .title {
    color: #030303;
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    margin: 0 30px;
  }

  .description {
    color: #6e6e6e;
    font-size: 12px;
    line-height: 18px;
    margin: 38px 0 0;
  }

  .to-top-button {
    margin: 50vh auto 60px;
  }
}

.page-500-container {
  background: none;

  .description {
    margin: 38px 30px 50px;
  }
}

@media screen and (max-width: 550px) {
  .page-404-container {
    background: url('~/assets/images/sp/common/image_bg404.jpg') no-repeat;
    background-position: center bottom;
    background-size: 100%;
    height: calc(100vh - 106px);

    .title {
      margin-top: 30px;
    }
  }
}
</style>
