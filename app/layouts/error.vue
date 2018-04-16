<template>
  <div v-if="error.statusCode === 404">
    <app-header class="logo-original" showDefaultHeaderNav showOnlyLogo/>
    <div class="logo-mobile"></div>
    <div class="page-404-container">
      <h1 class="title">お探しのページは見つかりませんでした</h1>
      <p class="description">
        アクセスしようとしたページは削除、変更されたか、<br>
        現在利用できない可能性があります。
      </p>
      <nuxt-link to="/" class="to-top-button">
        トップに戻る
      </nuxt-link>
    </div>
  </div>
</template>

<script>
import AppHeader from '~/components/organisms/AppHeader'

export default {
  components: {
    AppHeader
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
    margin: 0;
  }

  .description {
    color: #6e6e6e;
    font-size: 12px;
    line-height: 18px;
    margin: 38px 0 0;
  }

  .to-top-button {
    background: linear-gradient(134.72deg, #232538 0%, #858dda 100%);
    border-radius: 18px;
    border: none;
    box-shadow: 0 0 10px gray;
    color: #fff;
    display: block;
    font-size: 13px;
    margin: 50vh auto 60px;
    outline: none;
    padding: 10px;
    text-align: center;
    text-decoration: none;
    width: 265px;

    &:focus {
      opacity: 0.8;
    }
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
