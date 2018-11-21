<template>
  <nuxt-link :to="`/users/${user.user_id}`" class="area-author-info">
    <div class="author">
      <img
        class="icon"
        :alt="imageCaption"
        :src="user.icon_image_url"
        v-if="user.icon_image_url !== undefined">
      <img
        class="icon"
        :alt="imageCaption"
        src="~assets/images/pc/common/icon_user_noimg.png"
        v-else>
      <ul class="info">
        <li class="user-display-name">{{ decodedUserDisplayName }}</li>
        <li class="user-id">@{{ user.user_id }}</li>
      </ul>
    </div>
    <span class="body" v-if="hasSelfIntroduction">
      {{ decodedSelfIntroduction }}
    </span>
  </nuxt-link>
</template>

<script>
import { htmlDecode } from '~/utils/article'

export default {
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  computed: {
    decodedUserDisplayName() {
      return htmlDecode(this.user.user_display_name)
    },
    decodedSelfIntroduction() {
      if (!this.hasSelfIntroduction) return ''
      return htmlDecode(this.user.self_introduction)
    },
    hasSelfIntroduction() {
      const { self_introduction: selfIntroduction } = this.user

      if (selfIntroduction === undefined || selfIntroduction === null) {
        return false
      }
      if (selfIntroduction.trim() === '') return false

      return true
    },
    imageCaption() {
      return `${this.user.user_display_name}'s icon'`
    }
  }
}
</script>

<style lang="scss" scoped>
.area-author-info {
  grid-area: author-info;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 0 16px 0 rgba(0, 0, 0, 0.15);
  margin-bottom: 40px;
  padding: 20px;
  position: relative;
  text-decoration: none;
  transition: all 400ms ease;

  &:hover {
    box-shadow: 0 0 16px 0 rgba(0, 134, 204, 0.5);

    &:active {
      box-shadow: 0 0 16px 0 rgba(0, 0, 0, 0.15);
    }
  }

  .author {
    align-items: center;
    color: #5b5b5b;
    display: flex;
    font-size: 14px;

    .icon {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      margin-right: 14px;
    }

    .info {
      list-style: none;
      padding: 0;
      margin: 0;

      .user-display-name,
      .user-id {
        letter-spacing: 0.8px;
        line-height: 1.5;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .user-display-name {
        color: #030303;
        font-size: 14px;
      }

      .user-id {
        color: #6e6e6e;
        font-size: 12px;
      }
    }
  }

  .body {
    color: #6e6e6e;
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.8px;
    line-height: 1.5;
    margin-top: 10px;
    word-break: break-word;
    display: block;
  }
}

@media screen and (max-width: 640px) {
  .area-author-info {
    box-shadow: none;
    padding: 10px 0;

    &:hover {
      box-shadow: none;

      &:active {
        box-shadow: none;
      }
    }

    .author .info {
      // 8px  - column width of .area-article
      // 10px - column gap   of .area-article
      // 40px - width        of .area-author-info .author .icon
      // 14px - margin       of .area-author-info .author .icon
      width: calc(100vw - (8px + 10px + 40px + 14px + 10px + 8px));
    }
  }
}
</style>
