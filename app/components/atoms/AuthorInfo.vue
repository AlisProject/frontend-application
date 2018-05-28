<template>
  <nuxt-link :to="`/users/${user.user_id}`" tag="div" class="area-author-info-container">
    <div class="area-author-icon">
      <img
        class="author-icon"
        :src="user.icon_image_url"
        :alt="imageCaption"
        v-if="user.icon_image_url !== undefined">
      <img
        class="author-icon"
        src="~assets/images/pc/common/icon_user_noimg.png"
        :alt="imageCaption"
        v-else>
    </div>
    <div class="area-user-display-name">
      <p class="user-display-name">
        {{ user.user_display_name }}
      </p>
    </div>
    <div class="area-user-id">
      <p class="user-id">
        @{{ user.user_id }}
      </p>
    </div>
    <div class="area-self-introduction">
      <p class="self-introduction" :class="{ 'add-bottom-space': !hasSelfIntroduction }">
        {{ user.self_introduction }}
      </p>
    </div>
  </nuxt-link>
</template>

<script>
export default {
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  computed: {
    hasSelfIntroduction() {
      if (this.user.self_introduction === undefined) return false
      if (this.user.self_introduction.trim() === '') return false
      return true
    },
    imageCaption() {
      return `${this.user.user_display_name}'s icon'`
    }
  }
}
</script>

<style lang="scss" scoped>
.area-author-info-container {
  border-radius: 6px;
  box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.15);
  cursor: pointer;
  display: grid;
  grid-area: author-info;
  grid-column-gap: 20px;
  grid-row-gap: 10px;
  grid-template-columns: 80px 1fr;
  grid-template-rows: 32px 12px 1fr;
  margin-bottom: 40px;
  padding: 10px 20px;
  /* prettier-ignore */
  grid-template-areas:
    "author-icon user-display-name"
    "author-icon user-id          "
    "...         self-introduction";
}

.area-author-icon {
  grid-area: author-icon;

  .author-icon {
    border-radius: 50%;
    height: 80px;
    width: 80px;
  }
}

.area-user-display-name {
  grid-area: user-display-name;
  align-self: flex-end;

  .user-display-name {
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 500px;
  }
}

.area-user-id {
  grid-area: user-id;

  .user-id {
    color: #6e6e6e;
    font-size: 12px;
    margin: 0;
  }
}

.area-self-introduction {
  grid-area: self-introduction;

  .self-introduction {
    color: #030303;
    font-size: 14px;
    line-height: 24px;
    margin: 0;
    word-break: break-word;

    &.add-bottom-space {
      padding-bottom: 4px;
    }
  }
}

@media screen and (max-width: 640px) {
  .area-author-info-container {
    box-shadow: none;
    padding: 10px 0;
  }

  .area-user-display-name {
    .user-display-name {
      width: calc(100vw - 150px);
    }
  }
}
</style>
