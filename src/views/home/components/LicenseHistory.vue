<template>
  <Card class="LicenseHistory" content-padding="6px 0" title="历史生产版号">
    <template #titleRight>
      <div class="search-container">
        <div class="input-wrapper">
          <input v-model="searchKeyword" class="search-input" placeholder="请输入关键词" type="text" />
          <span v-if="searchKeyword" class="clear-btn" @click="clearSearch">×</span>
        </div>
        <button class="search-btn">查询</button>
      </div>
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
import { ref, onMounted } from 'vue'

const searchKeyword = ref('')

const clearSearch = () => {
  searchKeyword.value = ''
}

const tableHeaders = ['日期', '版号', '产量', '状态']
const tableData = ref([
  ['2023-05-22', 'BH001', '2345', '正常'],
  ['2023-05-21', 'BH002', '3456', '正常'],
  ['2023-05-20', 'BH003', '1235', '警告'],
  ['2023-05-19', 'BH004', '5432', '正常'],
])

onMounted(() => {})
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

.search-container {
  display: flex;
  align-items: center;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  margin-right: 8px;
}

.search-input {
  height: 28px;
  width: 160px;
  background: rgba(10, 42, 80, 0.5);
  border: 1px solid rgba(33, 158, 252, 0.6);
  border-radius: 4px;
  color: #fff;
  padding: 0 30px 0 10px;
  outline: none;
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
}

.clear-btn {
  position: absolute;
  right: 8px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 18px;
  line-height: 18px;
  cursor: pointer;
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    color: #fff;
  }
}

.search-btn {
  height: 28px;
  background: linear-gradient(180deg, #1573ce 0%, #0a2a50 100%);
  border: 1px solid #219efc;
  border-radius: 4px;
  color: #fff;
  padding: 0 12px;
  cursor: pointer;
  &:hover {
    background: linear-gradient(180deg, #1e85e2 0%, #0c315e 100%);
  }
}

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
</style>
