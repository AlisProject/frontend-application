<template>
  <div class="area-article-type-select-box">
    <select required @change="onChangeArticleTypeSelect">
      <option value="newArticles">新着記事</option>
      <option value="popularArticles">人気記事</option>
    </select>
  </div>
</template>

<script>
export default {
  methods: {
    onChangeArticleTypeSelect(event) {
      console.log(event.target.value)
    }
  }
}
</script>

<style lang="scss" scoped>
.area-article-type-select-box {
  grid-area: article-type-select-box;
  position: relative;
  display: flex;
  align-self: center;

  &::before {
    position: absolute;
    top: 4px;
    right: 0;
    width: 0;
    height: 0;
    padding: 0;
    content: '';
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 8px solid #858dda;
    pointer-events: none;
  }

  select {
    -webkit-appearance: none;
    background-image: none;
    background: transparent;
    border: none;
    box-shadow: none;
    cursor: pointer;
    outline: none;
    padding-right: 1em;
    text-indent: 0.01px;
    text-overflow: ellipsis;
    width: 100%;
    font-size: 14px;
    color: #858dda;

    &::-ms-expand {
      display: none;
    }
  }
}

@media screen and (max-width: 550px) {
  .area-article-type-select-box {
    &::before {
      top: 2px;
      right: 12px;
      border-left: 4px solid transparent;
      border-right: 4px solid transparent;
      border-top: 7px solid #858dda;
    }

    select {
      font-size: 10px;
    }
  }
}
</style>
