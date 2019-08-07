<template>
  <div class="area-mute-user-card-list-container">
    <mute-user-card v-for="muteUser in muteUsers" :key="muteUser" :muteUserId="muteUser" />
  </div>
</template>

<script>
import MuteUserCard from './MuteUserCard'

export default {
  components: {
    MuteUserCard
  },
  props: {
    muteUsers: {
      type: Array,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
.area-mute-user-card-list-container {
  display: grid;
  grid-area: mute-user-card-list;
  grid-gap: 14px;
  grid-auto-rows: min-content;
  padding: 0px 0px 30px 0px;
}

.current-card {
  @include cassette-shadow();
  display: grid;
  /* prettier-ignore */
  grid-template-areas:
    "current-label";
  grid-template-columns: auto;
  grid-template-rows: auto;
  padding: 12px 0px 12px 0px;
  border-radius: 4px;
  text-decoration: none;
}

.current-label {
  grid-area: current-label;
  color: #7f7f7f;
  font-size: 16px;
  margin: 0px auto 0px 12px;
}

.caution-statement {
  color: #7f7f7f;
  font-size: 13px;
}

@media screen and (max-width: 640px) {
  .area-mute-user-card-list-container {
    grid-gap: 10px;
  }
}
</style>
