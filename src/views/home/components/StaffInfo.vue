<template>
  <Card class="StaffInfo" content-padding="6px 0" title="员工信息">
    <div class="scroll-board">
      <table>
        <thead>
          <tr>
            <th v-for="(header, index) in tableHeaders" :key="index">{{ header }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, index) in tableData" :key="index" :class="{ warning: row[3] === '警告' }">
            <td
              v-for="(cell, cellIndex) in row"
              :key="cellIndex"
              :class="{
                'status-online': cellIndex === 3 && cell === '在线',
                'status-offline': cellIndex === 3 && cell === '离线',
              }"
            >
              {{ cell }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </Card>
</template>

<script setup>
import Card from './Card.vue'
import { ref, onMounted } from 'vue'

const tableHeaders = ['姓名', '工号', '职位', '状态']
const tableData = ref([
  ['张三', 'EMP001', '操作员', '在线'],
  ['李四', 'EMP002', '技术员', '离线'],
])

onMounted(() => {})
</script>

<style lang="scss" scoped>
.StaffInfo {
  width: 100%;
  height: 100%;
  /* background: rgba(10, 30, 60, 0.85); */
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

.status-online {
  color: #22cc55 !important;
  font-weight: 500;
}

.status-offline {
  color: #999999 !important;
  font-weight: 400;
}
</style>
