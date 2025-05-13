<template>
  <Dialog title="物料产品选择" v-model="Flag" v-model:visible="Flag" :modal="false" width="90%" center>
    <el-row :gutter="20">
      <!--分类数据-->
      <el-col :span="4" :xs="24">
        <div class="head-container">
          <el-input
v-model="deptName" placeholder="请输入分类名称" clearable size="small" :prefix-icon="Search"
            style="margin-bottom: 20px" />
        </div>
        <div class="head-container">
          <el-tree 
:data="state.itemTypeOptions" :props="state.defaultProps" :expand-on-click-node="false"
            :filter-node-method="filterNode" ref="tree" default-expand-all @node-click="handleDeptNodeClick" />

        </div>
      </el-col>
      <!--物料数据-->
      <el-col :span="20" :xs="24">
        <el-form
:model="state.queryParams" ref="queryForm" size="small" :inline="true" v-show="state.showSearch"
          label-width="68px">
          <el-form-item label="物料编码" prop="itemCode">
            <el-input
v-model="state.queryParams.itemCode" placeholder="请输入物料编码" clearable style="width: 240px"
              @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="物料名称" prop="itemName">
            <el-input
v-model="state.queryParams.itemName" placeholder="请输入物料名称" clearable style="width: 240px"
              @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :icon="Search" size="default" @click="handleQuery">搜索</el-button>
            <el-button :icon="Refresh" size="default" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
        <!-- @current-change="handleCurrent" @row-dblclick="handleRowDbClick" -->
        <el-table v-loading="state.loading" :data="state.itemList">
          <el-table-column width="50" align="center">
            <template #default="scope">
              <el-radio v-model="state.selectedItemId" :label="scope.row.id" @change="handleRowChange(scope.row)">{{ ''
              }}</el-radio>
            </template>
          </el-table-column>
          <el-table-column
label="物料编码" width="120" align="center" key="itemCode" prop="itemCode"
            v-if="state.columns[0].visible" />
          <el-table-column
label="物料名称" min-width="120" align="left" key="itemName" prop="itemName"
            v-if="state.columns[1].visible" :show-overflow-tooltip="true" />
          <el-table-column
label="规格型号" align="left" key="specification" prop="specification"
            v-if="state.columns[2].visible" :show-overflow-tooltip="true" />
          <el-table-column
label="单位" align="center" key="unitOfMeasure" prop="unitOfMeasure"
            v-if="state.columns[3].visible" :show-overflow-tooltip="true" />
          <el-table-column
label="物料/产品" align="center" key="itemOrProduct" prop="itemOrProduct"
            v-if="state.columns[4].visible" :show-overflow-tooltip="true">
            <!-- <template #default="scope">
              <dict-tag :type="DICT_TYPE.MES_ITEM_PRODUCT" :value="scope.row.itemOrProduct" />
            </template> -->
          </el-table-column>
          <el-table-column
label="所属分类" align="center" key="itemTypeName" prop="itemTypeName"
            v-if="state.columns[5].visible" width="120" />
          <el-table-column label="创建时间" align="center" prop="createTime" v-if="state.columns[6].visible" width="160">
            <template #default="scope">
              <span>{{ formatDate(scope.row.createTime) }}</span>
            </template>
          </el-table-column>
        </el-table>

        <Pagination
v-show="state.total > 0" :total="state.total" v-model:page="state.queryParams.pageNo"
          v-model:limit="state.queryParams.pageSize" @pagination="getList" />
      </el-col>
    </el-row>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="confirmSelect">确 定</el-button>
        <el-button @click="Flag = false">取 消</el-button>
      </div>
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
import {
  formatDate
} from '@/utils/formatTime'
import * as mditemtypeApi from '@/api/md/mditemtype'
import * as ItemApi from '@/api/md/mditem'
import {
  Search, Refresh
} from '@element-plus/icons-vue'
import { DICT_TYPE, getStrDictOptions } from '@/utils/dict'
import { ref, reactive, $emit } from 'vue'
import * as mditemApi from '@/api/md/mditem'
import { get } from 'http'
defineOptions({ name: 'ItemSelect' })
let Flag = ref(false);
const showFlag = () => {
  Flag.value = true;
}
const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗
defineExpose({ showFlag })
const state = reactive({
  loading: false,
  showFlag: false,
  // 选中数组
  selectedItemId: undefined,
  selectedRows: undefined,
  // 非单个禁用
  single: true,
  // 非多个禁用
  multiple: true,
  // 显示搜索条件
  showSearch: true,
  // 总条数
  total: 0,
  // 物料产品表格数据
  itemList: [],
  // 部门树选项
  itemTypeOptions: undefined,
  // 部门名称
  itemTypeName: undefined,
  defaultProps: {
    children: 'children',
    label: 'label',
  },
  // 查询参数
  queryParams: {
    pageNo: 1,
    pageSize: 10,
    itemCode: undefined,
    itemName: undefined,
    itemTypeId: null,
  },
  // 列信息
  columns: [
    { key: 0, label: `物料/产品编码`, visible: true },
    { key: 1, label: `物料/产品名称`, visible: true },
    { key: 2, label: `规格型号`, visible: true },
    { key: 3, label: `单位`, visible: true },
    { key: 4, label: `物料/产品`, visible: true },
    { key: 5, label: `物料分类`, visible: true },
    { key: 6, label: `创建时间`, visible: true },
  ],
})
// 筛选节点
const filterNode = (value, data) => {
  if (!value) return true;
  return data.label.indexOf(value) !== -1;
}
/** 查询分类下拉树结构 */
const getTreeselect = async () => {
  // treeselect().then(response => {
  //   this.itemTypeOptions = response.data;
  // });
  let data = await mditemtypeApi.getItemTypeList({})
  state.itemTypeOptions = data;
}
/** 搜索按钮操作 */
const handleQuery = () => {
  console.log('搜索')
  state.queryParams.pageNo = 1;
  getList();
}
/** 重置按钮操作 */
const resetQuery = () => {
  console.log('重置')
  state.queryParams = {
    pageNo: 1,
    pageSize: 10,
    itemCode: undefined,
    itemName: undefined,
    itemTypeId: null,
  }
  handleQuery();
}
// 单选选中数据
const handleRowChange = (row) => {
  if (row) {
    state.selectedRows = row;
  }
}

const getList = async () => {
  // let data=await mditemApi.listMdItem({pageNo:1})
  console.log('假请求数据')
  const data = await ItemApi.getItemPage(state.queryParams)
  state.itemList = data.list
  state.total = data.total
}
const emit = defineEmits(['onSelected'])
const confirmSelect = () => {
  if (state.selectedItemId == null || state.selectedItemId == 0) {
    message.warning(t('请至少选择一条数据!'))
    return;
  }
  emit('onSelected', state.selectedRows);
  Flag.value = false;
}

const handleDeptNodeClick= async(row)=>{
  state.queryParams.itemTypeId = row.id
  console.log(row,'点击是树形的数据')
  await getList()
}
const tree=ref()
/** 监听deptName */
const deptName = ref('')
watch(deptName, (val) => {
  console.log('测试')
  tree.value!.filter(val)
})

/** 初始化 **/
onMounted(async () => {
  getList();
  getTreeselect()
})
</script>

<style></style>