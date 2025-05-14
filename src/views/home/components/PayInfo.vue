<template>
  <Card class="PayInfo" :show-empty="true" title="薪资信息" />
</template>

<script setup>
import Card from './Card.vue'
</script>

<style lang="scss" scoped>
.PayInfo {
  width: 100%;
  height: 100%;
  /* background: rgba(10, 30, 60, 0.85); */
  box-sizing: border-box;
  color: #fff;
  display: flex;
  flex-direction: column;
  .no-data {
    width: 100%;
    height: 200px;
    text-align: center;
    line-height: 200px;
    font-size: 16px;
    color: #999;
  }
}
</style>
