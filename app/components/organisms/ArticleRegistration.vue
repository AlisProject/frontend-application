<template>
  <div class="area-article-registration">
    <img
      class="registration pc"
      src="~assets/images/pc/article/img_article_registration_pc1.svg"
      alt="Article registration"
      @click="showSignUpModal"
    >
    <img
      class="registration sp"
      src="~assets/images/pc/article/img_article_registration_sp1.svg"
      alt="Article registration"
      @click="showSignUpModal"
    >
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  props: {
    tags: {
      type: Array,
      required: false,
      default: []
    },
    topic: {
      type: String,
      required: false
    }
  },
  mounted() {
    // google optimize
    window.dataLayer.push({
      event: 'optimize.activate',
      tags: this.tags,
      topic: this.topic
    })
  },
  methods: {
    showSignUpModal() {
      this.setSignUpModal({ showSignUpModal: true })
    },
    ...mapActions('user', ['setSignUpModal'])
  }
}
</script>

<style lang="scss" scoped>
.area-article-registration {
  grid-area: article-registration;
}

.registration {
  width: 100%;
  cursor: pointer;
  &.pc {
    display: block;
  }
  &.sp {
    display: none;
  }
}

@media screen and (max-width: 640px) {
  .registration {
    &.pc {
      display: none;
    }
    &.sp {
      display: block;
    }
  }
}
</style>
