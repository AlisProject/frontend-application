<template>
  <div class="badge-card-container" @click="showBadgeDescriptionModal">
    <img class="area-badge-image" :src="metadata.image">
    <img class="area-publisher-logo" :src="metadata.publisher_logo">
    <div class="area-badge-name">
      {{ metadata.name }}
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  props: {
    tokenId: {
      type: Number
    },
    metadata: {
      type: Object
    }
  },
  methods: {
    async showBadgeDescriptionModal() {
      await this.fetchBadgeTypeSupply({ tokenId: this.tokenId })
      this.setBadgeDescriptionModal({
        isShow: true,
        tokenId: this.tokenId,
        metadata: this.metadata
      })
    },
    ...mapActions('badge', ['setBadgeDescriptionModal', 'fetchBadgeTypeSupply'])
  }
}
</script>

<style lang="scss" scoped>
.badge-card-container {
  @include cassette-shadow-small();
  display: grid;
  grid-template-rows: 131px 49px;
  grid-template-columns: 39px 91px;
  /* prettier-ignore */
  grid-template-areas:
    "badge-image    badge-image"
    "publisher-logo badge-name ";
  border-radius: 4px;
  width: 130px;
  height: 180px;
  cursor: pointer;
}

.area-badge-image {
  grid-area: badge-image;
  max-width: 100%;
  object-fit: contain;
  width: 115px;
  height: 124px;
  margin: 3px 7px 4px 7px;
}

.area-publisher-logo {
  grid-area: publisher-logo;
  max-width: 100%;
  object-fit: contain;
  margin: 12px 7px 12px 11px;
  width: 25px;
  height: 25px;
}

.area-badge-name {
  display: grid;
  grid-area: badge-name;
  text-align: center;
  line-height: 15.5px;
  color: #555555;
  font-size: 11px;
  font-weight: bold;
  overflow: hidden;
  margin: auto 7px auto 0;
}

@media screen and (max-width: 550px) {
  .badge-card-container {
    grid-template-rows: 99.5px 36.5px;
    grid-template-columns: 25px 71px;
    width: 96px;
    height: 136px;
  }

  .area-badge-image {
    width: 86px;
    height: 92px;
    margin: 3px 5px 4px 5px;
  }

  .area-publisher-logo {
    margin: 10.5px 5px 10.5px 5px;
    width: 15px;
    height: 15px;
  }

  .area-badge-name {
    line-height: 13.5px;
    font-size: 10px;
    margin: auto 5px auto 0;
    text-overflow: ellipsis;
    height: 28px;
  }
}
</style>
