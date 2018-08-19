<template>
  <nuxt-link :to="`/users/${user.user_id}`" tag="div" class="search-user-card-container">
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
.search-user-card-container {
  border-radius: 6px;
  box-shadow: 0 0 8px 0 rgba(192, 192, 192, 0.5);
  cursor: pointer;
  display: grid;
  grid-column-gap: 20px;
  grid-row-gap: 10px;
  grid-template-columns: 60px 1fr;
  grid-template-rows: 16px 14px 1fr;
  padding: 40px;
  /* prettier-ignore */
  grid-template-areas:
    "author-icon user-display-name"
    "author-icon user-id          "
    "...         self-introduction";
  transition: all 400ms ease;

  &:hover {
    box-shadow: 0 0 8px 0 rgba(133, 141, 218, 0.5);

    &:active {
      box-shadow: 0 0 4px 0 rgba(133, 141, 218, 0.5);
    }
  }
}

.area-author-icon {
  grid-area: author-icon;

  .author-icon {
    border-radius: 50%;
    height: 60px;
    width: 60px;
  }
}

.area-user-display-name {
  grid-area: user-display-name;
  overflow: hidden;

  .user-display-name {
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-weight: bold;
    font-size: 14px;
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
    font-size: 12px;
    line-height: 1.5;
    margin: 0;
    word-break: break-word;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    display: -webkit-box;
    overflow: hidden;
    text-align: left;
    text-overflow: ellipsis;

    &.add-bottom-space {
      padding-bottom: 4px;
    }
  }
}

@media screen and (max-width: 550px) {
  .search-user-card-container {
    grid-template-columns: 40px 1fr;
    grid-column-gap: 10px;
    /* prettier-ignore */
    grid-template-areas:
    "author-icon       user-display-name"
    "author-icon       user-id          "
    "self-introduction self-introduction";
    padding: 16px;
  }

  .area-author-icon {
    .author-icon {
      height: 40px;
      width: 40px;
    }
  }

  .area-user-display-name {
    .user-display-name {
      font-weight: normal;
      line-height: 1.4;
    }
  }

  .area-user-id {
    .user-id {
      line-height: 0.9;
    }
  }

  .area-self-introduction {
    .self-introduction {
      color: #6e6e6e;
    }
  }
}
</style>
