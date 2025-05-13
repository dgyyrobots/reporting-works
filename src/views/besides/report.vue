<template>
  <div class="report-container">
    <!-- 顶部菜单 -->
    <el-menu default-active="fq"  mode="horizontal" class="menu-list">
        <el-menu-item index="fq">
          <el-icon><Document /></el-icon>
          <span>统一报工</span>
        </el-menu-item>
      </el-menu>
    
    <!-- 内容区 -->
    <div class="content-area">
      <!-- 查询表单 -->
      <div class="query-form-wrapper">
        <vab-query-form class="query-form">
          <vab-query-form-left-panel>
            <el-button :icon="Plus" type="primary" plain>新增</el-button>
          </vab-query-form-left-panel>
          <vab-query-form-right-panel>
            <el-form inline :model="queryForm" @submit.prevent class="form-inline">
              <el-form-item label="工单标题">
                <el-input v-model="queryForm.title" clearable placeholder="请输入工单标题" />
              </el-form-item>
              <el-form-item>
                <el-button :icon="Search" :loading="listLoading" native-type="submit" type="primary" @click="queryData" plain>查询</el-button>
              </el-form-item>
            </el-form>
          </vab-query-form-right-panel>
        </vab-query-form>
      </div>

      <!-- 表格区域 -->
    
        <el-table 
          ref="tableRef" 
          v-loading="listLoading" 
          border 
          :data="list" 
          @selection-change='selectionChange'
          class="data-table"
          :max-height="tableHeight"
        >
          <el-table-column type="selection" width="50" />
          <el-table-column align="center" label="序号" width="80">
            <template #default="{ $index }">
              {{ $index + 1 }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="工单号" prop="workorderCode" show-overflow-tooltip />
          <el-table-column align="center" label="标题"  prop="workorderName" show-overflow-tooltip />
          <el-table-column align="center" label="产品名称"  prop="productName" show-overflow-tooltip />
          <el-table-column align="center" label="工单状态" >
            <template #default="scope">
              <dict-tag :type="'mes_order_status'" :value="scope.row.status" />
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作"  fixed="right">
            <template #default="{ row }">
              <el-button text type="danger" @click="handleDelete(row)">删除</el-button>
            </template>
          </el-table-column>
          <template #empty>
            <el-empty class="vab-data-empty" description="暂无数据" />
          </template>
        </el-table>

      
      <!-- 分页区域 -->
      <div class="pagination-wrapper">
        <vab-pagination
          :current-page="queryForm.pageNo"
          :page-size="queryForm.pageSize"
          :total="total"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { DICT_TYPE } from '/@/utils/dict'
import { Delete, Search, Plus, Document } from '@element-plus/icons-vue'
import type { TableInstance } from 'element-plus'
import { deleteWorkorder, getWorkorderPage } from '/@/api/workOrder'
import { computed, ref, reactive, onBeforeMount, onMounted, onUnmounted } from 'vue'
import { useMessage } from '/@/hooks/web/useMessage'
defineOptions({
  name: 'WorkOrder',
})

// 响应式布局相关
const windowWidth = ref(window.innerWidth)
const windowHeight = ref(window.innerHeight)
const isMenuCollapsed = ref(windowWidth.value <= 820)

const tableHeight = computed(() => windowHeight.value - 280)
const { success } = useMessage()
// 监听窗口大小变化
const handleResize = () => {
  windowWidth.value = window.innerWidth
  windowHeight.value = window.innerHeight
  isMenuCollapsed.value = windowWidth.value <= 820
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

// 切换菜单展开/收起
const toggleMenu = () => {
  isMenuCollapsed.value = !isMenuCollapsed.value
}

const tableRef = ref<TableInstance>()
const list = ref<any>([])
const listLoading = ref<boolean>(true)
const total = ref<number>(0)
const selectRows = ref<any>([])
const queryForm = reactive<any>({
  pageNo: 1,
  pageSize: 20,
})

onActivated(() => {
  tableRef.value?.doLayout()
})

const fetchData = async () => {
  listLoading.value = true
  try {
    const data = await getWorkorderPage(queryForm)
    list.value = data.list
    total.value = data.total
  } catch (error) {
    console.error('获取数据失败', error)
  } finally {
    listLoading.value = false
  }
}

const handleSizeChange = (value: number) => {
  queryForm.pageNo = 1
  queryForm.pageSize = value
  fetchData()
}

const handleCurrentChange = (value: number) => {
  queryForm.pageNo = value
  fetchData()
}

const queryData = () => {
  queryForm.pageNo = 1
  fetchData()
}

const setSelectRows = (value: string) => {
  selectRows.value = value
}

import { ElMessageBox } from 'element-plus'
const handleDelete = async (row: any) => {
  if (row.id) {
    await ElMessageBox.confirm('您确定要删除当前项吗？', '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    const { msg }: any = await deleteWorkorder(row.id)
    await fetchData()
    success(msg)
  } 
}

onBeforeMount(() => {
  fetchData()
})

const selectionChange=(v:any)=>{
  console.log(v)
}
</script>

<style lang="scss" scoped>
.report-container {

  width: 100%;
  height: 100vh;
  overflow: hidden;

}

.menu-list {
  width: 100%;
  height: 64px;
  
  :deep(.el-menu-item) {
    height: 64px;
    line-height: 64px;
    font-size: 18px;
    
    .el-icon {
      font-size: 20px;
      margin-right: 10px;
    }
  }
}
  
.content-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 30px;
  background-color: #f5f7fa;

  .query-form-wrapper {
    margin-bottom: 30px;
    border-radius: 8px; 
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.06); 
    
    .query-form {
      padding: 24px;
    }
    
    .form-inline {
      display: flex;
      flex-wrap: wrap;
      
      :deep(.el-form-item) {
        margin-bottom: 0;
        margin-right: 30px; // 更大的表单项间距

        .el-input {
          width: 280px; // 更宽的输入框
          
          .el-input__inner {
            height: 44px; // 更高的输入框
  
          }
        }
      }
      
      :deep(.el-button) {
        height: 44px;
        padding: 0 24px;
        font-size: 16px; 
      }
    }
  }
  
  // 表格样式优化
  :deep(.data-table) {
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 30px;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.06);
    
    .el-table__header th {
      padding: 16px 0;
      font-size: 16px;
      font-weight: 600;
    }
    
    .el-table__body td {
      padding: 14px 0;
      font-size: 16px;
    }
    
    .el-button {
      font-size: 15px;
      padding: 8px 16px;
    }
  }
  
  .pagination-wrapper {
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.06);
    
    :deep(.el-pagination) {
      justify-content: flex-end;
      font-size: 16px;
      
      .el-pagination__sizes {
        margin-right: 20px;
      }
      
      .el-pagination__jump {
        margin-left: 20px;
      }
      
      .btn-prev, .btn-next {
        padding: 0 15px;
      }
      
      .el-pager li {
        min-width: 40px;
        height: 40px;
        line-height: 40px;
        font-size: 16px;
      }
    }
  }
}

// 移除平板适配样式
</style>
