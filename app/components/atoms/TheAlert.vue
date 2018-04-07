<template>
  <div class="alert" v-if="showAlert">
    <span class="text">{{ alertText }}</span>
    <div class="close" @click="closeAlert">✕</div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  methods: {
    closeAlert() {
      this.setAlert({ showAlert: false })
    },
    ...mapActions('user', ['setAlert'])
  },
  computed: {
    ...mapGetters('user', ['showAlert', 'alertText'])
  }
}
</script>


<style lang="scss" scoped>
.alert {
  background: #858dda;
  height: 36px;
  width: 80%;
  position: absolute;
  right: 10%;
  top: 100px;

  .text {
    font-size: 14px;
    color: #fff;
    float: left;
    line-height: 36px;
    margin-left: 10px;
  }

  .close {
    margin: 10px 10px 0 0;
    float: right;
    width: 14px;
    height: 14px;
    background: #fff;
    border-radius: 50%;
    color: #858dda;
    font-size: 12px;
    box-sizing: border-box;
    padding-left: 2.5px;
    cursor: pointer;
  }
}

@media screen and (max-width: 640px) {
  .alert {
    width: 100%;
    right: 0;
    top: 70px;
  }
}
</style>
