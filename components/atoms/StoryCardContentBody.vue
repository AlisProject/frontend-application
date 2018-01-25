<template>
  <p class="area-body">
    {{ plainBody }}
  </p>
</template>

<script>
export default {
  props: ['body'],
  computed: {
    plainBody() {
      return this.body.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, '')
    }
  }
}
</script>

<style lang="scss" scoped>
.area-body {
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  color: #7f7f7f;
  display: -webkit-box;
  font-size: 12px;
  grid-area: body;
  line-height: 20px;
  margin: 0;
  overflow: hidden;
  text-align: justify;
  text-overflow: ellipsis;
}

.long-story-card {
  .area-body {
    -webkit-line-clamp: 3;
    font-size: 14px;
    line-height: 24px;
  }
}

@media screen and (max-width: 1296px) {
  .long-story-card {
    .area-body {
      -webkit-line-clamp: 2;
      font-size: 12px;
      line-height: 24px;
    }
  }
}
</style>
