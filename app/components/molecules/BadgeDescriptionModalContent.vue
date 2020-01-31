<template>
  <div class="badge-description-container">
    <img class="area-badge-image" :src="badgeDescriptionModal.metadata.image">
    <div class="area-badge-description">
      {{ badgeDescriptionModal.metadata.description }}
    </div>
    <div class="area-badge-publisher">
      発行元：{{ publisher }}
    </div>
    <div class="area-badge-supply">
      存在枚数： {{ badgeDescriptionModal.badgeTypeSupply }}
      <a
        :href="
          `https://${openSeaDomain}/${badgeDescriptionModal.badgeContractAddress}/${
            badgeDescriptionModal.tokenId
          }`
        "
        target="_blank"
      >
        <i class="fa fa-external-link-alt external-link" />
      </a>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      publisher: '',
      openSeaDomain: ''
    }
  },
  mounted() {
    // publisher 取得
    this.publisher = this.badgeDescriptionModal.metadata.attributes.find(
      (attribute) => attribute.trait_type === 'publisher'
    ).value
    // openSea の domain を取得
    this.openSeaDomain = process.env.ALIS_APP_ID === 'alis' ? 'opensea.io' : 'rinkeby.opensea.io'
  },
  computed: {
    ...mapGetters('badge', ['badgeDescriptionModal'])
  }
}
</script>

<style lang="scss" scoped>
.badge-description-container {
  display: grid;
  grid-template-rows: 92px 16px 16px;
  grid-template-columns: 125px 195px;
  /* prettier-ignore */
  grid-template-areas:
    "badge-image badge-description"
    "badge-image badge-publisher"
    "badge-image badge-supply";
  border-radius: 4px;
  justify-content: center;
  width: 100%;
  height: 124px;
  margin: 10px 0px 10px 0;
}

.area-badge-image {
  grid-area: badge-image;
  max-width: 100%;
  object-fit: contain;
  width: 115px;
  height: 124px;
  margin: 0 5px 0 5px;
}

.area-badge-description {
  grid-area: badge-description;
  color: #6e6e6e;
  display: block;
  font-size: 11px;
  margin: 10px 5px 0 0;
  text-align: left;
  line-height: 1.5;
}

.area-badge-publisher {
  grid-area: badge-publisher;
  color: #6e6e6e;
  display: block;
  font-size: 11px;
  text-align: left;
  line-height: 1.5;
  margin: auto 0 auto 0;
}

.area-badge-supply {
  grid-area: badge-supply;
  color: #6e6e6e;
  display: block;
  font-size: 11px;
  text-align: left;
  line-height: 1.5;
  margin: auto 0 auto 0;
}

.external-link {
  color: #0086cc;
  cursor: pointer;
  margin-left: 3px;
}
</style>
