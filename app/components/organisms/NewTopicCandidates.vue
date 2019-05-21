<template>
  <div class="area-new-topic-candidates-container">
    <nuxt-link class="description" to="/ALIS-official/articles/3gp6oLqr5ZLj">
      新カテゴリー候補 <span class="tooltip" />
    </nuxt-link>
    <nuxt-link class="link" to="/tag/%E3%83%93%E3%83%A5%E3%83%BC%E3%83%86%E3%82%A3">
      ビューティ
    </nuxt-link>
    <nuxt-link class="link" to="/tag/%E9%9F%B3%E6%A5%BD">
      音楽
    </nuxt-link>
    <nuxt-link class="link" to="/tag/ALIS">
      ALIS
    </nuxt-link>
    <nuxt-link class="link" to="/tag/%E6%81%8B%E6%84%9B%E3%83%BB%E5%87%BA%E4%BC%9A%E3%81%84">
      恋愛・出会い
    </nuxt-link>
    <nuxt-link class="link" to="/tag/%E7%A5%9E%E4%BB%8F">
      神仏
    </nuxt-link>
    <nuxt-link class="link" to="/tag/%E6%95%99%E8%82%B2%E3%83%BB%E5%AD%90%E8%82%B2%E3%81%A6">
      教育・子育て
    </nuxt-link>
  </div>
</template>

<style lang="scss" scoped>
.area-new-topic-candidates-container {
  grid-area: candidates;
  display: flex;
  overflow-x: scroll;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    display: none;
  }
}

.popular-article-list-container,
.new-article-list-container {
  .area-new-topic-candidates-container {
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
    .area-new-topic-candidates-container {
      padding-left: 12px;
    }
  }
}

@media screen and (max-width: 920px) {
  .top-page,
  .tip-ranking-container {
    .description {
      margin: 0 20px 0 12px;
    }
  }
}

@media screen and (max-width: 550px) {
  .top-page,
  .tip-ranking-container {
    .area-new-topic-candidates-container {
      padding-top: 20px;
    }
  }

  .popular-article-list-container,
  .new-article-list-container {
    .area-new-topic-candidates-container {
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
