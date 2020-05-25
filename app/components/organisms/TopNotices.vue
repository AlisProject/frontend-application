<template>
  <div class="area-topo-notices-container">
    <nuxt-link class="description" to="/ALIS-official/articles/K8DQAXMojLyN">
      今週のお題 <span class="tooltip" />
    </nuxt-link>
    <nuxt-link
      class="link"
      to="/tag/%E6%9A%97%E5%8F%B7%E8%B3%87%E7%94%A3%E5%8F%A4%E7%89%A9%E5%95%86"
    >
      暗号資産古物商
    </nuxt-link>
    <nuxt-link class="link" to="/tag/%E8%87%AA%E5%AE%85%E9%81%8B%E5%8B%95">
      自宅運動
    </nuxt-link>
    <nuxt-link class="link" to="/tag/%E6%8A%95%E8%B3%87">
      投資
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
