<template>
  <!-- 列表 -->
  <ContentWrap>
    <el-table 
      v-loading="loading" 
      :data="list" 
      :stripe="true"
      class="sop-table"
      :max-height="tableHeight"
      border
    >
      <el-table-column label="标题" align="center" prop="sopTitle" min-width="120" show-overflow-tooltip />
      <el-table-column label="顺序" align="center" prop="orderNum" width="70" />
      <el-table-column label="工序编号" align="center" prop="processCode" min-width="100" show-overflow-tooltip />
      <el-table-column label="工序名称" align="center" prop="processName" min-width="100" show-overflow-tooltip />
      
      <!-- 在小屏幕下隐藏详细描述列 -->
      <el-table-column label="详细描述" align="center" prop="sopDescription" min-width="150" v-if="!isMobile">
        <template #default="scope">
          <div v-html="scope.row.sopDescription" class="description-cell"></div>
        </template>
      </el-table-column>
      
      <el-table-column label="图片" align="center" prop="sopUrl" width="100">
        <template #default="scope">
          <el-image 
            v-if="scope.row.sopUrl" 
            class="sop-image" 
            :src="scope.row.sopUrl" 
            :preview-src-list="[scope.row.sopUrl]"
            fit="cover"
          />
          <span v-else>无图片</span>
        </template>
      </el-table-column>
      
      <!-- 在小屏幕下隐藏备注列 -->
      <el-table-column label="备注" align="center" prop="remark" min-width="120" v-if="!isMobile" show-overflow-tooltip />
      
      <!-- 在小屏幕下隐藏创建时间列 -->
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="150"
        v-if="!isMobile"
      />
      
      <!-- 添加操作列，用于在小屏幕下查看详情 -->
      <el-table-column label="操作" align="center" width="80" v-if="isMobile">
        <template #default="scope">
          <el-button type="primary" link @click="showDetail(scope.row)">
            详情
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <!-- 分页 -->
    <Pagination
      :total="total"
      v-model:page="queryParams.pageNo"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
    
    <!-- 详情弹窗 -->
    <el-dialog
      v-model="detailVisible"
      title="SOP详情"
      width="90%"
      :destroy-on-close="true"
      class="sop-detail-dialog"
    >
      <div class="sop-detail">
        <div class="detail-item">
          <span class="label">标题：</span>
          <span>{{ currentDetail.sopTitle }}</span>
        </div>
        <div class="detail-item">
          <span class="label">工序：</span>
          <span>{{ currentDetail.processName }} ({{ currentDetail.processCode }})</span>
        </div>
        <div class="detail-item">
          <span class="label">排序：</span>
          <span>{{ currentDetail.orderNum }}</span>
        </div>
        <div class="detail-item">
          <span class="label">详细描述：</span>
          <div v-html="currentDetail.sopDescription" class="description-content"></div>
        </div>
        <div class="detail-item" v-if="currentDetail.sopUrl">
          <span class="label">图片：</span>
          <el-image 
            :src="currentDetail.sopUrl" 
            :preview-src-list="[currentDetail.sopUrl]"
            class="detail-image"
          />
        </div>
        <div class="detail-item">
          <span class="label">备注：</span>
          <span>{{ currentDetail.remark || '无' }}</span>
        </div>
        <div class="detail-item">
          <span class="label">创建时间：</span>
          <span>{{ dateFormatter({row: currentDetail}) }}</span>
        </div>
      </div>
    </el-dialog>
  </ContentWrap>
</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import * as ProductionApi from '/@/api/production/index'
import { computed, onMounted, onUnmounted } from 'vue'

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const props = defineProps<{
  itemId: undefined // 物料产品ID（主表的关联字段）
}>()

const loading = ref(false) // 列表的加载中
const list = ref([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  itemId: undefined
})

// 响应式布局相关
const windowWidth = ref(window.innerWidth)
const isMobile = computed(() => windowWidth.value <= 820)
const tableHeight = computed(() => isMobile.value ? 'calc(100vh - 280px)' : 'calc(100vh - 240px)')

// 详情弹窗相关
const detailVisible = ref(false)
const currentDetail = ref({})

// 监听窗口大小变化
const handleResize = () => {
  windowWidth.value = window.innerWidth
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

// 显示详情弹窗
const showDetail = (row) => {
  currentDetail.value = row
  detailVisible.value = true
}

/** 监听主表的关联字段的变化，加载对应的子表数据 */
watch(
  () => props.itemId,
  (val) => {
    if (!val) return
    queryParams.itemId = val
    nextTick(() => {
      handleQuery()
    })
  },
  { immediate: true }
)

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await ProductionApi.getMdProductSopPage(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
}
</script>

<style lang="scss" scoped>
.sop-table {
  width: 100%;
  
  :deep(.el-table__body) {
    width: 100%;
  }
  
  .sop-image {
    width: 60px;
    height: 60px;
    object-fit: cover;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .description-cell {
    max-height: 80px;
    overflow-y: auto;
    text-align: left;
    padding: 0 8px;
  }
}

.sop-detail {
  padding: 16px;
  
  .detail-item {
    margin-bottom: 16px;
    
    .label {
      font-weight: bold;
      color: var(--el-text-color-secondary);
      margin-right: 8px;
      display: block;
      margin-bottom: 8px;
    }
    
    .description-content {
      background: var(--el-fill-color-light);
      padding: 12px;
      border-radius: 4px;
      margin-top: 8px;
      text-align: left;
    }
    
    .detail-image {
      max-width: 100%;
      max-height: 300px;
      margin-top: 8px;
      border-radius: 4px;
    }
  }
}

// 平板适配样式
@media screen and (max-width: 820px) {
  .sop-table {
    font-size: 14px;
    
    :deep(.el-table__header) th {
      padding: 8px 0;
    }
    
    :deep(.el-table__body) td {
      padding: 8px;
    }
    
    .sop-image {
      width: 50px;
      height: 50px;
    }
  }
  
  .sop-detail-dialog {
    :deep(.el-dialog__body) {
      padding: 12px;
    }
  }
}
</style>