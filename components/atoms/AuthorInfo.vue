<template>
  <div class="area-author-info-container">
    <div class="author">
      <img class="author-icon" :src="article.user.icon_image_url">
      <span class="name">{{ article.user.user_display_name }}</span>
      <span class="created-at">{{ formettedCreatedAt }}</span>
    </div>
    <div class="token-amount">{{ article.alisToken }}</div>
    <button class="follow-button">Follow</button>
    <img class="menu" src="~assets/images/menu.png" alt="menu">
  </div>
</template>

<script>
export default {
  props: ['article'],
  computed: {
    formettedCreatedAt() {
      return new Date(this.article.created_at).toLocaleDateString('ja')
    }
  }
}
</script>

<style lang="scss" scoped>
.area-author-info-container {
  display: grid;
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
  border-radius: 50%;
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
  background: url('~assets/images/pc/common/logo_casset_alis.png');
  align-self: center;
  background-repeat: no-repeat;
  color: #717171;
  font-size: 14px;
  grid-area: token-amount;
  padding: 0 20px;
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

@media screen and (max-width: 640px) {
  .area-author-info-container {
    grid-template-rows: 10px 40px 20px 10px;
    grid-template-columns: 5px min-content 1fr 95px 50px;
    grid-template-areas:
      '... ...          ... ...           ... '
      '... author       ... follow-button menu'
      '... token-amount ... ...           ... '
      '... ...          ... ...           ... ';
    border: 1px solid #e1e1e1;
    border-radius: 3px;
  }

  .author {
    display: grid;
    grid-area: author;
    grid-template-columns: 50px 100px;
    grid-template-areas:
      'author-icon name      '
      'author-icon created-at';
  }

  .author-icon {
    align-self: center;
    grid-area: author-icon;
    height: 40px;
    justify-self: center;
    width: 40px;
  }

  .name,
  .created-at {
    font-size: 14px;
  }

  .token-amount {
    margin-left: 45px;
  }

  .follow-button {
    border-radius: 20px;
    font-size: 14px;
    margin: 5px 8px;
    padding: 0;
  }

  .menu {
    justify-self: center;
  }
}
</style>
