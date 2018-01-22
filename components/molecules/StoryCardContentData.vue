<template>
  <div class="area-data">
    <story-card-content-data-profile-icon/>
    <story-card-content-data-username :username="story.user.username"/>
    <story-card-content-data-created-at :createdAt="story.createdAt"/>
  </div>
</template>

<script>
import StoryCardContentDataProfileIcon from '../atoms/StoryCardContentDataProfileIcon'
import StoryCardContentDataUsername from '../atoms/StoryCardContentDataUsername'
import StoryCardContentDataCreatedAt from '../atoms/StoryCardContentDataCreatedAt'

export default {
  props: ['story'],
  components: {
    StoryCardContentDataProfileIcon,
    StoryCardContentDataUsername,
    StoryCardContentDataCreatedAt
  }
}
</script>

<style lang="scss" scoped>
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
}

.long-story-card {
  .area-data {
    align-self: flex-end;
  }
}
</style>
