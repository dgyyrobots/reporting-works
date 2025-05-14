<template>
  <Card class="LicenseHistory" :show-empty="true" title="历史生产版号" />
</template>

<script setup>
import Card from './Card.vue'
</script>

<style lang="scss" scoped>
.LicenseHistory {
  width: 100%;
  height: 100%;
  /* background: rgba(10, 30, 60, 0.85); */
  box-sizing: border-box;
  color: #fff;
  display: flex;
  flex-direction: column;
}
</style>
