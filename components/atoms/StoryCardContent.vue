<template>
  <div class="area-story-card-content">
    <h2 class="area-title">
      {{ story.title }}
    </h2>
    <div class="flag"></div>
    <p class="area-body">
      {{ plainBody }}
    </p>
    <div class="data">
      <p class="name">{{ story.username }}</p>
      <p class="date">{{ story.createdAt }}</p>
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
      return tokenAmount > 999 ? (tokenAmount / 1000).toFixed(1) + 'k' : tokenAmount
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
  grid-area: story-card-content;
  /* prettier-ignore */
  grid-template-areas:
    "title ..."
    "...   ..."
    "body  body";
  grid-template-columns: 250px 28px;
  grid-template-rows: 37px 16px 38px;
  padding: 20px 25px;
  position: relative;
}

.area-title {
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  color: #3f3f3f;
  display: -webkit-box;
  font-size: 16px;
  grid-area: title;
  letter-spacing: 0.05em;
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
  color: #5f5f5f;
  display: -webkit-box;
  font-size: 11.1px;
  grid-area: body;
  margin: 7px 0;
  overflow: hidden;
  text-overflow: ellipsis;
}

.data {
  /* TODO: 画像を丸くして表示する処理を加える */
  /* background: url('~assets/profile-icon1.png'); */
  background-repeat: no-repeat;
  bottom: 18px;
  left: 18px;
  position: absolute;
}

.name,
.date {
  color: #717171;
  display: block;
  font-size: 12px;
  margin-left: 43px;
}

.token-amount {
  /* background: url('~assets/alis-icon-mini.png'); */
  background-repeat: no-repeat;
  bottom: 18px;
  color: #717171;
  font-size: 13px;
  padding-left: 25px;
  position: absolute;
  right: 28px;
}
</style>
