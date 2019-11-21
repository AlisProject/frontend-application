<template>
  <div class="area-topo-notices-container">
    <nuxt-link class="description" to="ALIS-official/articles/3LqEG1Lkj850">
      実施中イベント <span class="tooltip" />
    </nuxt-link>
    <nuxt-link class="link" to="/tag/2019%E3%83%88%E3%82%AD%E3%83%A1%E3%82%AD%E7%A5%AD%E3%82%8A">
      #2019トキメキ祭り
    </nuxt-link>
  </div>
</template>

<style lang="scss" scoped>
.area-topo-notices-container {
  grid-area: notices;
  display: flex;
  overflow-x: scroll;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
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
    margin: 0 20px 0 0;
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

  .description {
    font-size: 14px;
  }

  .link {
    font-size: 14px;
  }
}
</style>
