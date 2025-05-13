<template>
  <!-- 列表 -->
  <ContentWrap>
    <el-button
      type="primary"
      plain
      @click="openForm('create')"
      v-hasPermi="['oqc::create']"
    >
      <Icon icon="ep:plus" class="mr-5px" /> 新增
    </el-button>
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
      <el-table-column label="致命缺陷数量" align="center" prop="crQuantity" />
      <el-table-column label="严重缺陷数量" align="center" prop="majQuantity" />
      <el-table-column label="轻微缺陷数量" align="center" prop="minQuantity" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="操作" align="center" fixed="right" width="120">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['oqc::update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['oqc::delete']"
          >
            删除
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
  </ContentWrap>
    <!-- 表单弹窗：添加/修改 -->
    <LineForm ref="formRef" @success="getList" />
</template>
<script setup lang="ts">
import { DICT_TYPE } from '@/utils/dict'
import { dateFormatter } from '@/utils/formatTime'
import * as Api from '@/api/oqc/oqc'
import LineForm from './LineForm.vue'

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const props = defineProps<{
  oqcId: undefined // 检验单ID（主表的关联字段）
}>()
const loading = ref(false) // 列表的加载中
const list = ref([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  oqcId: undefined
})

/** 监听主表的关联字段的变化，加载对应的子表数据 */
watch(
  () => props.oqcId,
  (val) => {
    queryParams.oqcId = val
    handleQuery()
  },
  { immediate: false }
)

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await Api.getLinePage(queryParams)
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

/** 添加/修改操作 */
const formRef = ref()
const openForm = (type: string, id?: number) => {
  if (!props.oqcId) {
    message.error('请选择一个出货检验')
    return
  }
  formRef.value.open(type, id, props.oqcId)
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await Api.deleteLine(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}
</script>