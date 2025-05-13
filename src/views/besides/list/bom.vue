<template>
  <!-- 列表 -->
  <ContentWrap>
    <el-table
      v-loading="loading"
      :data="list"
      :stripe="true"
      highlight-current-row
      class="bom-table"
      :max-height="tableHeight"
      border
    >
      <!-- 移动端视图下隐藏ID列 -->
      <el-table-column label="产品物料ID" align="center" prop="id" v-if="!isMobile" />
      
      <!-- 核心列始终显示 -->
      <el-table-column label="物料编码" align="center" prop="bomItemCode" min-width="120" show-overflow-tooltip />
      <el-table-column label="物料名称" align="center" prop="bomItemName" min-width="120" show-overflow-tooltip />
      <el-table-column label="规格型号" align="center" prop="bomItemSpec" min-width="100" show-overflow-tooltip />
      <el-table-column label="单位" align="center" prop="unitOfMeasure" width="80" />

      <!-- 移动端视图下隐藏次要列 -->
      <el-table-column 
        label="物料/产品" 
        align="center" 
        prop="itemOrProduct" 
        v-if="!isMobile"
        width="120"
        show-overflow-tooltip
      />
      
      <el-table-column 
        label="来料验证" 
        align="center" 
        width="90"
        v-if="!isMobile"
      >
        <template #default>否</template>
      </el-table-column>
      
      <el-table-column 
        label="备注" 
        align="center" 
        prop="remark" 
        v-if="!isMobile"
        min-width="120"
        show-overflow-tooltip
      >
        <template #default="scope">
          <div v-html="scope.row.remark"></div>
        </template>
      </el-table-column>
      
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="150"
        v-if="!isMobile"
      />
      
      <!-- 移动端视图下添加操作列 -->
      <el-table-column 
        label="操作" 
        align="center" 
        width="80" 
        v-if="isMobile"
        fixed="right"
      >
        <template #default="scope">
          <el-button type="primary" link @click="showDetail(scope.row)">
            详情
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </ContentWrap>
  
  <!-- 详情弹窗 -->
  <el-dialog
    v-model="detailVisible"
    title="BOM详情"
    width="90%"
    :destroy-on-close="true"
    class="bom-detail-dialog"
  >
    <div class="bom-detail">
      <div class="detail-item">
        <span class="label">物料编码：</span>
        <span>{{ currentDetail.bomItemCode }}</span>
      </div>
      <div class="detail-item">
        <span class="label">物料名称：</span>
        <span>{{ currentDetail.bomItemName }}</span>
      </div>
      <div class="detail-item">
        <span class="label">规格型号：</span>
        <span>{{ currentDetail.bomItemSpec }}</span>
      </div>
      <div class="detail-item">
        <span class="label">单位：</span>
        <span>{{ currentDetail.unitOfMeasure }}</span>
      </div>
      <div class="detail-item">
        <span class="label">物料/产品：</span>
        <span>{{ currentDetail.itemOrProduct }}</span>
      </div>
      <div class="detail-item">
        <span class="label">来料验证：</span>
        <span>否</span>
      </div>
      <div class="detail-item">
        <span class="label">备注：</span>
        <div v-html="currentDetail.remark || '无'" class="detail-content"></div>
      </div>
      <div class="detail-item">
        <span class="label">创建时间：</span>
        <span>{{ dateFormatter({row: currentDetail}) }}</span>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import * as ProductionApi from '/@/api/production/index'
import { computed, onMounted, onUnmounted } from 'vue'

defineOptions({ name: 'MdItem' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(false) // 列表的加载中
const list = ref([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  itemTypeId: undefined,
  pageNo: 1,
  pageSize: 10,
  itemCode: undefined,
  itemName: undefined,
  itemTypeCode: undefined,
  enableFlag: undefined,
  warehouseCode: undefined,
  warehouseName: undefined,
  locationCode: undefined,
  locationName: undefined,
  areaCode: undefined,
  createTime: [],
  itemId: undefined
})

// 响应式布局相关
const windowWidth = ref(window.innerWidth)
const isMobile = computed(() => windowWidth.value <= 820)
const tableHeight = computed(() => 'calc(100vh - 240px)')

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

const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await ProductionApi.getMdProductBomPage(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

const props = defineProps<{
  itemId: undefined // 物料产品ID（主表的关联字段）
}>()

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

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
}
</script>

<style lang="scss" scoped>
.bom-table {
  width: 100%;
  
  :deep(.el-table__body) {
    width: 100%;
  }
}

.bom-detail {
  padding: 16px;
  
  .detail-item {
    margin-bottom: 16px;
    display: flex;
    
    .label {
      font-weight: bold;
      color: var(--el-text-color-secondary);
      width: 100px;
      flex-shrink: 0;
    }
    
    .detail-content {
      background: var(--el-fill-color-light);
      padding: 12px;
      border-radius: 4px;
      margin-top: 8px;
      text-align: left;
      width: 100%;
    }
  }
}

// 平板适配样式
@media screen and (max-width: 820px) {
  .bom-table {
    font-size: 14px;
    
    :deep(.el-table__header) th {
      padding: 8px 0;
    }
    
    :deep(.el-table__body) td {
      padding: 8px;
    }
  }
  
  .bom-detail-dialog {
    :deep(.el-dialog__body) {
      padding: 12px;
    }
  }
  
  .bom-detail {
    .detail-item {
      flex-direction: column;
      
      .label {
        margin-bottom: 4px;
        width: 100%;
      }
    }
  }
}
</style>