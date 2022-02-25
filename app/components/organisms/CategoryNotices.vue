<template>
  <div class="area-category-notices-container js-scrollable">
    <div class="description">
      注目BCG:
    </div>
    <nuxt-link class="link" to="/tag/クリプトモン">
      クリプトモン
    </nuxt-link>
    <nuxt-link class="link" to="/tag/クリスペ">
      クリスペ
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
  /*font-weight: 500;*/
  font-weight: bold;
  text-decoration: none;
  margin-right: 10px;
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
