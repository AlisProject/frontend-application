<template>
  <div class="area-topo-notices-container">
    <nuxt-link class="description" to="/campaigns">
      NFTもらえる一覧
    </nuxt-link>
    <nuxt-link class="description" to="/tag/NFTオーナー">
      🎖NFTオーナー
    </nuxt-link>
    <span class="tooltip" title="ALISバッジ保有者が追加可能な「NFTオーナー」タグの記事が表示されます" />
    <nuxt-link class="description" to="/esports">
      GameFi大会一覧
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
  margin-right: 7px;
}

.tooltip {
  display: inline-block;
  width: 1em;
  height: 1em;
  vertical-align: middle;
  background: #6e6e6e;
  border-radius: 100%;
  position: relative;
  margin: 0 7px 0 -7px;

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

@media screen and (max-width: 1296px) {
  .popular-article-list-container,
  .new-article-list-container {
    .area-topo-notices-container {
      padding-left: 12px;
    }
  }
}

@media screen and (max-width: 920px) {
  .top-page .description {
    margin: 0 10px 0 0;
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
    margin: 0 5px 0 0;
    font-size: 14px;
  }

  .link {
    margin-right: 10px;
    font-size: 14px;
  }
}
</style>
