<template>
  <div class="area-footer-actions">
    <div class="action comment"></div>
    <div class="action bookmark"></div>
    <div class="action twitter"></div>
    <div class="action like"></div>
  </div>
</template>

<style lang="scss" scoped>
.area-footer-actions {
  display: grid;
  grid-area: footer-actions;
  grid-template-rows: 70px;
  grid-template-columns: repeat(4, 60px);
  justify-content: right;

  .action {
    background: white;
    border: 1px solid #fefefe;
    box-shadow: 0px 5px 15px -1px #c1c1c1;
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }

  .like {
    background: #ff4949;
    border: 1px solid #ff4949;
    box-shadow: 0px 5px 15px -1px #ff8989;
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
}

@media screen and (max-width: 640px) {
  .area-footer-actions {
    position: relative;

    &:after {
      bottom: 48px;
      box-shadow: 0 15px 10px -10px rgba(192, 192, 192, 0.5);
      content: '';
      height: 100px;
      opacity: 0.5;
      position: absolute;
      width: 100%;
    }
  }

  .action {
    z-index: 1;
  }
}
</style>
