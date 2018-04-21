<template>
  <div>
    <nuxt/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  mounted() {
    if (location.pathname.startsWith('/me')) {
      if (!this.loggedIn) {
        this.$router.push('/login')
      }
    }
  },
  computed: {
    ...mapGetters('user', ['loggedIn'])
  }
}
</script>

<style>
@import 'normalize.css';

@font-face {
  font-family: 'Yu Gothic';
  src: local('Yu Gothic Medium');
  font-weight: 100;
}
@font-face {
  font-family: 'Yu Gothic';
  src: local('Yu Gothic Medium');
  font-weight: 200;
}
@font-face {
  font-family: 'Yu Gothic';
  src: local('Yu Gothic Medium');
  font-weight: 300;
}
@font-face {
  font-family: 'Yu Gothic';
  src: local('Yu Gothic Medium');
  font-weight: 400;
}
@font-face {
  font-family: 'Yu Gothic';
  src: local('Yu Gothic Bold');
  font-weight: bold;
}

body {
  font-family: 'Yu Gothic', YuGothic, 'Helvetica Neue', Helvetica, Arial, 游ゴシック体, '游ゴシック',
    'ヒラギノ角ゴ ProN W3', 'Hiragino Kaku Gothic ProN', 'ヒラギノ角ゴ Pro W3',
    'Hiragino Kaku Gothic Pro', 'メイリオ', Meiryo, 'MS ゴシック', 'MS Gothic', sans-serif;
}
</style>
