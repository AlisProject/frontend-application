<template>
  <transition name="fade">
    <div class="article-comment">
      <div class="commented-user">
        <img class="icon" :src="comment.userInfo.icon_image_url" v-if="hasUserIcon">
        <img class="icon" src="~assets/images/pc/common/icon_user_noimg.png" v-else>
        <ul class="info">
          <li class="info-content">{{ comment.userInfo.user_display_name }}</li>
          <li class="info-content">{{ createdAt }}</li>
        </ul>
      </div>
      <p class="body" v-html="commentText"/>
      <div class="action-like" :class="{ 'disable': isLikedComment }" @click="like">
        <img class="icon" src="~assets/images/pc/article/a_icon_Good_selected.png" v-if="isLikedComment">
        <img class="icon" src="~assets/images/pc/article/a_icon_Good.png" v-else>
        <span class="likes-count">{{ likesCount }}</span>
      </div>
      <div class="action-delete" @click="toggleDeleteCommentPopup" v-if="showDeleteAction">
        <img class="icon" src="~assets/images/pc/article/a_icon_menu.png">
        <div class="delete-comment-popup" v-show="isDeleteCommentPopupShown">
          <span class="delete" @click="deleteComment">
            削除する
          </span>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { ADD_TOAST_MESSAGE } from 'vuex-toast'
import { formatDateFromNow } from '~/utils/format'
import urlRegex from 'url-regex'

export default {
  props: {
    comment: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isDeleteCommentPopupShown: false,
      isLiked: false,
      likesCount: 0
    }
  },
  mounted() {
    this.likesCount = this.comment.likesCount
    this.listen(window, 'click', (event) => {
      if (!this.$el.querySelector('.action-delete')) return
      if (!this.$el.querySelector('.action-delete').contains(event.target)) {
        this.closeDeleteCommentPopup()
      }
    })
    this.listen(window, 'touchstart', (event) => {
      if (!this.$el.querySelector('.action-delete')) return
      if (!this.$el.querySelector('.action-delete').contains(event.target)) {
        this.closeDeleteCommentPopup()
      }
    })
  },
  destroyed() {
    if (this._eventRemovers) {
      this._eventRemovers.forEach((eventRemover) => {
        eventRemover.remove()
      })
    }
  },
  computed: {
    hasUserIcon() {
      return urlRegex().test(this.comment.userInfo.icon_image_url)
    },
    isLikedComment() {
      return this.isLiked || this.comment.isLiked
    },
    commentText() {
      return this.comment.text.replace(/\r?\n/g, '<br>')
    },
    createdAt() {
      return formatDateFromNow(this.comment.created_at)
    },
    showDeleteAction() {
      return (
        this.comment.user_id === this.currentUserInfo.user_id ||
        this.currentUserInfo.user_id === this.article.user_id
      )
    },
    ...mapGetters('user', ['currentUserInfo', 'loggedIn']),
    ...mapGetters('article', ['article'])
  },
  methods: {
    async like() {
      if (!this.loggedIn) {
        this.setRequestLoginModal({ isShow: true, requestType: 'articleCommentLike' })
        window.scrollTo(0, 0)
        document.querySelector('html').style.overflow = 'hidden'
        document.querySelector('body').style.overflow = 'hidden'
        return
      }
      if (this.isLikedComment) return
      try {
        this.isLiked = true
        await this.postCommentLike({ commentId: this.comment.comment_id })
        this.likesCount += 1
      } catch (error) {
        console.error(error)
        if (error.response.data.message === 'Record Not Found') {
          this.sendNotification({
            text: 'このコメントはすでに削除されているため、いいねできませんでした。',
            type: 'warning'
          })
        }
        this.isLiked = false
      }
    },
    toggleDeleteCommentPopup() {
      this.isDeleteCommentPopupShown = !this.isDeleteCommentPopupShown
    },
    closeDeleteCommentPopup() {
      this.isDeleteCommentPopupShown = false
    },
    async deleteComment(event) {
      try {
        await this.deleteArticleComment({ commentId: this.comment.comment_id })
        this.sendNotification({ text: 'コメントを削除しました。' })
      } catch (error) {
        console.error(error)
        if (error.response.data.message === 'Record Not Found') {
          this.sendNotification({
            text: 'コメントはすでに削除されています。削除が反映されるまで今しばらくお待ち下さい。',
            type: 'warning'
          })
        }
      }
    },
    listen(target, eventType, callback) {
      if (!this._eventRemovers) {
        this._eventRemovers = []
      }
      target.addEventListener(eventType, callback)
      this._eventRemovers.push({
        remove() {
          target.removeEventListener(eventType, callback)
        }
      })
    },
    ...mapActions({
      sendNotification: ADD_TOAST_MESSAGE
    }),
    ...mapActions('article', ['postCommentLike', 'deleteArticleComment']),
    ...mapActions('user', ['setRequestLoginModal'])
  }
}
</script>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 400ms ease;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.article-comment {
  background-color: #fff;
  border-radius: 4px;
  padding: 24px;
  position: relative;

  .commented-user {
    color: #5b5b5b;
    font-size: 14px;
    left: 20px;
    position: absolute;
    top: 20px;

    .info {
      color: #6e6e6e;
      float: right;
      font-size: 12px;
      list-style: none;
      margin: 0px 16px;
      padding: 0;

      .info-content {
        line-height: 1.5;
      }
    }

    .icon {
      width: 36px;
      height: 36px;
      border-radius: 50%;
    }
  }

  .body {
    color: #030303;
    font-size: 12px;
    font-weight: 500;
    line-height: 1.8;
    margin-top: 40px;
    padding-bottom: 40px;
    word-break: break-word;
  }

  .action-like {
    bottom: 10px;
    cursor: pointer;
    left: 24px;
    padding: 10px 0;
    position: absolute;
    display: flex;
    align-items: center;

    &.disable {
      cursor: not-allowed;
    }

    .icon {
      width: 16px;
      height: 16px;
      padding-right: 4px;
    }

    .likes-count {
      color: #6e6e6e;
      font-size: 12px;
    }
  }

  .action-delete {
    bottom: 20px;
    position: absolute;
    right: 24px;
    cursor: pointer;

    .icon {
      width: 20px;
      height: 20px;
    }

    .delete-comment-popup {
      background-color: #fff;
      border-radius: 2px;
      box-shadow: 0 4px 10px 0 rgba(192, 192, 192, 0.5);
      cursor: default;
      box-sizing: border-box;
      font-size: 14px;
      padding: 12px;
      position: absolute;
      right: -14px;
      top: 26px;
      width: 90px;
      z-index: 1;

      .delete {
        cursor: pointer;
        user-select: none;
      }
    }
  }
}
</style>
