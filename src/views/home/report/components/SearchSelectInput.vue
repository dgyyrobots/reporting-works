<template>
  <div class="search-select-input">
    <div class="input-wrapper">
      <el-input 
        v-model="searchText" 
        :placeholder="placeholder" 
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlurDelayed"
        :disabled="disabled"
        :readonly="readonly"
        clearable
      />
      <el-button class="search-btn" @click="handMore">
        <el-icon><More /></el-icon>
      </el-button>
    </div>
    
    <!-- 下拉选择列表 -->
    <div v-show="showDropdown" class="dropdown-container">
      <div class="dropdown-content">
        <div 
          v-for="item in tableData" 
          :key="item.id" 
          class="dropdown-item"
          @click="handleRowClick(item)"
        >
          <div class="item-image">
            <div class="placeholder-image"></div>
          </div>
          <div class="item-info">
            <div class="item-code">{{ item.number }}</div>
            <div class="item-name">{{ item.name }}</div>
          </div>
        </div>
        
        <div v-if="tableData.length === 0" class="no-data">
          暂无数据
        </div>
      </div>
    </div>
  </div>
  <MaterialSelectDialog ref="materialSelectDialogRef" @chooseRow="chooseRow" />
</template>

<script setup>
import { ref, watch, defineProps, defineEmits, nextTick } from 'vue'
import { More, Close } from '@element-plus/icons-vue'
import { getSkuList } from '@/api/mes/wk/index.ts'
import { ElMessage } from 'element-plus'
import MaterialSelectDialog from './MaterialSelectDialog.vue'

const props = defineProps({
  modelValue: {
    type: [String, Object],
    default: ''
  },
  placeholder: {
    type: String,
    default: '请输入搜索内容'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  readonly: {
    type: Boolean,
    default: false
  },
  showText: {
    type: Boolean,
    default: true
  },
})

const emit = defineEmits(['update:modelValue', 'select'])

// 搜索相关
const searchText = ref('')
const showDropdown = ref(false)
const tableData = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const selectedRow = ref(null)
let blurTimer = null
const materialSelectDialogRef = ref(null)
// 监听modelValue变化
watch(() => props.modelValue, (newVal) => {
  if (props.showText) {
    if (typeof newVal === 'object' && newVal !== null) {
      searchText.value = newVal.name || ''
    } else {
      searchText.value = newVal
    }
  }
}, { immediate: true })

// 处理输入
const handleInput = () => {
  // 如果清空了输入框，也清空选中的行
  if (!searchText.value) {
    selectedRow.value = null
    emit('update:modelValue', '')
    emit('select', null)
    showDropdown.value = false
    return
  }
  
  // 输入内容后自动搜索
  if (searchText.value.length >= 1) {
    handleSearch()
  }
}

// 处理聚焦
const handleFocus = () => {
  if (searchText.value && searchText.value.length >= 1) {
    handleSearch()
  }
}

// 处理失焦（延迟执行，以便可以点击下拉列表中的项）
const handleBlurDelayed = () => {
  blurTimer = setTimeout(() => {
    showDropdown.value = false
  }, 200)
}

// 处理搜索按钮点击
const handleSearch = () => {
  // 清除可能存在的失焦定时器
  if (blurTimer) {
    clearTimeout(blurTimer)
    blurTimer = null
  }
  
  showDropdown.value = true
  currentPage.value = 1
  fetchData()
}


const handMore = () => {
  materialSelectDialogRef.value.open()
}
// 获取数据
const fetchData = async () => {
  try {
    const loginInfo = JSON.parse(localStorage.getItem('loginInfo'))
    if (!loginInfo || !loginInfo.stored_company) {
      console.error('未找到登录信息或公司ID')
      return
    }
    
    const params = {
      org_id: loginInfo.stored_company +'/r:347',
      object_key:'bill_mes_daily_report',
      org_id: loginInfo.stored_company,
      search_content: searchText.value,
      list_type:'common',
      stock_num: 1,
      page: 1,
    }
    
    const res = await getSkuList(params)
    if (res && res.rows) {
      tableData.value = res.rows
      total.value = Number(res.total)
    } else {
      tableData.value = []
      total.value = 0
    }
  } catch (error) {
    console.error('获取数据失败:', error)
    tableData.value = []
    total.value = 0
  }
}

// 处理行点击
const handleRowClick = (row) => {
 if(props.showText){
    searchText.value = row.name
  }else {
    searchText.value = null
  }

  selectedRow.value = row
  emit('update:modelValue', row)
  emit('select', row)
  showDropdown.value = false
  
  // 清除可能存在的失焦定时器
  if (blurTimer) {
    clearTimeout(blurTimer)
    blurTimer = null
  }
}
const chooseRow = (row) => {
  emit('update:modelValue', row)
  emit('select', row)
}


// 组件卸载时清除定时器
onBeforeUnmount(() => {
  if (blurTimer) {
    clearTimeout(blurTimer)
    blurTimer = null
  }
})
</script>

<style lang="scss" scoped>
.search-select-input {
  width: 100%;
  position: relative;
  
  .input-wrapper {
    display: flex;
    align-items: center;
    
    .el-input {
      flex: 1;
    }
    
    .search-btn {
      margin-left: 5px;
      padding: 0 8px;
      background-color: transparent;
      border: 1px solid #1ecfff;
      color: #1ecfff;
      height: 32px;
      
      &:hover {
        background-color: rgba(30, 207, 255, 0.1);
      }
    }
  }
  
  .dropdown-container {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    background-color: rgba(0, 21, 41, 1);
    border: 1px solid rgba(30, 207, 255, 0.5);
    border-radius: 4px;
    z-index: 9999;
    margin-top: 5px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.5);
    max-height: 400px;
    overflow-y: auto;
    // 修改：确保下拉框不受父元素overflow限制
    transform: translateZ(0);
    
    .dropdown-content {
      padding: 10px;
      
      .dropdown-item {
        display: flex;
        align-items: center;
        padding: 8px;
        border-bottom: 1px solid rgba(30, 207, 255, 0.2);
        cursor: pointer;
        color: #fff;
        
        &:hover {
          background-color: rgba(30, 207, 255, 0.1);
        }
        
        &:last-child {
          border-bottom: none;
        }
        
        .item-image {
          width: 40px;
          height: 40px;
          margin-right: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: rgba(255, 255, 255, 0.05);
          border-radius: 4px;
          
          .placeholder-image {
            width: 30px;
            height: 30px;
            background-color: rgba(30, 207, 255, 0.1);
            border-radius: 2px;
          }
        }
        
        img {
          max-width: 100%;
          max-height: 100%;
        }
      }
      
      .no-data {
        padding: 20px;
        text-align: center;
        color: #b6eaff;
      }
      
      .pagination-container {
        display: flex;
        justify-content: center;
        margin-top: 10px;
        padding-top: 10px;
        border-top: 1px solid rgba(30, 207, 255, 0.2);
      }
    }
  }
}
</style>