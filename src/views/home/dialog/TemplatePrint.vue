<template>
  <div class="template-print-dialog">
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <span>加载中...</span>
    </div>
    <template v-else>
      <div class="dialog-content">
        <div class="dialog-section">
          <div class="section-title">选择套打模版</div>
          <div class="template-list">
            <div 
              v-for="template in templates" 
              :key="template.id"
              class="template-item"
              :class="{ 'active': selectedTemplate === template.id }"
              @click="selectedTemplate = template.id"
            >
              <div class="radio-btn">
                <div class="radio-inner" v-if="selectedTemplate === template.id"></div>
              </div>
              <div class="template-name">{{ template.modelName }}</div>
            </div>
          </div>
        </div>
        
        <div class="dialog-section">
          <div class="section-title">选择打印人员</div>
          <div class="staff-list">
            <div 
              v-for="staff in staffList" 
              :key="staff.user_id"
              class="staff-item"
              :class="{ 'active': selectedStaff === staff.user_id }"
              @click="selectedStaff = staff.user_id"
            >
              <div class="radio-btn">
                <div class="radio-inner" v-if="selectedStaff === staff.user_id"></div>
              </div>
              <div class="staff-name">{{ staff.user_name }}</div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="dialog-footer">
        <div class="default-template-btn">
          <!-- <span>设为默认模版</span> -->
        </div>
        <div class="action-buttons">
          <button class="cancel-btn" @click="handleCancel">取消</button>
          <button class="print-btn" @click="handPrint(1)">直接打印</button>
          <button class="confirm-btn" @click="handPrint(0)">确定</button>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getPrintInfo ,sendPrint } from '@/api/mes/wk/index.ts'
import { useWorkStore } from '@/store/modules/work' // 导入store
const props = defineProps({
  currentDevice: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['close'])
const workStore = useWorkStore() // 使用store
// 加载状态
const loading = ref(true)

// 模版列表
const templates = ref([])

// 人员列表
const staffList = ref([])

// 选中的模版和人员
const selectedTemplate = ref('')
const selectedStaff = ref('')

// 获取打印信息
const fetchPrintInfo = async () => {
  loading.value = true
    // 构建基础参数
    const params = {
      action: 'get_chromatography_printing_template_list',
      object_key: 'bill_mes_version_number_manage'
    }
    
    // 获取选中的行数据
    const row = workStore.selectedLicenseCheck || []
    
    // 创建 FormData 对象用于构建请求参数
    const formData = new FormData()
    formData.append('action', params.action)
    formData.append('object_key', params.object_key)
    
    // 添加多个 data_id[] 参数
    if (row.length > 0) {
      row.forEach(item => {
        if (item && item.id) {
          formData.append('data_id[]', item.id)
        }
      })
    } 
    
  try {
    const res = await getPrintInfo(formData)
    if (res && res.ret === 0 && res.data) {
      // 设置模板列表
      templates.value = res.data.rows || []
      
      // 设置人员列表
      staffList.value = res.data.users?.user_list || []
      
      // 设置默认选中项
      const defaultTemplate = templates.value.find(item => item.is_default === 1)
      if (defaultTemplate) {
        selectedTemplate.value = defaultTemplate.id
      } else if (templates.value.length > 0) {
        selectedTemplate.value = templates.value[0].id
      }
      
      // 设置默认选中人员
      if (res.data.users?.checked_user_id) {
        selectedStaff.value = res.data.users.checked_user_id
      } else if (staffList.value.length > 0) {
        selectedStaff.value = staffList.value[0].user_id
      }
    } else {
      ElMessage.error('获取打印信息失败')
    }
  } catch (error) {
    console.error('获取打印信息出错:', error)
    ElMessage.error('获取打印信息出错')
  } finally {
    loading.value = false
  }
}

// 取消按钮
const handleCancel = () => {
  emit('close')
}



// 确定按钮
const handPrint = async (direct) => {
    loading.value = true
    // 构建基础参数

    const params = {
      is_print:direct,
      action: 'send_chromatography_print',
      object_key: 'bill_mes_version_number_manage',
      to_user:selectedStaff.value.staffId,
      chromatography_printing_id:selectedTemplate.value,
    }
    
    // 获取选中的行数据
    const row = workStore.selectedLicenseCheck || []
    
    // 创建 FormData 对象用于构建请求参数
    const formData = new FormData()
    formData.append('is_print', params.is_print)
    formData.append('action', params.action)
    formData.append('object_key', params.object_key)
    formData.append('to_user', params.to_user)
    formData.append('chromatography_printing_id', params.chromatography_printing_id)
    formData.append('qr_code[qr_code_mpn]', '0')
    formData.append('post_ids[]', '0')
    formData.append('qr_code[qr_code_batch_no]','')
    formData.append('qr_code[qr_code_date]','')
    formData.append('qr_code[qr_code_no]','')
    formData.append('qr_code[qr_code_uqty]','')
    formData.append('qr_code[qr_code_count]','')
    
    // 添加多个 data_id[] 参数
    if (row.length > 0) {
      row.forEach(item => {
        if (item && item.id) {
          formData.append('data_ids[]', item.id)
        }
      })
    } 
    
    const res = await sendPrint(formData)
    if (res && res.ret === 0 && res.data) {
        ElMessage.success(res.msg)
        emit('close')
        loading.value = false
    } else{
        ElMessage.error(res.msg)
        loading.value = false
    }
}

// 组件挂载时获取数据
onMounted(() => {
  fetchPrintInfo()
})
</script>

<style lang="scss" scoped>
.template-print-dialog {
  display: flex;
  flex-direction: column;
  width: 100%;
  color: #fff;
  
  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 200px;
    
    .loading-spinner {
      width: 40px;
      height: 40px;
      border: 3px solid rgba(30, 207, 255, 0.3);
      border-radius: 50%;
      border-top-color: #1ecfff;
      animation: spin 1s linear infinite;
      margin-bottom: 10px;
    }
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  }
  
  .dialog-content {
    display: flex;
    gap: 20px;
    padding: 10px 0;
  }
  
  .dialog-section {
    flex: 1;
    display: flex;
    flex-direction: column;
    
    .section-title {
      font-size: 16px;
      color: #1ecfff;
      margin-bottom: 15px;
      padding-left: 10px;
      border-left: 3px solid #1ecfff;
    }
  }
  
  .template-list, .staff-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    max-height: 300px;
    overflow-y: auto;
    
    &::-webkit-scrollbar {
      width: 6px;
    }
    
    &::-webkit-scrollbar-thumb {
      background-color: rgba(30, 207, 255, 0.5);
      border-radius: 3px;
    }
    
    &::-webkit-scrollbar-track {
      background-color: rgba(0, 20, 40, 0.3);
    }
  }
  
  .template-item, .staff-item {
    display: flex;
    align-items: center;
    padding: 8px 12px;
    cursor: pointer;
    border-radius: 4px;
    transition: background-color 0.2s;
    
    &:hover {
      background-color: rgba(30, 207, 255, 0.1);
    }
    
    &.active {
      background-color: rgba(30, 207, 255, 0.15);
    }
    
    .radio-btn {
      width: 18px;
      height: 18px;
      border-radius: 50%;
      border: 1px solid #1ecfff;
      margin-right: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      
      .radio-inner {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background-color: #1ecfff;
      }
    }
    
    .template-name, .staff-name {
      font-size: 14px;
    }
  }
  
  .dialog-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
    padding-top: 15px;
    border-top: 1px solid rgba(30, 207, 255, 0.3);
    
    .default-template-btn {
      color: #1ecfff;
      font-size: 14px;
      display: flex;
      align-items: center;
      cursor: pointer;
      transition: opacity 0.2s;
      
      &:hover {
        opacity: 0.8;
      }
      
      .checkbox {
        width: 16px;
        height: 16px;
        border: 1px solid #1ecfff;
        margin-right: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        
        &.checked {
          background-color: rgba(30, 207, 255, 0.1);
        }
        
        .checkbox-inner {
          width: 8px;
          height: 8px;
          background-color: #1ecfff;
        }
      }
    }
    
    .action-buttons {
      display: flex;
      gap: 12px;
      
      button {
        padding: 6px 16px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        transition: all 0.2s;
      }
      
      .cancel-btn {
        background-color: transparent;
        border: 1px solid #1ecfff;
        color: #1ecfff;
        
        &:hover {
          background-color: rgba(30, 207, 255, 0.1);
        }
      }
      
      .print-btn {
        background-color: transparent;
        border: 1px solid #1ecfff;
        color: #1ecfff;
        
        &:hover {
          background-color: rgba(30, 207, 255, 0.1);
        }
      }
      
      .confirm-btn {
        background-color: #1573ce;
        border: 1px solid #219efc;
        color: #fff;
        
        &:hover {
          background-color: #1e85e2;
        }
      }
    }
  }
}
</style>