<template>
  <transition name="fade">
    <div>
      <div class="article-comment">
        <nuxt-link :to="`/users/${replyComment.userInfo.user_id}`" class="commented-user">
          <img v-if="hasUserIcon" class="icon" :src="replyComment.userInfo.icon_image_url">
          <img v-else class="icon" src="~assets/images/pc/common/icon_user_noimg.png">
          <ul class="info">
            <li class="info-content">
              {{ decodedUserDisplayName }}
            </li>
            <li class="info-created-at">
              {{ createdAt }}
            </li>
            <li class="info-reply-target-user-name">
              返信先：{{ decodedReplyedUserDisplayName }}
            </li>
          </ul>
        </nuxt-link>
        <div v-if="showDeleteAction" class="action-delete" @click="toggleDeleteCommentPopup">
          <img class="icon" src="~assets/images/pc/article/a_icon_menu.png">
          <div v-show="isDeleteCommentPopupShown" class="delete-comment-popup">
            <span class="delete" @click="deleteComment">
              削除する
            </span>
          </div>
        </div>
        <p class="body" v-html="commentText" />
        <div class="action-like" :class="{ disable: isLikedComment }" @click="like">
          <img
            v-if="isLikedComment"
            class="icon"
            src="~assets/images/pc/article/a_icon_Good_selected.png"
          >
          <img v-else class="icon" src="~assets/images/pc/article/a_icon_Good.png">
          <span class="likes-count">{{ likesCount }}</span>
        </div>
        <div class="action-reply" @click="reply">
          返信
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
import { htmlDecode } from '~/utils/article'

export default {
  props: {
    replyComment: {
      type: Object,
      required: true
    },
    articleCommentReplyFormBoxPosition: {
      type: Number,
      required: true
    },
    replyInfo: {
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
    this.likesCount = this.replyComment.likesCount
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
      return urlRegex().test(this.replyComment.userInfo.icon_image_url)
    },
    isLikedComment() {
      return this.isLiked || this.replyComment.isLiked
    },
    commentText() {
      return this.replyComment.text.replace(/\r?\n/g, '<br>')
    },
    createdAt() {
      return formatDateFromNow(this.replyComment.created_at)
    },
    showDeleteAction() {
      return (
        this.replyComment.user_id === this.currentUserInfo.user_id ||
        this.currentUserInfo.user_id === this.article.user_id
      )
    },
    decodedUserDisplayName() {
      return htmlDecode(this.replyComment.userInfo.user_display_name)
    },
    decodedReplyedUserDisplayName() {
      return htmlDecode(this.replyComment.replyedUserInfo.user_display_name)
    },
    ...mapGetters('user', ['currentUserInfo', 'loggedIn', 'currentUser']),
    ...mapGetters('article', ['article'])
  },
  methods: {
    async like() {
      if (!this.loggedIn) {
        this.setRequestLoginModal({ isShow: true, requestType: 'articleCommentLike' })
        return
      } else if (!this.currentUser.phoneNumberVerified) {
        this.setRequestPhoneNumberVerifyModal({ isShow: true, requestType: 'articleCommentLike' })
        this.setRequestPhoneNumberVerifyInputPhoneNumberModal({ isShow: true })
        return
      }
      if (this.isLikedComment) return
      try {
        this.isLiked = true
        await this.postCommentLike({ commentId: this.replyComment.comment_id })
        this.likesCount += 1
      } catch (error) {
        console.error(error)
        if (error.response.data.message === 'Record Not Found') {
          this.sendNotification({
            text: 'このコメントはすでに削除されているため、いいねできませんでした',
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
        await this.deleteArticleReplyComment({
          commentId: this.replyComment.comment_id,
          parentId: this.replyInfo.parentId
        })
        this.sendNotification({ text: 'コメントを削除しました' })
      } catch (error) {
        console.error(error)
        if (error.response.data.message === 'Record Not Found') {
          this.sendNotification({
            text: 'コメントはすでに削除されています。削除が反映されるまで今しばらくお待ち下さい',
            type: 'warning'
          })
        }
      }
    },
    reply() {
      if (!this.loggedIn) {
        this.setRequestLoginModal({ isShow: true, requestType: 'articleComment' })
        return
      } else if (!this.currentUser.phoneNumberVerified) {
        this.setRequestPhoneNumberVerifyModal({ isShow: true, requestType: 'articleComment' })
        this.setRequestPhoneNumberVerifyInputPhoneNumberModal({ isShow: true })
        return
      }

      window.scrollTo({
        top: this.articleCommentReplyFormBoxPosition,
        behavior: 'smooth'
      })

      const replyInfo = {
        replyedUserId: this.replyComment.userInfo.user_id,
        replyedUserDisplayName: this.decodedUserDisplayName,
        parentId: this.replyInfo.parentId
      }
      this.$emit('handle-reply', replyInfo, true)
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
    ...mapActions('article', ['postCommentLike', 'deleteArticleReplyComment']),
    ...mapActions('user', [
      'setRequestLoginModal',
      'setRequestPhoneNumberVerifyModal',
      'setRequestPhoneNumberVerifyInputPhoneNumberModal'
    ])
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
  border-top: 1px solid rgb(240, 240, 240);
  padding: 16px 16px 16px 0;
  position: relative;

  .commented-user {
    align-items: flex-start;
    color: #5b5b5b;
    display: flex;
    font-size: 14px;
    text-decoration: none;

    .icon {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      margin-right: 16px;
      object-fit: cover;
    }

    .info {
      font-size: 12px;
      list-style: none;
      padding: 0;
      margin: 0;

      .info-content {
        color: #6e6e6e;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        line-height: 1.5;
      }

      .info-created-at,
      .info-reply-target-user-name {
        color: #9a9a9a;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-size: 10px;
        line-height: 1.5;
      }
    }
  }

  .body {
    color: #030303;
    font-size: 12px;
    font-weight: 500;
    line-height: 1.5;
    margin: 4px 0 12px 50px;
    padding-bottom: 18px;
    word-break: break-word;
  }

  .action-like {
    align-items: center;
    bottom: 5px;
    cursor: pointer;
    display: flex;
    padding: 10px 0;
    position: absolute;
    right: 62px;

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

  .action-reply {
    bottom: 6px;
    color: #0086cc;
    cursor: pointer;
    font-size: 12px;
    font-weight: 500;
    padding: 10px 0;
    position: absolute;
    right: 16px;
  }

  .action-delete {
    cursor: pointer;
    position: absolute;
    right: 20px;
    top: 16px;

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

@media screen and (max-width: 640px) {
  .article-comment {
    .commented-user {
      .info {
        // 10px - padding of .area-article-comments
        // 74px - padding of .area-article-comment-reply-comments
        // 16px - padding of .article-comment
        // 36px - width   of .article-comment .commented-user .icon
        // 16px - margin  of .article-comment .commented-user .icon
        // 20px - width   of .article-comment .action-delete .icon
        width: calc(100vw - (10px + 74px + 36px + 16px + 20px + 16px + 10px));
      }
    }
  }
}
</style>
