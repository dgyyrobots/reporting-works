<template>
  <div class="template-print-dialog">
    <div class="dialog-content">
      <div class="dialog-section">
        <div class="section-title">选择套打模版</div>
        <div class="template-list">
          <div 
            v-for="(template, index) in templates" 
            :key="index"
            class="template-item"
            :class="{ 'active': selectedTemplate === template.value }"
            @click="selectedTemplate = template.value"
          >
            <div class="radio-btn">
              <div class="radio-inner" v-if="selectedTemplate === template.value"></div>
            </div>
            <div class="template-name">{{ template.label }}</div>
          </div>
        </div>
      </div>
      
      <div class="dialog-section">
        <div class="section-title">选择打印人员</div>
        <div class="staff-list">
          <div 
            v-for="(staff, index) in staffList" 
            :key="index"
            class="staff-item"
            :class="{ 'active': selectedStaff === staff.value }"
            @click="selectedStaff = staff.value"
          >
            <div class="radio-btn">
              <div class="radio-inner" v-if="selectedStaff === staff.value"></div>
            </div>
            <div class="staff-name">{{ staff.label }}</div>
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
        <button class="print-btn" @click="handleDirectPrint">直接打印</button>
        <button class="confirm-btn" @click="handleConfirm">确定</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  currentDevice: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['close'])

// 模版列表
const templates = [
  { label: '产品流程牌', value: 'product' },
  { label: '板号条码', value: 'barcode' },
  { label: 'test001', value: 'test001' },
  { label: '产品流程牌1.0', value: 'product1.0' },
  { label: '板号二维码', value: 'qrcode' }
]

// 人员列表
const staffList = [
  { label: '陈本洪', value: 'chenbenhong' },
  { label: '刘红燕', value: 'liuhongyan' },
  { label: '骆海雄', value: 'luohaixiong' },
  { label: '黄学勤', value: 'huangxueqin' },
  { label: '黄涛', value: 'huangtao' }
]

// 选中的模版和人员
const selectedTemplate = ref('barcode')
const selectedStaff = ref('chenbenhong')

// 取消按钮
const handleCancel = () => {
  emit('close')
}

// 直接打印按钮
const handleDirectPrint = () => {
  if (!selectedTemplate.value) {
    return ElMessage.error('请选择打印模版')
  }
  
  if (!selectedStaff.value) {
    return ElMessage.error('请选择打印人员')
  }
  
  ElMessage.success('开始打印...')
  // 这里添加直接打印的逻辑

  
  emit('close')
}

// 确定按钮
const handleConfirm = () => {
  if (!selectedTemplate.value) {
    return ElMessage.error('请选择打印模版')
  }
  
  if (!selectedStaff.value) {
    return ElMessage.error('请选择打印人员')
  }
  
  ElMessage.success('已确认打印设置')

  
  emit('close')
}
</script>

<style lang="scss" scoped>
.template-print-dialog {
  display: flex;
  flex-direction: column;
  width: 100%;
  color: #fff;
  
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