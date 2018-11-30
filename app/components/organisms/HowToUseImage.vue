<template>
  <nuxt-link to="/" class="how-to-use-image">
    ALISの使い方
  </nuxt-link>
</template>

<style lang="scss" scoped>
.how-to-use-image {
  grid-area: how-to-use-image;
  width: 340px;
  height: 670px;
  background-color: #0086cc;
  color: #fff;
  border-radius: 4px;
}

@media screen and (max-width: 1296px) {
  .how-to-use-image {
    width: 710px;
    height: 160px;
  }
}

@media screen and (max-width: 920px) {
  .how-to-use-image {
    width: 100%;
    height: 58px;
    border-radius: 0;
  }
}
</style>
