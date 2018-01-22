<template>
  <div class="area-author-info-container">
    <div class="author">
      <img class="author-icon" src="~assets/images/profile-icon1.png">
      <span class="name">{{ story.user.username }}</span>
      <span class="created-at">{{ story.createdAt }}</span>
    </div>
    <div class="token-amount">{{ story.tokenAmount }}</div>
    <button class="follow-button">Follow</button>
    <img class="menu" src="~assets/images/menu.png" alt="menu">
  </div>
</template>

<script>
export default {
  props: ['story']
}
</script>

<style lang="scss" scoped>
.area-author-info-container {
  display: grid;
  font-family: YuGothic;
  grid-area: author-info;
  grid-template-areas:
    '...    ... ...          ...           ... '
    'author ... token-amount follow-button menu';
  grid-template-columns: min-content 1fr 80px 150px 50px;
  grid-template-rows: 50px min-content;
}

.author {
  display: grid;
  grid-area: author;
  grid-template-areas:
    'author-icon name      '
    'author-icon created-at';
  grid-template-columns: 70px 100px;
}

.author-icon {
  grid-area: author-icon;
  height: 60px;
  width: 60px;
}

.name {
  align-self: flex-end;
  color: #717171;
  font-size: 16px;
  grid-area: name;
}

.created-at {
  color: #717171;
  font-size: 16px;
  grid-area: created-at;
}

.token-amount {
  background: url('~assets/images/alis-icon-mini.png');
  align-self: center;
  background-repeat: no-repeat;
  color: #717171;
  font-size: 14px;
  grid-area: token-amount;
  padding: 2px 25px;
}

.follow-button {
  background-color: #fff;
  background: none;
  border-radius: 16px;
  border: 1px solid #cacaca;
  color: #717171;
  cursor: pointer;
  font-size: 16px;
  grid-area: follow-button;
  margin: 14px 18px;
  outline: 0;
  padding: 5px;
}

.menu {
  align-self: center;
  grid-area: menu;
  justify-self: flex-end;
}
</style>
