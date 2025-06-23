<template>
  <el-dialog
    v-model="visible"
    class="production-report-dialog"
    :close-on-click-modal="false"
    :modal-class="'cyber-modal'"
    :show-close="true"
    title="新增生产日报表"
    width="94vw"
  >
    <div class="dialog-content" v-if="visible">
      <ProductionReportForm ref="formRef"  :currentDevice="currentDevice" :currentWorkcenter="currentWorkcenter"/>
      
      <!-- 新增按钮组 -->
      <div class="action-btns">
        <button class="cyber-btn" @click="handleGetPersonnel">
          <Icon class="btn-icon" icon="svg-icon:set" :style="{ color: '#1ecfff' }" />
          获取人员
        </button>
        <button class="cyber-btn" @click="handleGetProduction">
          <Icon class="btn-icon" icon="svg-icon:set" :style="{ color: '#1ecfff' }" />
          获取产量
        </button>
        <button class="cyber-btn" @click="handleGetDeviceHours">
          <Icon class="btn-icon" icon="svg-icon:set" :style="{ color: '#1ecfff' }" />
          获取设备工时
        </button>
      </div>


      <!-- 新增表格组件 -->
      <ProductionReportTable ref="ProductionReportTableRef" />
      <ProductionMaterialTable ref="ProductionMaterialTableRef"/>
      <ProcessTable ref="ProcessTableRef"/>
      <MoldOperationTable ref="MoldOperationTableRef"/>

    </div>
    <template #footer>
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleSubmit">提交</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, defineExpose, defineProps } from 'vue'
import ProductionReportForm from './ProductionReportForm.vue'
import { Icon } from '/@/components/Icon'
import { ElMessage } from 'element-plus'
import ProductionReportTable from './ProductionReportTable.vue'
import ProductionMaterialTable from './ProductionMaterialTable.vue'
import ProcessTable from './ProcessTable.vue'
import MoldOperationTable from './MoldOperationTable.vue'
import confetti from 'canvas-confetti'
import { sendReport ,getEntry1,getEntry3 ,getEntry4} from '@/api/mes/wk/index.ts'
const visible = ref(false)
const formRef = ref(null)
const ProductionReportTableRef=ref(null)
const ProductionMaterialTableRef =ref(null)
const ProcessTableRef = ref(null)
const MoldOperationTableRef = ref(null)

// 定义props
const props = defineProps({
  currentDevice: {
    type: Object,
    default: () => ({})
  },
  currentWorkcenter: {
    type: Object,
    default: () => ({})
  },
})
function openDialog() {
  visible.value = true
}

function closeDialog() {
  visible.value = false
}

function handleCancel() {
  closeDialog()
}

// 撒花庆祝效果
function celebrateSuccess() {
  const duration = 3000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

  function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  const interval = setInterval(function() {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);
    
    // 从左边和右边发射彩花
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
    });
    
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
    });
  }, 250);
}

const generateLowercase32 = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyz'; // 仅小写字母
    let result = '';
    for (let i = 0; i < 32; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        result += chars[randomIndex];
    }
    return result;
}

function handleSubmit() {
  // 获取表单数据
  const loginInfo = JSON.parse(localStorage.getItem('loginInfo'))
  const formData = formRef.value?.formData
  // 校验表单必填项
  if (!formData.wc_name) {
    ElMessage.error('工作中心为必录项, 请录入内容!');
    return;
  }
  
  if (!formData.wp_number) {
    ElMessage.error('工序为必录项, 请录入内容!');
    return;
  }
  
  if (!formData.wp_class_number) {
    ElMessage.error('班次为必录项, 请录入内容!');
    return;
  }
  if (!formData.device_number) {
    ElMessage.error('设备为必录项, 请录入内容!');
    return;
  }
  
  // 转换日期为时间戳
// 转换日期为秒级时间戳
if (formData.reportDate) {
    formData.reportDate = Math.floor(new Date(formData.reportDate).getTime() / 1000);
  }

  if (formData.bill_date) {
    formData.bill_date = Math.floor(new Date(formData.bill_date).getTime() / 1000);
  }
  
  // 转换其他可能的日期字段为秒级时间戳
  if (formData.start_date) {
    formData.start_date = Math.floor(new Date(formData.start_date).getTime() / 1000);
  }
  
  if (formData.end_date) {
    formData.end_date = Math.floor(new Date(formData.end_date).getTime() / 1000);
  }

  const entry3 =  ProductionReportTableRef.value?.tableData
  const entry1 =  ProductionMaterialTableRef.value?.tableData
  const entry4 =  ProcessTableRef.value?.tableData
  const entry2 =  MoldOperationTableRef.value?.tableData

    // 验证员工是否填写
  if (entry3 && entry3.length > 0) {
    for (let i = 0; i < entry3.length; i++) {
      if (!entry3[i].emp_name) {
        ElMessage.error('员工为必录项, 请录入内容!');
        return;
      }
    }
  }
  
  if (entry3 && entry3.length > 0) {
    entry3.forEach(item => {
      if (item.start_date) {
        // 如果已经是Date对象，则转换为秒级时间戳
        if (item.start_date instanceof Date) {
          item.start_date = Math.floor(item.start_date.getTime() / 1000);
        } else {
          // 否则先转为Date对象再转为秒级时间戳
          item.start_date = Math.floor(new Date(item.start_date).getTime() / 1000);
        }
      }
      
      if (item.end_date) {
        if (item.end_date instanceof Date) {
          item.end_date = Math.floor(item.end_date.getTime() / 1000);
        } else {
          item.end_date = Math.floor(new Date(item.end_date).getTime() / 1000);
        }
      }
      
      if (item.start_operate_date) {
        if (item.start_operate_date instanceof Date) {
          item.start_operate_date = Math.floor(item.start_operate_date.getTime() / 1000);
        } else {
          item.start_operate_date = Math.floor(new Date(item.start_operate_date).getTime() / 1000);
        }
      }
      
      if (item.end_operate_date) {
        if (item.end_operate_date instanceof Date) {
          item.end_operate_date = Math.floor(item.end_operate_date.getTime() / 1000);
        } else {
          item.end_operate_date = Math.floor(new Date(item.end_operate_date).getTime() / 1000);
        }
      }
    });
  }


const save_data = [{
	"data": {
    ...formData,
	},
	"object_data_key": "bill_mes_daily_report_header",
	"structure": "header"
}, {
	"data": entry3,
	"object_data_key": "bill_mes_daily_report_entry3",
	"structure": "entry3"
}, {
	"data": entry1,
	"object_data_key": "bill_mes_daily_report_entry1",
	"structure": "entry1"
}, {
	"data": entry4,
	"object_data_key": "bill_mes_daily_report_entry4",
	"structure": "entry4"
}, {
	"data": entry2,
	"object_data_key": "bill_mes_daily_report_entry2",
	"structure": "entry2"
}]
// 转化时间格式
const data = {
  delete_data:JSON.stringify({}),
  view_key:"xgocykfl",
  root_view_key:"xgocykfl",
  object_key:"bill_mes_daily_report",
  context_company_id: loginInfo.stored_company,
  model_name:'',
  scene_name:'',
  post_token: generateLowercase32(),
  save_data: JSON.stringify(save_data),
}

  // 提交逻辑后续补充
  sendReport(data).then((res) => {
    if(res.ret===0) {
      ElMessage.success('提交成功！');
      celebrateSuccess();
      // 延迟关闭对话框，让用户能看到撒花效果
      setTimeout(() => {
        closeDialog();
      }, 1500);
    }else {
      ElMessage.error(res.msg);
    }
  }).catch((error) => {
    console.error('提交失败', error);
  });
  

}
// 提取的可复用函数：根据班次计算开始和结束时间
const calculateTimeRange = (shiftName) => {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  
  let startTime
  
  // 判断班次类型
  if (shiftName && shiftName.includes('白班')) {
    // 白班：当天 07:30:00
    startTime = new Date(today)
    startTime.setHours(7, 30, 0)
  } else {
    // 晚班：昨天 19:30:00
    startTime = new Date(yesterday)
    startTime.setHours(19, 30, 0)
  }
  
  // 转为秒级时间戳
  const startTimestamp = Math.floor(startTime.getTime() / 1000)
  // 结束时间为当前时间
  const endTimestamp = Math.floor(Date.now() / 1000)
  
  return {
    startDate: startTimestamp,
    endDate: endTimestamp
  }
}
// 新增按钮处理函数
function handleGetPersonnel() {
  // 获取表单数据
  const formData = formRef.value?.formData
  
  // 校验必要参数
  if (!formData.wc_id) {
    ElMessage.warning('请先选择工作中心')
    return
  }
  if (!formData.device_number) {
    ElMessage.error('设备为必录项, 请录入内容!');
    return;
  }
  // 使用提取的函数计算时间范围
  const timeRange = calculateTimeRange(formData.wp_class_name)
  
  // 构建请求参数
  const params = {
    start_date: timeRange.startDate,
    end_date: timeRange.endDate,
    params: JSON.stringify({
      device_id: formData.device_id,
      wc_id: formData.wc_id,
      classtype_id: "5"
    })
  }
  
  // 调用接口
  getEntry3(params).then(res => {
    if (res && Array.isArray(res)) {
      // 将获取到的数据填充到人员表格中
      if (ProductionReportTableRef.value) {
        ProductionReportTableRef.value.tableData = res.map(item => {
          // 处理时间戳转换为日期格式
          const processedItem = { ...item };
          
          // 转换开始时间
          if (processedItem.start_date && typeof processedItem.start_date === 'number') {
            processedItem.start_date = new Date(processedItem.start_date * 1000);
          }
          
          // 转换结束时间
          if (processedItem.end_date && typeof processedItem.end_date === 'number') {
            processedItem.end_date = new Date(processedItem.end_date * 1000);
          }
          
          // 转换开始操作时间
          if (processedItem.start_operate_date && typeof processedItem.start_operate_date === 'number') {
            processedItem.start_operate_date = new Date(processedItem.start_operate_date * 1000);
          }
          
          // 转换结束操作时间
          if (processedItem.end_operate_date && typeof processedItem.end_operate_date === 'number') {
            processedItem.end_operate_date = new Date(processedItem.end_operate_date * 1000);
          }
          
          return processedItem;
        });
        
        ElMessage.success(`成功获取人员数据`);
      }
    } else {
      ElMessage.warning('未获取到人员数据');
    }
  }).catch(error => {
    console.error('获取人员失败:', error);
    ElMessage.error('获取人员失败');
  });
}

function handleGetProduction() {
  // 获取表单数据
  const formData = formRef.value?.formData
  
  // 校验必要参数
  if ( !formData.wp_id) {
    ElMessage.warning('请先选择工序')
    return
  }
  if (!formData.wc_id) {
    ElMessage.warning('请先选择工作中心')
    return
  }
  if ( !props.currentDevice.id) {
    ElMessage.warning('请先选择设备')
    return
  }
  
  // 使用提取的函数计算时间范围
  const timeRange = calculateTimeRange(formData.wp_class_name)
  
  
  // 构建请求参数
  const params = {
    start_date: timeRange.startDate,
    end_date: timeRange.endDate,
    params: JSON.stringify({
      wp_id: formData.wp_id,
      wc_id: formData.wc_id,
      device_id: formData.device_id
    })
  }
  
  
  // 调用接口
  getEntry1(params).then(res => {
    if (res && Array.isArray(res)) {
      // 将获取到的数据填充到产品物料表格中
      if (ProductionMaterialTableRef.value) {
        ProductionMaterialTableRef.value.tableData = res.map(item => {
          // 根据接口返回的数据结构进行处理
          return {
            ...item,
            // 可以在这里添加额外的字段处理
          }
        })
        ElMessage.success(`成功获取${res.length}条产量数据`)
      }
    } else {
      ElMessage.warning('未获取到产量数据')
    }
  }).catch(error => {
    console.error('获取产量失败:', error)
    ElMessage.error('获取产量失败')
  })
}

function handleGetDeviceHours() {
  // 获取表单数据
  const formData = formRef.value?.formData
  
  // 校验必要参数
  if (!formData.wc_id) {
    ElMessage.warning('请先选择工作中心')
    return
  }
  if (!formData.device_number) {
    ElMessage.error('设备为必录项, 请录入内容!')
    return
  }
  
  // 使用提取的函数计算时间范围
  const timeRange = calculateTimeRange(formData.wp_class_name)
  
  // 构建请求参数
  const params = {
    start_date: timeRange.startDate,
    end_date: timeRange.endDate,
    params: JSON.stringify({
      device_id: formData.device_id,
      wc_id: formData.wc_id,
      wp_id: formData.wp_id,
    })
  }
  
  // 调用接口
  getEntry4(params).then(res => {
    if (res && Array.isArray(res)) {
      // 将获取到的数据填充到工序表格中
      if (ProcessTableRef.value) {
        ProcessTableRef.value.tableData = res.map(item => {
          // 处理时间戳转换为日期格式
          const processedItem = { ...item }
          
          // 转换可能存在的时间戳字段为日期格式
          if (processedItem.start_date && typeof processedItem.start_date === 'number') {
            processedItem.start_date = new Date(processedItem.start_date * 1000)
          }
          
          if (processedItem.end_date && typeof processedItem.end_date === 'number') {
            processedItem.end_date = new Date(processedItem.end_date * 1000)
          }
          
          return processedItem
        })
        
        ElMessage.success(`成功获取设备工时数据`)
      }
    } else {
      ElMessage.warning('未获取到设备工时数据')
    }
  }).catch(error => {
    console.error('获取设备工时失败:', error)
    ElMessage.error('获取设备工时失败')
  })
}
defineExpose({ openDialog, closeDialog })
</script>

<style lang="scss" scoped>
.production-report-dialog :deep(.el-dialog) {
  background: rgba(0, 21, 41, 0.95);
  border: 1px solid #1ecfff;
  border-radius: 8px;
  box-shadow: 0 0 30px rgba(30, 207, 255, 0.4);
}

.dialog-content {
  min-height: 400px;
  padding: 14px 0;
  color: #fff;
}

// 新增按钮组样式
.action-btns {
  display: flex;
  gap: 12px;
  margin-top: 20px;
  justify-content: flex-start;
}

.cyber-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(10, 30, 60, 0.18);
  border: 1.2px solid #1ecfff;
  color: #eef1f2;
  font-size: 14px;
  font-weight: 500;
  border-radius: 4px;
  padding: 0 16px 0 14px;
  height: 32px;
  min-width: 90px;
  cursor: pointer;
  box-shadow: 0 0 6px 0 #1ecfff55;
  transition:
    border-color 0.2s,
    color 0.2s,
    box-shadow 0.2s,
    background 0.2s;
  outline: none;
  justify-content: flex-start;
}

.cyber-btn:hover {
  border-color: #4fdfff;
  color: #fff;
  box-shadow: 0 0 10px 2px #1ecfff99;
  background: rgba(30, 207, 255, 0.1);
}

.btn-icon {
  font-size: 16px;
  margin-right: 4px;
  color: #1ecfff;
  vertical-align: middle;
  flex-shrink: 0;
}

:deep(.el-dialog__header) {
  margin-right: 0;
  border-bottom: 1px solid rgba(30, 207, 255, 0.3);
  background: linear-gradient(90deg, #1573ce 0%, #0a2a50 100%);
  padding: 15px 20px;
}

:deep(.el-dialog__title) {
  color: #fff;
  font-size: 16px;
  font-weight: 500;
}

:deep(.el-dialog__headerbtn) {
  top: 15px;
  
  .el-dialog__close {
    color: #fff;
  }
}

:deep(.el-dialog__footer) {
  border-top: 1px solid rgba(30, 207, 255, 0.3);
  padding: 15px 20px;
}
</style>
