<template>
  <Card class="EquipmentTime" title="设备计时" />
</template>

<script setup>
import Card from './Card.vue'
// 这里可以接收props或后续做数据对接
</script>

<style lang="scss" scoped>
.EquipmentTime {
  width: 100%;
  height: 100%;
  /* background: rgba(10, 30, 60, 0.85); */
  box-sizing: border-box;
  color: #fff;
  display: flex;
  flex-direction: column;
}
</style>
