<template>
  <div class="area-user-info-container">
    <div class="area-profile-icon">
      <img class="profile-icon" src="~/assets/images/profile-icon1.png" alt="profile-icon">
      <div class="profile-edit" />
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
.area-user-info-container {
  display: grid;
  grid-area: user-info;
  grid-template-rows: 80px 20px 10px 1fr;
  grid-template-columns: 1fr 400px 1fr;
  grid-gap: 10px;
  /* prettier-ignore */
  grid-template-areas:
    "... profile-icon      ..."
    "... user-display-name ..."
    "... user-id           ..."
    "... self-introduction ...";
  text-align: center;
}

.area-profile-icon {
  grid-area: profile-icon;
  position: relative;

  .profile-icon {
    width: 80px;
    height: 80px;
    border-radius: 50%;
  }

  .profile-edit {
    background-image: url('~/assets/images/sp/common/icon_editprofile.png');
    background-repeat: no-repeat;
    background-size: 20px;
    bottom: 0;
    cursor: pointer;
    height: 22px;
    position: absolute;
    right: 100px;
    width: 22px;
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
    line-height: 22px;
    text-align: left;
  }
}

@media screen and (max-width: 920px) {
  .area-user-info-container {
    grid-template-columns: 1fr 340px 1fr;
    grid-column-gap: 0px;
  }
}

@media screen and (max-width: 550px) {
  .area-user-info-container {
    box-shadow: 0px 10px 10px -10px gray inset;
    grid-column-gap: 20px;
    grid-row-gap: 5px;
    grid-template-columns: 1fr 60px 280px 1fr;
    grid-template-rows: 20px 16px 12px 1fr;
    margin-top: -50px;
    /* prettier-ignore */
    grid-template-areas:
      "... ...          ...               ..."
      "... profile-icon user-display-name ..."
      "... profile-icon user-id           ..."
      "... ...          self-introduction ...";
    text-align: left;
    z-index: 2;
  }

  .area-profile-icon {
    .profile-icon {
      width: 60px;
      height: 60px;
    }

    .profile-edit {
      bottom: 10px;
      right: -300px;
      cursor: pointer;
    }
  }

  .area-user-display-name {
    .user-display-name {
      margin: 0;
    }
  }

  .area-user-id {
    .user-id {
      margin: 0;
    }
  }

  .area-self-introduction {
    grid-area: self-introduction;
    text-align: left;
  }
}

@media screen and (max-width: 375px) {
  .area-user-info-container {
    grid-template-columns: 1fr 60px 250px 1fr;
  }
}

@media screen and (max-width: 320px) {
  .area-user-info-container {
    grid-template-columns: 1fr 60px 200px 1fr;
  }
}
</style>
