<template>
  <Card class="StaffInfo" content-padding="6px 0" :title="title">
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
                'status-online': cellIndex === 3 && cell === '上工',
                'status-offline': cellIndex === 3 && cell !== '上工',
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
import { getCurrentWorker } from '@/api/mes/wk/index.ts'

// 定义props
const props = defineProps({

  currentWorkcenter: {
    type: Object,
    default: () => ({})
  },
  currentDevice: {
    type: Object,
    default: () => ({})
  },
})
const tableHeaders = ['姓名', '工号', '班次', '状态']
const tableData = ref([
  // ['张三', 'EMP001', '操作员', '上工'],
  // ['李四', 'EMP002', '技术员', '离线'],
])
const title = ref('员工信息')

const initData = () => {
  const device = props.currentDevice
  const currentWorkcenter = props.currentWorkcenter
  const timestamp = new Date().getTime()
  const data = {
    wc_id: currentWorkcenter.id,
    bill_date: timestamp,
    status_id:0,
    device_id:device.id
  }
  getCurrentWorker(data).then((res) => {
    tableData.value = []
    title.value = res.length > 0 ? `员工信息(${res[0]?.classtype_name})` : '员工信息'
    res.map((item) => {
      const name = item.emp_name || '--'
      const number = item.emp_number || '--'
      const status = item.status_name || '--'
      const classtype_name = item.classtype_name || '--'
      tableData.value.push([name, number, classtype_name, status])
    })
  })
}
watch(() => props.currentDevice, (newDevice, oldDevice) => {
  if (newDevice && newDevice.id && newDevice.id !== oldDevice?.id) {
    initData()
  }
}, { deep: true })

// 同样监听 currentWorkcenter 变化
watch(() => props.currentWorkcenter, (newWorkcenter, oldWorkcenter) => {
  if (newWorkcenter && newWorkcenter.id && newWorkcenter.id !== oldWorkcenter?.id) {
    initData()
  }
}, { deep: true })


onMounted(() => {
  initData()
})
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
