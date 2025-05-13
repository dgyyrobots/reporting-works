<template>
  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="产品物料编码" align="center" prop="itemCode" />
      <el-table-column label="产品物料名称" align="center" prop="itemName" />
      <el-table-column label="规格型号" align="center" prop="specification" />
      <el-table-column label="单位" align="center" prop="unitOfMeasure" />
      <el-table-column label="最低检测数" align="center" prop="quantityCheck" />
      <el-table-column label="最大不合格数" align="center" prop="quantityUnqualified" />
      <el-table-column label="最大致命缺陷率" align="center" prop="crRate" />
      <el-table-column label="最大严重缺陷率" align="center" prop="majRate" />
      <el-table-column label="最大轻微缺陷率" align="center" prop="minRate" />
      <el-table-column label="备注" align="center" prop="remark" />
      <!-- <el-table-column label="预留字段1" align="center" prop="attr1" /> -->
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      />
    </el-table>
  </ContentWrap>
</template>
<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import * as TemplateApi from '@/api/qmcbasic/template'

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const props = defineProps<{
  templateId: undefined // 检测模板ID（主表的关联字段）
}>()
const loading = ref(false) // 列表的加载中
const list = ref([]) // 列表的数据

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    list.value = await TemplateApi.getTemplateProductListByTemplateId(props.templateId)
  } finally {
    loading.value = false
  }
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>