<template>
  <div class="area-topo-notices-container">
    <nuxt-link class="description" to="/campaigns">
      NFTもらえる一覧
    </nuxt-link>
    <nuxt-link class="description" to="/tag/NFTオーナー">
      🎖NFTオーナー
    </nuxt-link>
  </div>
</template>

<style lang="scss" scoped>
.area-topo-notices-container {
  grid-area: notices;
  display: flex;
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
  .title {
    display: inline-block;
  }
}
.area-topo-notices-container::-webkit-scrollbar {
  display: none;
}

.popular-article-list-container,
.new-article-list-container {
  .area-topo-notices-container {
    padding-top: 20px;
  }
}

.description {
  color: #6e6e6e;
  font-size: 16px;
  font-weight: bold;
  text-decoration: none;
  height: 16px;
  white-space: nowrap;
  margin-right: 13px;
}

@media screen and (max-width: 1296px) {
  .popular-article-list-container,
  .new-article-list-container {
    .area-topo-notices-container {
      padding-left: 12px;
    }
  }
}

@media screen and (max-width: 550px) {
  .top-page .area-topo-notices-container {
    padding-top: 20px;
  }

  .popular-article-list-container,
  .new-article-list-container {
    .area-topo-notices-container {
      padding-top: 10px;
    }
  }

  .top-page .description {
    font-size: 14px;
  }
}
</style>
