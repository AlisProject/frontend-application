<template>
  <nav class="area-nav">
    <template v-if="!showOnlyLogo && !showOnlySessionLinks">
      <nuxt-link
        :to="{ query: { topics: 'crypto'} }"
        class="nav-link area-topic-crypto"
        :class="{ hidden: showOnlySessionLinksOnPc }"
        @click.native="resetScrollPosition">クリプト</nuxt-link>
      <nuxt-link
        :to="{ query: { topics: 'topic1'} }"
        class="nav-link area-topic-topic1"
        :class="{ hidden: showOnlySessionLinksOnPc }"
        @click.native="resetScrollPosition">TOPIC1</nuxt-link>
      <nuxt-link
        :to="{ query: { topics: 'topic2'} }"
        class="nav-link area-topic-topic2"
        :class="{ hidden: showOnlySessionLinksOnPc }"
        @click.native="resetScrollPosition">TOPIC2</nuxt-link>
    </template>
  </nav>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  props: {
    showOnlyLogo: {
      type: Boolean,
      default: false
    },
    showOnlySessionLinks: {
      type: Boolean,
      default: false
    },
    showOnlySessionLinksOnPc: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    onChangeArticleTypeSelect(event) {
      console.log(event.target.value)
    },
    resetScrollPosition() {
      this.setArticleListScrollHeight({ scroll: 0 })
    },
    ...mapActions('presentation', ['setArticleListScrollHeight'])
  }
}
</script>

<style lang="scss" scoped>
.area-nav {
  grid-area: nav;
  display: grid;
  text-align: center;
  grid-template-rows: 1fr 22px 1fr;
  grid-template-columns: 1fr repeat(3, auto) 1fr;
  grid-column-gap: 40px;
  /* prettier-ignore */
  grid-template-areas:
    "... ...          ...          ...          ..."
    "... topic-crypto topic-topic1 topic-topic2 ..."
    "... ...          ...          ...          ...";
}

.nav-link {
  font-size: 14px;
  text-decoration: none;
  color: #6e6e6e;
  padding: 0 10px;
  line-height: 1.6;
}

.area-topic-crypto {
  grid-area: topic-crypto;
}

.area-topic-topic1 {
  grid-area: topic-topic1;
}

.area-topic-topic2 {
  grid-area: topic-topic2;
}

.topic-crypto .area-topic-crypto,
.topic-topic1 .area-topic-topic1,
.topic-topic2 .area-topic-topic2 {
  color: white;
  display: block;
  background: #858dda;
  border-radius: 10px;
}

@media screen and (max-width: 920px) {
  .article-container {
    .nav-link {
      display: none;
    }
  }
}

@media screen and (max-width: 550px) {
  .area-nav {
    grid-gap: 20px;
    /* prettier-ignore */
    grid-template-areas:
      'topic-crypto topic-topic1 topic-topic2';
    grid-template-rows: 20px;
    grid-template-columns: repeat(3, fit-content(100%));
  }

  .nav-link {
    font-size: 10px;
    padding: 0 5px;
    line-height: 2;

    &.hidden {
      display: none;
    }
  }
}
</style>
