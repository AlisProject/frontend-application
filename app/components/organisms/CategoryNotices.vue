<template >
  <div class="area-category-notices-container js-scrollable">
    <nuxt-link class="description" to="/ALIS-official/articles/K8DQAXMojLyN">
      クリスペ <span class="tooltip" />
    </nuxt-link>
    <nuxt-link class="link" to="/tag/%E3%82%AF%E3%83%AA%E3%82%B9%E3%83%9A">
      全て
    </nuxt-link>
    <nuxt-link class="link" to="/tag/%E4%B8%80%E8%98%AD">
      デッキ紹介
    </nuxt-link>
    <nuxt-link class="link" to="/tag/%E6%B5%9C%E8%BE%BA%E7%BE%8E%E6%B3%A2">
      カード評価
    </nuxt-link>
    <nuxt-link class="link" to="/tag/%E6%B5%9C%E8%BE%BA%E7%BE%8E%E6%B3%A2">
      初心者
    </nuxt-link>
    <nuxt-link class="link" to="/tag/%E6%B5%9C%E8%BE%BA%E7%BE%8E%E6%B3%A2">
      その他
    </nuxt-link>
  </div>
</template>

<!--<script>-->
  <!--import ScrollHint from 'scroll-hint';-->
  <!--export default {-->
    <!--mounted() {-->
      <!--new ScrollHint('.js-scrollable', {-->
        <!--suggestiveShadow: true-->
      <!--});-->
    <!--}-->
  <!--}-->
<!--</script>-->

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

/*@media screen and (max-width: 1296px) {*/
  /*.popular-article-list-container,*/
  /*.new-article-list-container {*/
    /*.area-category-notices-container {*/
      /*padding-left: 12px;*/
    /*}*/
  /*}*/
/*}*/

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
