<template>
  <section>
    <div class="mute-user-card-container" @click="deleteMuteUser({ muteUserId })">
      <span class="area-mute-user-id">@{{ muteUserId }}</span>
      <span class="area-delete-label">ミュートを解除</span>
    </div>
  </section>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  props: {
    muteUserId: {
      type: String,
      required: true
    }
  },
  computed: {
    article_status() {
      return this.$route.path.startsWith('/me/articles/public') ? 'public' : 'draft'
    }
  },
  methods: {
    ...mapActions('user', ['deleteMuteUser'])
  }
}
</script>

<style lang="scss" scoped>
a {
  text-decoration: none;
}

.mute-user-card-container {
  @include cassette-shadow();
  display: grid;
  /* prettier-ignore */
  grid-template-areas:
      "mute-user-id delete-label";
  grid-template-columns: auto;
  grid-template-rows: auto;
  padding: 12px 0px 12px 0px;
  border-radius: 4px;
}

.area-mute-user-id {
  grid-area: mute-user-id;
  padding: 0px 0px 0px 8px;
}

.area-delete-label {
  grid-area: delete-label;
  color: #7f7f7f;
  font-size: 16px;
  margin: 0px 8px 0px auto;
}

@media screen and (max-width: 320px) {
  .area-import-label {
    font-size: 14px;
  }
}
</style>
