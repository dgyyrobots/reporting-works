<template>
  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="检测项编码" align="center" prop="indexCode" />
      <el-table-column label="检测项名称" align="center" prop="indexName" />
      <el-table-column label="检测项类型" align="center" prop="indexType">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.MES_INDEX_TYPE" :value="scope.row.indexType" />
        </template>
      </el-table-column>
      <el-table-column label="检测工具" align="center" prop="qcTool" />
      <el-table-column label="检测要求" align="center" prop="checkMethod" />
      <el-table-column label="标准值" align="center" prop="standerVal" />
      <el-table-column label="单位" align="center" prop="unitOfMeasure" />
      <el-table-column label="误差上限" align="center" prop="thresholdMax" />
      <el-table-column label="误差下限" align="center" prop="thresholdMin" />
      <el-table-column label="说明图" align="center" prop="docUrl" />
      <el-table-column label="备注" align="center" prop="remark" />
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
import { DICT_TYPE } from '@/utils/dict'
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
    list.value = await TemplateApi.getTemplateIndexListByTemplateId(props.templateId)
  } finally {
    loading.value = false
  }
}

// /** 搜索按钮操作 */
// const handleQuery = () => {
//   queryParams.pageNo = 1
//   getList()
// }

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>