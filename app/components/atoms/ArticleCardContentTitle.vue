<template>
  <h2 class="area-title">
    <a :href="link" v-if="linkTo === 'public' || linkTo === 'draft'">
      {{ title }}
    </a>
    <nuxt-link :to="link" v-else>
      {{ title }}
    </nuxt-link>
  </h2>
</template>

<script>
export default {
  props: {
    link: {
      type: String,
      required: true
    },
    linkTo: {
      type: String,
      required: false
    },
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
  letter-spacing: 0.1em;
  line-height: 1.5;
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
      font-size: 16px;
    }
  }
}

@media screen and (max-width: 550px) {
  .long-article-card {
    .area-title {
      font-size: 20px;
    }
  }
}
</style>
