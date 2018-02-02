<template>
  <div class="logged-in">
    <img class="profile-icon" src="~assets/images/profile-icon1.png" @click="toggleMenu">
    <img class="notification-icon" src="~assets/images/notification.png">
    <img class="search-icon" src="~assets/images/pc/common/icon_search.png">
    <div class="menu" v-show="isMenuShown">
      <div class="image-box">
        <img src="~assets/images/top-story-card-image.png" class="profile-image">
      </div>
      <div class="token-amount">
        <p class="alis-hold-amount">ALIS保有数</p>
        <p class="alis-token-amount">2500 <span class="token-unit">ALIS</span></p>
      </div>
      <ul class="menu-links">
        <li class="menu-link">
          <a href="/stories/new">新規ストーリー</a>
        </li>
        <li class="menu-link">
          <nuxt-link to="/stories/public">マイストーリー</nuxt-link>
        </li>
        <li class="menu-link">
          <nuxt-link to="#">ブックマーク</nuxt-link>
        </li>
        <li class="menu-link">
          <nuxt-link to="#">ウォレット</nuxt-link>
        </li>
        <li class="menu-link">
          <nuxt-link to="#">友達を招待</nuxt-link>
        </li>
        <li class="menu-link">
          <nuxt-link to="#">ALISの使い方</nuxt-link>
        </li>
        <li class="menu-link">
          <nuxt-link to="#">設定</nuxt-link>
        </li>
      </ul>
      <nuxt-link to="#" class="logout">アカウント切り替え</nuxt-link>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isMenuShown: false
    }
  },
  mounted() {
    this.listen(window, 'click', (event) => {
      if (!this.$el.contains(event.target)) {
        this.closeMenu()
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
  methods: {
    toggleMenu() {
      this.isMenuShown = !this.isMenuShown
    },
    closeMenu() {
      this.isMenuShown = false
    },
    listen(target, eventType, callback) {
      if (!this._eventRemovers) {
        this._eventRemovers = []
      }
      target.addEventListener(eventType, callback)
      this._eventRemovers.push({
        remove: function() {
          target.removeEventListener(eventType, callback)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.logged-in {
  border-top: 6px solid #4a4a4a;
  padding-top: 30px;
  position: fixed;
  top: 340px;
  transform: rotate(90deg);
  width: 102px;
  position: relative;

  .profile-icon {
    float: left;
    padding: 4px;
    transform: rotate(-90deg);
    width: 30px;
    height: 30px;
    border-radius: 50%;
  }

  .notification-icon {
    float: left;
    padding-right: 4px;
    transform: rotate(-90deg);
  }

  .search-icon {
    float: left;
    padding: 7px 4px;
    transform: rotate(-90deg);
  }
}

.menu {
  background: white;
  border-radius: 4px;
  box-sizing: border-box;
  color: #000000;
  filter: drop-shadow(0 2px 4px rgba(192, 192, 192, 0.5));
  padding: 24px 41px;
  position: absolute;
  right: 42px;
  top: -80px;
  transform: rotate(-90deg);
  width: 240px;

  &:before {
    content: '';
    height: 0;
    position: absolute;
    right: 0;
    width: 0;
  }

  &:before {
    border-bottom: 20px solid transparent;
    border-left: 40px solid white;
    border-right: 0px solid transparent;
    border-top: 20px solid transparent;
    margin: -20px -20px 0 0;
    top: 368px;
  }

  .image-box {
    height: 160px;
    margin: -24px 0 0 -41px;
    overflow: hidden;
    width: 240px;

    .profile-image {
      object-fit: cover;
      width: 100%;
    }
  }

  .token-amount {
    color: #040404;

    .alis-hold-amount {
      background: url('~assets/images/alis-icon-mini.png') no-repeat;
      font-size: 14px;
      line-height: 21px;
      margin: 30px 20px 0;
      padding-left: 24px;
      width: 100px;
    }

    .alis-token-amount {
      font-size: 28px;
      font-weight: bold;
      margin-top: 10px;
      text-align: center;

      .token-unit {
        font-size: 14px;
      }
    }
  }

  .menu-links {
    list-style: none;
    padding: 0;

    .menu-link {
      font-size: 16px;
      font-weight: 500;
      height: 24px;
      letter-spacing: 1px;
      line-height: 24px;
      margin-bottom: 12px;
      padding-left: 0.5em;
      width: 119px;

      a {
        display: block;
        text-decoration: none;
        color: #000;

        &:visited {
          color: #000;
        }
      }
    }
  }

  .logout {
    color: #000;
    font-size: 14px;
    line-height: 21px;
    margin-left: 6px;
    text-decoration: none;

    &:visited {
      color: #000;
    }
  }
}

@media screen and (max-width: 550px) {
  .logged-in {
    border: none;
    grid-area: session;
    padding: 0;
    position: static;
    right: -46px;
    top: 340px;
    transform: rotate(0);
    width: 160px;

    .profile-icon {
      border-radius: 50%;
      float: right;
      height: 30px;
      padding: 4px;
      transform: rotate(0);
      width: 30px;
    }

    .notification-icon {
      float: right;
      padding-right: 4px;
      transform: rotate(0);
    }

    .search-icon {
      float: right;
      padding: 7px 4px;
      transform: rotate(0);
    }
  }

  .menu {
    right: -16px;
    top: -26px;
    width: 280px;
    transform: rotate(0);

    &:before {
      display: none;
    }

    .image-box {
      height: 160px;
      width: 280px;
    }

    .menu-links {
      list-style: none;
      padding: 0;
      margin-bottom: 40px;

      .menu-link {
        margin-bottom: 20px;
      }
    }
  }
}
</style>
