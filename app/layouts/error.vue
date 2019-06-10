<template>
  <div>
    <app-header class="app-header" />
    <div class="logo-mobile" />
    <div v-if="error.statusCode === 404">
      <div class="page-404-container">
        <h1 class="title">
          お探しのページは<span class="br" />見つかりませんでした
        </h1>
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
          href="https://twitter.com/ALIS_media?ref_src=twsrc%5Etfw"
        >
          Tweets by ALIS_media
        </a>
        <script async src="https://platform.twitter.com/widgets.js" charset="utf-8" />
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
.app-header {
  margin: 0 auto;
  height: 100px;
}

.page-500-container,
.page-404-container {
  background: url('~assets/images/pc/common/image_bg404.png') no-repeat;
  background-position: center bottom;
  background-size: 600px;
  text-align: center;
  width: 100%;
  height: 100%;

  .title {
    color: #030303;
    font-size: 14px;
    font-weight: bold;
    line-height: 1.5;
    margin: 40px 0 0;
  }

  .description {
    color: #6e6e6e;
    font-size: 12px;
    line-height: 18px;
    margin: 20px 0 0;
  }

  .to-top-button {
    margin: 40vh auto 150px;
  }
}

.page-500-container {
  background: none;

  .description {
    margin: 38px 30px 50px;
  }
}

@media screen and (max-width: 550px) {
  .br {
    &:before {
      content: '\A';
      white-space: pre;
    }
  }

  .app-header {
    height: 66px;
  }

  .page-404-container {
    background-size: 400px;

    .title {
      margin-top: 30px;
    }

    .to-top-button {
      margin: 36vh auto 80px;
    }
  }
}
</style>
