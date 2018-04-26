<template>
  <h2 class="area-title">
    {{ title }}
  </h2>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: false
    }
  }
}
</script>

<style lang="scss" scoped>
.area-title {
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  color: #3f3f3f;
  display: -webkit-box;
  font-size: 16px;
  font-weight: 500;
  grid-area: title;
  letter-spacing: 0.05em;
  line-height: 24px;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;

  a {
    color: #3f3f3f;
    display: block;
    text-decoration: none;
  }
}

.long-article-card {
  .area-title {
    font-weight: bold;
    line-height: 28px;
    font-size: 19px;
  }
}

@media screen and (max-width: 1296px) {
  .long-article-card {
    .area-title {
      font-weight: 500;
      line-height: 28px;
      font-size: 16px;
    }
  }
}

@media screen and (max-width: 550px) {
  .long-article-card {
    .area-title {
      line-height: 26px;
    }
  }
}
</style>
