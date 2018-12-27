<template>
  <nuxt-link to="/ALIS-official/articles/3reY5BgBEZ8B" class="how-to-use-image" />
</template>

<style lang="scss" scoped>
.how-to-use-image {
  grid-area: how-to-use-image;
  background: url('~assets/images/pc/common/img_banner_beginner_pc.png') no-repeat;
  background-color: #0086cc;
  background-position-x: -2px;
  background-position-y: -2px;
  background-size: 344px 674px;
  border-radius: 4px;
  box-shadow: 0 0 16px 0 rgba(192, 192, 192, 0.7);
  height: 670px;
  transition: box-shadow 400ms ease;
  width: 340px;

  &:hover {
    box-shadow: 0 0 16px 0 rgba(0, 134, 204, 0.5);

    &:active {
      box-shadow: 0 0 2px 0 rgba(0, 134, 204, 0.5);
    }
  }
}

@media screen and (max-width: 1296px) {
  .how-to-use-image {
    background: url('~assets/images/pc/common/img_banner_beginner_middle.png') no-repeat;
    background-size: cover;
    height: 160px;
    width: 710px;
  }
}

@media screen and (max-width: 920px) {
  .how-to-use-image {
    background: url('~assets/images/sp/common/img_banner_beginner_sp.png') no-repeat;
    background-size: contain;
    width: 100%;
    height: 60px;
    border-radius: 0;
    box-shadow: none;

    &:hover {
      box-shadow: none;

      &:active {
        box-shadow: none;
      }
    }
  }
}

@media screen and (max-width: 550px) {
  .how-to-use-image {
    background-size: cover;
    height: 80px;
  }
}

@media screen and (max-width: 414px) {
  .how-to-use-image {
    height: 60px;
  }
}
</style>
