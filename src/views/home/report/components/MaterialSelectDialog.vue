<template>
  <el-dialog
    v-model="visible"
    title="所有"
    width="1200px"
    :close-on-click-modal="false"
    class="material-select-dialog"
    :before-close="handleClose"
    :modal-class="'material-select-modal'"
    :style="{backgroundColor: 'rgba(0, 21, 41, 1)'}"
  >
    <div class="dialog-header">
      <div class="filter-row">
        <el-select v-model="product_type" placeholder="全部分类" class="filter-select">
          <el-option label="全部分类" value="" />
          <el-option label="成品" value="7550" />
          <el-option label="部件" value="7776" />
          <el-option label="辅材" value="7780" />
          <el-option label="原材" value="8100" />
        </el-select>
        
        <el-select v-model="sku_brand_id" placeholder="全部品牌" class="filter-select">
          <el-option label="全部品牌" value="" />
          <el-option label="双喜" value="1" />
        </el-select>
        
        <div class="search-input">
          <el-input v-model="search_content" placeholder="名称/编码/条码/型号/规格/物料型号" />
          <el-checkbox v-model="is_exact_search">是否精确搜索</el-checkbox>
        </div>
        
        <div class="action-buttons">
          <el-button class="reset-btn" @click="handReset">重置</el-button>
          <el-button class="search-btn" @click="handSearch">搜索</el-button>
        </div>
      </div>
    </div>
    
    <div class="table-container">
      <el-table
        ref="tableRef"
        :data="tableData"
        border
        style="width: 100%"
        height="400"
        class="cyber-table"
        @selection-change="handleSelectionChange"
        @row-click="handleRowClick"
      >
        <el-table-column type="selection" width="60" align="center" :reserve-selection="false" />
        <el-table-column label="图片" width="100" align="center">
          <template #default>
            <div class="image-placeholder"></div>
          </template>
        </el-table-column>

        <el-table-column label="名称" align="left">
          <template #default="scope">
            <p>
              <span>编码:</span>
              <span>{{ scope.row.number}}</span>
            </p>
            <p>
              <span>{{ scope.row.name }}</span>
            </p>
          </template>
        </el-table-column>

        <el-table-column label="规格型号" width="190" align="center" prop="product_detail" show-overflow-tooltip />
        <el-table-column label="单价" width="170" align="center" prop="price" />
        <el-table-column label="单位" width="100" align="center" prop="unit" />
      </el-table>
      
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[50, 100, 200]"
          layout="sizes, prev, pager, next, jumper, total"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
    
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleConfirm">保存</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, nextTick, onMounted } from 'vue'
import { getSkuList } from '@/api/mes/wk/index.ts'

const emit = defineEmits(['chooseRow'])
const visible = ref(false)
const product_type = ref('')
const sku_brand_id = ref('')
const search_content = ref('')
const is_exact_search = ref(false)
const currentPage = ref(1)
const pageSize = ref(50)
const total = ref(0)
const selectedRows = ref([])
const tableRef = ref(null)
const currentSelectedRow = ref(null)

// 表格数据
const tableData = ref([])

// 打开对话框
const open = () => {
  visible.value = true
  // 清空选择
  clearSelection()
  // 加载数据
  initData()
}

// 关闭对话框
const handleClose = () => {
  visible.value = false
  // 清空选择
  clearSelection()
}

// 取消选择
const handleCancel = () => {
  handleClose()
}

// 确认选择
const handleConfirm = () => {
  if (selectedRows.value.length > 0) {
    // 返回选中行的完整数据
    const selectedData = selectedRows.value[0]
    emit('chooseRow', selectedData)
    handleClose()

  }

}

// 清空选择
const clearSelection = () => {
  selectedRows.value = []
  currentSelectedRow.value = null
  nextTick(() => {
    if (tableRef.value) {
      tableRef.value.clearSelection()
    }
  })
}

// 选择变更
const handleSelectionChange = (selection) => {
  if (selection.length > 1) {
    // 如果选择了多行，只保留最后一个选择的行
    const lastSelected = selection[selection.length - 1]
    
    // 清除之前的选择，只保留当前选择的行
    nextTick(() => {
      tableRef.value.clearSelection()
      tableRef.value.toggleRowSelection(lastSelected, true)
      selectedRows.value = [lastSelected]
      currentSelectedRow.value = lastSelected
    })
  } else {
    selectedRows.value = selection
    currentSelectedRow.value = selection.length > 0 ? selection[0] : null
  }
}

// 行点击事件
const handleRowClick = (row, column, event) => {
  // 如果点击的是选择框列，不做处理（让选择框自己处理）
  if (column.type === 'selection') {
    return
  }
  
  // 如果当前行已选中，则取消选择
  if (currentSelectedRow.value === row) {
    tableRef.value.toggleRowSelection(row, false)
    currentSelectedRow.value = null
    selectedRows.value = []
  } else {
    // 如果有其他行已选中，先清除所有选择
    tableRef.value.clearSelection()
    // 然后选中当前行
    tableRef.value.toggleRowSelection(row, true)
    currentSelectedRow.value = row
    selectedRows.value = [row]
  }
}

// 页码变更
const handleCurrentChange = (val) => {
  currentPage.value = val
  // 切换页面时清除选择
  clearSelection()
  // 加载新页数据
  initData()
}

// 每页数量变更
const handleSizeChange = (val) => {
  pageSize.value = val
  // 切换页面大小时清除选择
  clearSelection()
  // 重新加载数据
  initData()
}

// 重置筛选条件
const handReset = () => {
  product_type.value = ''
  sku_brand_id.value = ''
  search_content.value = ''
  is_exact_search.value = false
  // 重置后重新搜索
  handSearch()
}

// 搜索
const handSearch = () => {
  currentPage.value = 1 
  initData()
}

// 初始化数据
const initData = () => {
  try {
    const loginInfo = JSON.parse(localStorage.getItem('loginInfo'))
    if (!loginInfo || !loginInfo.stored_company) {
      console.error('未找到登录信息或公司ID')
      return
    }
    
    const params = {
      org_id: loginInfo.stored_company,
      list_type: 'common',
      search_content: search_content.value,
      is_exact_search: is_exact_search.value ? 1 : 0,
      stock_num: 1,
      product_type: product_type.value, 
      page: currentPage.value,
      rows: pageSize.value,
      sku_brand_id: sku_brand_id.value,
      multi_filter: '',
      _: Date.now()
    }
    
    getSkuList(params).then(res => {
      console.log(res, 'API返回数据')
      if (res && res.rows) {
        // 处理返回的数据
        tableData.value = res.rows.map(item => ({
          id: item.id,
          number: item.number,
          name: item.name,
          product_detail: item.product_detail,
          price: item.price,
          unit: item.unit,
          // 保存原始数据
          ...item
        }))
        currentPage.value = Number(res.page)
        total.value = Number(res.total)
      } else {
        tableData.value = []
        total.value = 0
      }
    }).catch(err => {
      console.error('获取数据失败:', err)
      tableData.value = []
      total.value = 0
    })
  } catch (error) {
    console.error('初始化数据出错:', error)
  }
}

// 组件挂载时加载数据
onMounted(() => {
  initData()
})

// 暴露方法给父组件
defineExpose({
  open,
  getSelectedRow: () => selectedRows.value[0] || null
})
</script>

<style lang="scss" scoped>
.material-select-dialog {
  :deep(.el-dialog__header) {
    background-color: rgba(30, 207, 255, 0.1);
    margin: 0;
    padding: 15px 20px;
    border-bottom: 1px solid rgba(30, 207, 255, 0.5);
    
    .el-dialog__title {
      color: #b6eaff;
      font-size: 16px;
      font-weight: 500;
    }
    
    .el-dialog__headerbtn {
      top: 15px;
      
      .el-dialog__close {
        color: #b6eaff;
      }
    }
  }
  
  :deep(.el-dialog__body) {
    background-color: rgba(0, 21, 41, 0.95);
    padding: 0;
    color: #fff;
  }
  
  :deep(.el-dialog__footer) {
    background-color: rgba(0, 21, 41, 0.95);
    padding: 10px 20px;
    border-top: 1px solid rgba(30, 207, 255, 0.3);
  }
  
  // 增加以下样式来提高弹框的层级
  :deep(.el-overlay) {
    z-index: 3000 !important; // 提高遮罩层级
    background-color: rgba(0, 0, 0, 1) !important; // 增加遮罩不透明度
  }
  
  :deep(.el-dialog) {
    z-index: 3001 !important; // 提高对话框层级
    margin-top: 5vh !important; // 调整对话框位置，避免被顶部元素遮挡
    max-height: 90vh; // 限制最大高度
    display: flex;
    flex-direction: column;
    background-color: rgba(0, 21, 41, 1) !important; // 增加背景不透明度为100%
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.8) !important; // 增加阴影效果
    border: 1px solid rgba(30, 207, 255, 0.8) !important; // 增加边框
    
    .el-dialog__body {
      overflow-y: auto; // 内容过多时允许滚动
      background-color: rgba(0, 21, 41, 1) !important; // 确保内容区域也是不透明的
    }
    
    .el-dialog__header {
      background-color: rgba(30, 207, 255, 0.2) !important; // 加深头部背景色
    }
    
    .el-dialog__footer {
      background-color: rgba(0, 21, 41, 1) !important; // 确保底部也是不透明的
    }
  }
}


.dialog-header {
  padding: 15px;
  border-bottom: 1px solid rgba(30, 207, 255, 0.3);
}

.filter-row {
  display: flex;
  align-items: center;
  gap: 10px;
  
  .filter-select {
    width: 150px;
  }
  
  .search-input {
    flex: 1;
    display: flex;
    align-items: center;
    
    .el-input {
      flex: 1;
      margin-right: 10px;
    }
    
    .el-checkbox {
      margin-left: 10px;
      color: #b6eaff;
    }
  }
  
  .action-buttons {
    display: flex;
    gap: 10px;
    
    .search-btn {
      background-color: #1ecfff;
      border-color: #1ecfff;
      color: #001529;
      
      &:hover {
        background-color: #33d4ff;
        border-color: #33d4ff;
      }
    }
    
    .reset-btn {
      background-color: transparent;
      border-color: #44baee;
      color: #44baee;
      
      &:hover {
        background-color: rgba(30, 207, 255, 0.1);
      }
    }
  }
}

.table-container {
  padding: 15px;
}

.cyber-table {
  --el-table-border-color: rgba(30, 207, 255, 0.5);
  --el-table-header-bg-color: rgba(30, 207, 255, 0.1);
  --el-table-bg-color: rgba(0, 21, 41, 0.95);
  --el-table-tr-bg-color: rgba(0, 21, 41, 0.95);
  --el-table-row-hover-bg-color: rgba(30, 207, 255, 0.05);
  --el-table-header-text-color: #b6eaff;
  --el-table-text-color: #fff;
  
  :deep(.el-table__inner-wrapper) {
    border: 1px solid rgba(30, 207, 255, 0.5);
  }
  
  :deep(.el-checkbox__inner) {
    background-color: transparent;
    border-color: rgba(30, 207, 255, 0.7);
  }
  
  :deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
    background-color: #1ecfff;
    border-color: #1ecfff;
  }
}

.image-placeholder {
  width: 40px;
  height: 40px;
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  margin: 0 auto;
}

.pagination-container {
  margin-top: 15px;
  display: flex;
  justify-content: flex-end;
  
  :deep(.el-pagination) {
    --el-pagination-bg-color: transparent;
    --el-pagination-text-color: #b6eaff;
    --el-pagination-button-color: #b6eaff;
    --el-pagination-button-bg-color: transparent;
    --el-pagination-button-disabled-color: rgba(182, 234, 255, 0.5);
    --el-pagination-button-disabled-bg-color: transparent;
    --el-pagination-hover-color: #1ecfff;
    
    .el-pagination__sizes .el-select .el-input {
      --el-select-input-color: #b6eaff;
      --el-select-input-focus-border-color: #1ecfff;
    }
  }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  
  .el-button {
    padding: 8px 20px;
  }
}

:deep(.el-select) {
  --el-select-input-color: #b6eaff;
  --el-select-input-focus-border-color: #1ecfff;
  
  .el-input__wrapper {
    background-color: rgba(0, 21, 41, 0.5);
    box-shadow: 0 0 0 1px rgba(30, 207, 255, 0.5) inset;
    
    &.is-focus {
      box-shadow: 0 0 0 1px #1ecfff inset;
    }
    
    .el-input__inner {
      color: #b6eaff;
    }
  }
}

:deep(.el-input__wrapper) {
  background-color: rgba(0, 21, 41, 0.5);
  box-shadow: 0 0 0 1px rgba(30, 207, 255, 0.5) inset;
  
  &.is-focus {
    box-shadow: 0 0 0 1px #1ecfff inset;
  }
  
  .el-input__inner {
    color: #b6eaff;
  }
}
</style>