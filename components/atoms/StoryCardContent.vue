<template>
  <div class="area-story-card-content">
    <h2 class="area-title">
      {{ story.title }}
    </h2>
    <div class="flag"></div>
    <p class="area-body">
      {{ plainBody }}
    </p>
    <div class="area-data">
      <img class="area-profile-icon" src="~assets/images/profile-icon1.png" alt="">
      <p class="area-name">{{ story.user.username }}</p>
      <p class="area-date">{{ story.createdAt }}</p>
    </div>
    <p class="token-amount">{{ formattedTokenAmount }}</p>
  </div>
</template>

<script>
export default {
  props: ['story'],
  computed: {
    formattedTokenAmount() {
      const { tokenAmount } = this.story
      return tokenAmount > 999 ? (tokenAmount / 1000).toFixed(2) + 'k' : tokenAmount
    },
    plainBody() {
      const { body } = this.story
      return body.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, '')
    }
  }
}
</script>

<style lang="scss" scoped>
.area-story-card-content {
  background: white;
  display: grid;
  font-family: YuGothic;
  grid-area: story-card-content;
  grid-gap: 6px;
  /* prettier-ignore */
  grid-template-areas:
    "title ... "
    "body  body"
    "data  ... ";
  grid-template-columns: 248px 44px;
  grid-template-rows: 48px 44px 40px;
  padding: 18px 24px;
  position: relative;
}

.area-title {
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  color: #3f3f3f;
  display: -webkit-box;
  font-size: 16px;
  font-weight: 500;
  grid-area: title;
  letter-spacing: 0.05em;
  line-height: 24px;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
}

.flag {
  background: white;
  border-radius: 50%;
  border: 1px solid #fefefe;
  box-shadow: 0px 5px 15px -1px #b1b1b1;
  height: 30px;
  position: absolute;
  right: 24px;
  top: 20px;
  width: 30px;
}

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

.area-data {
  color: #717171;
  display: grid;
  font-size: 12px;
  grid-area: data;
  /* prettier-ignore */
  grid-template-areas:
    "profile-icon  name"
    "profile-icon  date";
  grid-template-columns: 40px 100px;
  grid-template-rows: 20px 20px;
  line-height: 18px;

  > * {
    margin: 0;
  }

  .area-profile-icon {
    grid-area: profile-icon;
    height: 36px;
    width: 36px;
  }

  .area-name {
    align-self: flex-end;
    grid-area: name;
  }

  .area-date {
    grid-area: date;
  }
}

.token-amount {
  background: url('~assets/images/alis-icon-mini.png') no-repeat;
  bottom: 20px;
  color: #717171;
  font-size: 12px;
  height: 22px;
  margin: 0;
  padding: 3px 0 0 25px;
  position: absolute;
  right: 24px;
}

.long-story-card {
  .area-story-card-content {
    grid-template-rows: 52px 76px;
    grid-template-columns: 420px 60px;
    grid-area: long-story-card-content;
    grid-gap: 12px;
    padding: 28px;
  }

  .area-title {
    font-weight: bold;
    line-height: 28px;
    font-size: 19px;
  }

  .area-body {
    -webkit-line-clamp: 3;
    font-size: 14px;
    line-height: 24px;
  }

  .area-data {
    align-self: flex-end;
  }

  .token-amount {
    bottom: 25px;
    font-size: 14px;
    position: absolute;
    right: 28px;
  }
}
</style>
