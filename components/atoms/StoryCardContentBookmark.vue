<template>
  <div class="bookmark"></div>
</template>

<style lang="scss" scoped>
.bookmark {
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

@media screen and (max-width: 1296px) {
  .long-story-card {
    .bookmark {
      display: none;
    }
  }
}

@media screen and (max-width: 550px) {
  .long-story-card {
    .bookmark {
      display: initial;
      right: 15px;
      top: -15px;
    }
  }
}
</style>
