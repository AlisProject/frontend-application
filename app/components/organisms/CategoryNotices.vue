<template>
  <div class="area-category-notices-container js-scrollable">
    <nuxt-link class="description" to="/ALIS-official/articles/KeO0vXW1opDL">
      クリスペ <span class="tooltip" />
    </nuxt-link>
    <nuxt-link class="link" to="/tag/%E3%82%AF%E3%83%AA%E3%82%B9%E3%83%9A">
      全て
    </nuxt-link>
    <nuxt-link
      class="link"
      to="/tag/%E3%82%AF%E3%83%AA%E3%82%B9%E3%83%9A%EF%BC%9A%E3%83%87%E3%83%83%E3%82%AD%E7%B4%B9%E4%BB%8B"
    >
      デッキ紹介
    </nuxt-link>
    <nuxt-link
      class="link"
      to="/tag/%E3%82%AF%E3%83%AA%E3%82%B9%E3%83%9A%EF%BC%9A%E3%82%AB%E3%83%BC%E3%83%89%E8%A9%95%E4%BE%A1"
    >
      カード評価
    </nuxt-link>
    <nuxt-link
      class="link"
      to="/tag/%E3%82%AF%E3%83%AA%E3%82%B9%E3%83%9A%EF%BC%9A%E5%88%9D%E5%BF%83%E8%80%85"
    >
      初心者
    </nuxt-link>
    <nuxt-link
      class="link"
      to="/tag/%E3%82%AF%E3%83%AA%E3%82%B9%E3%83%9A%EF%BC%9A%E3%81%9D%E3%81%AE%E4%BB%96"
    >
      その他
    </nuxt-link>
  </div>
</template>

<style lang="scss" scoped>
.area-category-notices-container {
  grid-area: notices;
  display: flex;
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
  padding-top: 18px;
  &::-webkit-scrollbar {
    display: none;
  }
}

.description {
  color: #6e6e6e;
  font-size: 16px;
  font-weight: bold;
  text-decoration: none;
  margin-right: 20px;
  height: 16px;
  white-space: nowrap;
}

.tooltip {
  display: inline-block;
  width: 1em;
  height: 1em;
  vertical-align: middle;
  background: #6e6e6e;
  border-radius: 100%;
  position: relative;
  margin-top: -3px;

  &::before {
    position: absolute;
    display: inline-block;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%) scale(0.6);
    content: '?';
    color: #fff;
    font-size: 100%;
    font-weight: bold;
  }
}

.link {
  border-bottom: solid 1px transparent;
  color: #6e6e6e;
  font-size: 16px;
  font-weight: 500;
  text-decoration: none;
  transition: all 400ms ease;
  height: 16px;
  margin-right: 20px;
  white-space: nowrap;

  &:hover {
    border-bottom: solid 1px #6e6e6e;
  }
}

@media screen and (max-width: 920px) {
  .description {
    margin: 0 20px 0 0;
  }
}

@media screen and (max-width: 550px) {
  .area-category-notices-container {
    padding-top: 8px;
  }

  .description {
    font-size: 14px;
  }

  .link {
    font-size: 14px;
  }
}
</style>
