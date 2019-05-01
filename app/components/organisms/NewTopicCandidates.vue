<template>
  <div class="area-new-topic-candidates-container">
    <nuxt-link class="description" to="/ALIS-official/articles/3gp6oLqr5ZLj">
      新カテゴリー候補  <span class="tooltip" />
    </nuxt-link>
    <nuxt-link class="link" to="/tag/music">
      音楽
    </nuxt-link>
    <nuxt-link class="link" to="/tag/beauty">
      ビューティ
    </nuxt-link>
    <nuxt-link class="link" to="/tag/gosyuin">
      神仏・御朱印
    </nuxt-link>
  </div>
</template>

<style lang="scss" scoped>
.area-new-topic-candidates-container {
  grid-area: candidates;
  display: flex;
  overflow-x: scroll;
  -webkit-overflow-scrolling: touch;
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
  .top-page .description {
    margin: 0 20px 0 12px;
  }
}

@media screen and (max-width: 550px) {
  .top-page .area-new-topic-candidates-container {
    padding-top: 20px;
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
