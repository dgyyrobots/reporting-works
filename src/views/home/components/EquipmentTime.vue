<template>
  <Card class="EquipmentTime" content-padding="6px 0" title="设备计时">
    <template #titleRight>
      <button class="query-btn">查看明细</button>
    </template>
    <div class="scroll-board">
      <table>
        <thead>
          <tr>
            <th v-for="(header, index) in tableHeaders" :key="index">{{ header }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, index) in tableData" :key="index" :class="{ warning: row[3] === '警告' }">
            <td v-for="(cell, cellIndex) in row" :key="cellIndex">{{ cell }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </Card>
</template>

<script setup>
import Card from './Card.vue'
// 这里可以接收props或后续做数据对接
import { ref, onMounted } from 'vue'

const tableHeaders = ['时间', '产线', '产量', '状态']
const tableData = ref([
  ['10:22:33', 'MQ05', '2345', '正常'],
  ['10:22:34', 'MQ06', '2346', '正常'],
])

onMounted(() => {})
</script>

<style lang="scss" scoped>
.EquipmentTime {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  color: #fff;
  display: flex;
  flex-direction: column;
  .scroll-board {
    height: 100%;
    overflow: hidden;

    table {
      width: 100%;
      border-collapse: collapse;

      th {
        padding: 10px 6px;
        text-align: center;
        font-size: 15px;
        color: #00bcd4;
        border-bottom: 1px solid rgba(0, 188, 212, 0.3);
      }

      td {
        padding: 12px 6px;
        text-align: center;
        font-size: 15px;
        color: #86c9f2;
        border-bottom: 1px solid rgba(0, 161, 255, 0.2);
      }

      tr {
        transition: all 0.3s;

        &:nth-child(even) {
          background: rgba(#00a1ff, 0.05);
        }

        &.warning {
          background: rgba(#ffb74d, 0.1);

          td {
            color: #ffb74d;
          }
        }

        &:hover {
          background: rgba(#00a1ff, 0.15);
        }
      }
    }
  }
  .query-btn {
    background-color: #00bcd4;
    color: #fff;
    border: none;
    padding: 4px 15px;
    border-radius: 2px;
    cursor: pointer;
    font-size: 14px;

    &:hover {
      background-color: #19b8e6;
    }
  }
}
</style>
