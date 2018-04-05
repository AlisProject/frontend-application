<template>
  <div class="area-author-info-container">
    <div class="area-author-icon">
      <img class="author-icon" src="~/assets/images/profile-icon1.png" alt="profile-icon">
    </div>
    <div class="area-user-display-name">
      <p class="user-display-name">
        {{ user.userDisplayName }}
      </p>
    </div>
    <div class="area-user-id">
      <p class="user-id">
        @{{ user.userId }}
      </p>
    </div>
    <div class="area-self-introduction">
      <p class="self-introduction">
        {{ user.selfIntroduction }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    user: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
.area-author-info-container {
  border-radius: 6px;
  box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.15);
  display: grid;
  grid-area: author-info;
  grid-column-gap: 20px;
  grid-row-gap: 10px;
  grid-template-columns: 80px 1fr;
  grid-template-rows: 16px 12px 1fr;
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
}

.area-user-id {
  grid-area: user-id;

  .user-id {
    color: #6e6e6e;
    font-size: 12px;
    height: 12px;
    line-height: 18px;
  }
}

.area-self-introduction {
  grid-area: self-introduction;

  .self-introduction {
    color: #030303;
    font-size: 14px;
    line-height: 24px;
  }
}

@media screen and (max-width: 640px) {
  .area-author-info-container {
    box-shadow: none;
    padding: 10px 0;
  }
}
</style>
