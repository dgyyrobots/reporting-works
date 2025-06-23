<template>
  <BaseTable 
    v-model:tableData="tableData" 
    :emptyRowTemplate="emptyRowTemplate"
    @add-row="handleAddRow"
    @delete-row="handleDeleteRow"
  >
    <el-table-column label="流转卡编码" prop="rc_no" min-width="120" align="center">
      <template #default="{ row }">
        <div class="input-with-search">
          <el-input v-model="row.rc_no" placeholder="" />
        </div>
      </template>
    </el-table-column>
    
    <el-table-column label="物料名称" prop="sku_name" min-width="190" align="center">
      <template #header>
        <div class="column-header-with-icon">
          <span>物料名称</span>
          <span @click="openScanDialog"><Icon icon="svg-icon:scan" class="expand-icon" /></span>     
        </div>
      </template>
      <template #default="{ row ,$index}">
        <div class="input-with-search">
          <el-input v-model="row.sku_name"       
          @input="handleInput"
           @focus="(e) => handleFocus(e, $index)"
          @blur="handleBlurDelayed" 
          placeholder="请输入物料名称或编码" />
          <el-button class="search-btn" @click="handMore($index)"> <el-icon><More /></el-icon></el-button>
          <el-popover
          placement="bottom-start"
          :width="400"
          trigger="manual"
          :visible="showDropdown"
          popper-class="search-dropdown-popover"
          @hide="onPopoverHide"
        >
          <template #reference>
            <div style="width: 0; height: 0;"></div>
          </template>
          <div class="dropdown-content">
            <div 
              v-for="item in searchTableData" 
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
        </el-popover>

        </div>
      </template>
    </el-table-column>
    <el-table-column label="物料编号" prop="sku_no" min-width="160" align="center">
      <template #default="{ row }">
        <el-input v-model="row.sku_no" placeholder="" />
      </template>
    </el-table-column>
    
    <el-table-column label="汇报数量" prop="report_qty" min-width="100" align="center">
      <template #default="{ row }">
        <!-- <el-input v-model="row.report_qty" placeholder="" /> -->
        <span> {{ row.report_qty }}</span>
      </template>
    </el-table-column>
    
    <el-table-column label="合格数量" prop="ok_qty" min-width="100" align="center">
      <template #default="{ row }">
        <!-- <el-input v-model="row.ok_qty" placeholder="" /> -->
        <span> {{ row.ok_qty }}</span>
      </template>
    </el-table-column>
    
    <el-table-column label="制程废品" prop="no_okqty" min-width="100" align="center">
      <template #default="{ row }">
        <!-- <el-input v-model="row.no_okqty" placeholder="" /> -->
        <span> {{ row.no_okqty }}</span>
      </template>
    </el-table-column>
    
    <el-table-column label="过版纸数量" prop="pass_qty" min-width="120" align="center">
      <template #default="{ row }">
        <!-- <el-input v-model="row.pass_qty" placeholder="" /> -->
        <span> {{ row.pass_qty }}</span>
      </template>
    </el-table-column>
    
    <el-table-column label="无形损耗数量" prop="loss_qty" min-width="120" align="center">
      <template #default="{ row }">
        <!-- <el-input v-model="row.loss_qty" placeholder="" /> -->
        <span> {{row.loss_qty }}</span>
      </template>
    </el-table-column>
    
    <el-table-column label="定额产量" prop="quota_capacity" min-width="100" align="center">
      <template #default="{ row }">
        <el-input v-model="row.quota_capacity" placeholder="" />
      </template>
    </el-table-column>
    
    <el-table-column label="计件定额" prop="peice_quota" min-width="100" align="center">
      <template #default="{ row }">
        <el-input v-model="row.peice_quota" placeholder="" />
      </template>
    </el-table-column>
    
    <el-table-column label="计件系数" prop="piece_ratio" min-width="100" align="center">
      <template #default="{ row }">
        <el-input v-model="row.piece_ratio" placeholder="" />
      </template>
    </el-table-column>
    
    <el-table-column label="机台系数" prop="device_ratio" min-width="100" align="center">
      <template #default="{ row }">
        <el-input v-model="row.device_ratio" placeholder="" />
      </template>
    </el-table-column>
    

    <el-table-column label="工序序号" prop="order_no" min-width="100" align="center">
      <template #default="{ row }">
        <el-input v-model="row.order_no" placeholder="" />
      </template>
    </el-table-column>
    
    <el-table-column label="新版次数" prop="ud_102869_xinban" min-width="100" align="center">
      <template #default="{ row }">
        <el-input v-model="row.ud_102869_xinban" placeholder="" />
      </template>
    </el-table-column>
    
    <el-table-column label="旧版次数" prop="ud_102869_jiuban" min-width="100" align="center">
      <template #default="{ row }">
        <el-input v-model="row.ud_102869_jiuban" placeholder="" />
      </template>
    </el-table-column>
    
    <el-table-column label="磨刀次数" prop="ud_102869_modao" min-width="100" align="center">
      <template #default="{ row }">
        <el-input v-model="row.ud_102869_modao" placeholder="" />
      </template>
    </el-table-column>
  </BaseTable>
  <ScanBarcodeDialog ref="scanBarcodeDialogRef" @addMaterialName="addMaterialName" />
  <MaterialSelectDialog ref="materialSelectDialogRef" @chooseRow="handleChooseMaterial" />


</template>

<script setup>
import { ref ,onBeforeUnmount} from 'vue'
import { Icon } from '/@/components/Icon'
import { More, Close } from '@element-plus/icons-vue'
import BaseTable from './components/BaseTable.vue'
import ScanBarcodeDialog from './components/ScanBarcodeDialog.vue'
import MaterialSelectDialog from './components/MaterialSelectDialog.vue'
import { getSkuList } from '@/api/mes/wk/index.ts'
// 空行模板
const emptyRowTemplate = {
  rc_no: '',
  sku_name: '',
  report_qty: '',
  ok_qty: '',
  no_okqty: '',
  pass_qty: '',
  loss_qty: '',
  quota_capacity: '',
  peice_quota: '',
  piece_ratio: '',
  device_ratio: '',
  sku_no: '',
  order_no: '',
  ud_102869_xinban: '',
  ud_102869_jiuban: '',
  ud_102869_modao: ''
}
const materialSelectDialogRef = ref(null)
const showDropdown = ref(false)
const materialSelectDialogChooseIndex = ref(null)
const searchTableData = ref([])
const searchIndex = ref(null)
let blurTimer = null
// 表格数据
const tableData = ref([{ ...emptyRowTemplate }])

// 添加行处理函数
const handleAddRow = (index) => {
  // 这里可以添加其他逻辑，但不要再操作tableData
  console.log('行已添加，索引:', index)
}

// 删除行处理函数
const handleDeleteRow = (index) => {
 // 这里可以添加其他逻辑，但不要再操作tableData
 console.log('行已删除，索引:', index)
}

// 扫码对话框引用
const scanBarcodeDialogRef = ref(null)

// 打开扫码对话框
const openScanDialog = () => {
  scanBarcodeDialogRef.value.open()
}

const addMaterialName = (data) => {
  if (tableData.value.length === 1 && 
      !tableData.value[0].sku_name && 
      !tableData.value[0].sku_no) {
    tableData.value[0].sku_name = data.name
    tableData.value[0].sku_no = data.number
  } else {
    tableData.value.push({
      ...emptyRowTemplate,
      sku_name: data.name,
      sku_no: data.number
    })
  }
}


const handMore = (index) => {
  materialSelectDialogChooseIndex.value = index
  materialSelectDialogRef.value.open()
}

// 处理选择物料
const handleChooseMaterial = (material) => {
  if (material) {
      tableData.value[materialSelectDialogChooseIndex.value].sku_name = material.name || ''
      tableData.value[materialSelectDialogChooseIndex.value].sku_no = material.number || ''
  }
}
// 处理输入
const handleInput = (str) => {
  // 如果清空了输入框，也清空选中的行
  if (!str) {
    showDropdown.value = false
    return
  }
  
  // 输入内容后自动搜索
  if (str.length >= 1) {
    showDropdown.value = true
    fetchData(str)
  }
}

// 处理聚焦
const handleFocus = (e, Index) => {
  searchIndex.value = Index
  if (e.target.value && e.target.value.length >= 1) {
    showDropdown.value = true
    fetchData(e.target.value)
  }
}

// 处理失焦（延迟执行，以便可以点击下拉列表中的项）
const handleBlurDelayed = () => {
  blurTimer = setTimeout(() => {
    showDropdown.value = false
  }, 200)
}
// 处理弹出框隐藏事件
const onPopoverHide = () => {
  showDropdown.value = false
  if (blurTimer) {
    clearTimeout(blurTimer)
    blurTimer = null
  }
}
const handleRowClick = (row) => {
  
  // 获取当前激活的输入框所在的行索引
  const currentIndex = searchIndex.value
  
  // 将选中的物料信息赋值给当前表格行
  if (currentIndex !== null && currentIndex >= 0 && currentIndex < tableData.value.length) {
    tableData.value[currentIndex].sku_name = row.name || ''
    tableData.value[currentIndex].sku_no = row.number || ''
  }
  
  showDropdown.value = false
      // 让当前输入框失去焦点
      nextTick(() => {
      // 获取当前活动的输入框元素并使其失去焦点
      const activeElement = document.activeElement
      if (activeElement && activeElement.tagName === 'INPUT') {
        activeElement.blur()
      }
    })
  // 清除可能存在的失焦定时器
  if (blurTimer) {
    clearTimeout(blurTimer)
    blurTimer = null
  }
}
// 获取数据
const fetchData = async (searchText) => {
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
      search_content: searchText,
      list_type:'common',
      stock_num: 1,
      page: 1,
    }
    
    const res = await getSkuList(params)
    if (res && res.rows) {
      searchTableData.value = res.rows

    } else {
      searchTableData.value= []

    }
  } catch (error) {
    console.error('获取数据失败:', error)
    searchTableData.value = []

  }
}
onBeforeUnmount(() => {
  if (blurTimer) {
    clearTimeout(blurTimer)
    blurTimer = null
  }
})
// 暴露表格数据给父组件
defineExpose({
  tableData
})
</script>

<style lang="scss" scoped>
.input-with-search {
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

// 添加列标题样式
.column-header-with-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  
  span {
    display: flex;
    align-items: center;
  }
  
  .expand-icon {
    margin-left: 5px;
    color: #1ecfff;
    font-size: 16px;
    cursor: pointer;
  }
}

// 添加下拉菜单样式
:global(.el-popper) {
  background-color: rgba(0, 21, 41, 0.95) !important;
  border: 1px solid rgba(30, 207, 255, 0.5) !important;
  color: #b6eaff !important;
  
  .el-select-dropdown__list {
    padding: 4px 0;
  }
  
  .el-select-dropdown__item {
    color: #b6eaff !important;
  }
  
  .el-select-dropdown__item.hover, 
  .el-select-dropdown__item:hover {
    background-color: rgba(30, 207, 255, 0.1) !important;
  }
  
  .el-select-dropdown__item.selected {
    color: #1ecfff !important;
    background-color: rgba(30, 207, 255, 0.2) !important;
  }
  
  .el-popper__arrow::before {
    background-color: rgba(0, 21, 41, 0.95) !important;
    border-color: rgba(30, 207, 255, 0.5) !important;
  }
  .el-popper__arrow::after {
    background-color: rgba(0, 21, 41, 0.95) !important;
    border-color: rgba(30, 207, 255, 0.5) !important;
  }
}


// 添加全局样式，用于自定义el-popover的样式
:global(.search-dropdown-popover) {
  background-color: rgba(0, 21, 41, 1);
  border: 1px solid rgba(30, 207, 255, 0.5);
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.5);
  padding: 0;
  
  .el-popper__arrow::before {
    background: rgba(0, 21, 41, 1);
    border-color: rgba(30, 207, 255, 0.5);
  }
}

.dropdown-content {
  padding: 10px;
  max-height: 400px;
  overflow-y: auto;
  
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
    
    .item-info {
      flex: 1;
      
      .item-code {
        font-size: 14px;
        margin-bottom: 4px;
      }
      
      .item-name {
        font-size: 12px;
        color: #b6eaff;
      }
    }
  }
  
  .no-data {
    padding: 20px;
    text-align: center;
    color: #b6eaff;
  }
}
</style>

