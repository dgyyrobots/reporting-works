<template>
  <Dialog title="客户选择" v-model="Flag" v-model:visible="Flag" :modal="false" width="90%" center>
    <el-form
:model="state.ueryParams" ref="queryForm" size="small" :inline="true" v-show="state.showSearch"
      label-width="100px">
      <el-row>
        <el-col :span="8">
          <el-form-item label="客户名称" prop="name">
            <el-input v-model="state.queryParams.name" placeholder="请输入客户名称" clearable @keyup.enter="handleQuery" />
          </el-form-item>
          <!-- <el-form-item label="客户编码" prop="clientCode">
            <el-input v-model="state.queryParams.clientCode" placeholder="请输入客户编码" clearable @keyup.enter="handleQuery" />
          </el-form-item> -->
        </el-col>
        <el-col :span="8">
          <el-form-item>
            <el-button type="primary" :icon="Search" size="default" @click="handleQuery">搜索</el-button>
            <el-button :icon="Refresh" size="default" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <!-- <el-form-item label="客户简称" prop="clientNick">
            <el-input v-model="state.queryParams.clientNick" placeholder="请输入客户简称" clearable @keyup.enter="handleQuery" />
          </el-form-item> -->
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <!-- <el-form-item label="客户英文名称" prop="clientEn">
            <el-input v-model="state.queryParams.clientEn" placeholder="请输入客户英文名称" clearable @keyup.enter="handleQuery" />
          </el-form-item> -->
        </el-col>
        <el-col :span="8">
          <!-- <el-form-item label="是否启用" prop="enableFlag">
            <el-select v-model="state.queryParams.enableFlag" placeholder="是否启用" clearable style="width: 215px">
              <el-option
v-for="dict in getStrDictOptions('sys_yes_no')" :key="dict.value" :label="dict.label"
                :value="dict.value" />
            </el-select>
          </el-form-item> -->
        </el-col>

      </el-row>
    </el-form>
    <!-- <right-toolbar v-model:showSearch="state.showSearch" @query-table="getList"/> -->
  
    <el-table :data="state.clientList"   v-loading="state.loading">
      <!-- @current-change="handleCurrent" -->
      <!-- @row-dblclick="handleRowDbClick" -->
      <el-table-column width="50" align="center">
        <template #default="scope">
          <el-radio v-model="state.selectedClientId" :label="scope.row.id" @change="handleRowChange(scope.row)">{{ ''
          }}</el-radio>
        </template>
      </el-table-column>
      <!-- <el-table-column label="客户编码" align="center" prop="clientCode" /> -->
      <el-table-column label="客户名称" width="200px" align="center" prop="name"  />
      <!-- <el-table-column label="客户简称" align="center" prop="clientNick" /> -->
      <!-- <el-table-column label="客户类型" align="center" prop="clientType">
        <template #default="scope">
          <dict-tag :type="'mes_client_type'" :value="scope.row.clientType" />
        </template>
      </el-table-column> -->
      <el-table-column label="客户电话" align="center" prop="telephone"  />
      <!-- <el-table-column label="联系人" align="center" prop="contact1" /> -->
      <!-- <el-table-column label="联系人-电话" align="center" prop="contact1Tel" /> -->
    </el-table>
    <Pagination
v-show="state.total > 0" :total="state.total" v-model:page="state.queryParams.pageNo"
      v-model:limit="state.queryParams.pageSize" @pagination="getList" style="float: none;justify-content: flex-end;" />
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="confirmSelect">确 定</el-button>
        <el-button @click="Flag = false">取 消</el-button>
      </div>
    </template>

  </Dialog>
</template>

<script lang="ts" setup>
// 差左侧列表和数据
import {
  formatDate
} from '@/utils/formatTime'
import {
  Search, Refresh
} from '@element-plus/icons-vue'
import { DICT_TYPE, getStrDictOptions } from '@/utils/dict'
import { ref, reactive } from 'vue'
// import * as mditemApi from '@/api/md/mditem'
import * as CustomerApi from '@/api/crm/customer'
import { get } from 'http'
defineOptions({ name: 'ClientSelect' })
let Flag = ref(false);
const showFlag = () => {
  Flag.value = true;
}
const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗
defineExpose({ showFlag })
const state = reactive({
  showFlag: false,
  selectedClientId: undefined,
  selectedRow: undefined,
  // 遮罩层
  loading: true,
  // 非单个禁用
  single: true,
  // 非多个禁用
  multiple: true,
  // 显示搜索条件
  showSearch: true,
  // 总条数
  total: 1,
  // 客户表格数据
  clientList: [],
  // 弹出层标题
  title: '',
  // 是否显示弹出层
  open: false,
  // 查询参数
  queryParams: {
    name:null, 
    pageNo: 1,
    pageSize: 10,
    clientCode: null,
    clientName: null,
    clientNick: null,
    clientEn: null,
    clientDes: null,
    clientLogo: null,
    clientType: null,
    address: null,
    website: null,
    email: null,
    tel: null,
    contact1: null,
    contact1Tel: null,
    contact1Email: null,
    contact2: null,
    contact2Tel: null,
    contact2Email: null,
    creditCode: null,
    enableFlag: null,
  },
})
// 筛选节点
const filterNode = (value, data) => {
  if (!value) return true;
  return data.label.indexOf(value) !== -1;
}
/** 查询分类下拉树结构 */
const getTreeselect = () => {
  // treeselect().then(response => {
  //   this.itemTypeOptions = response.data;
  // });
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
    clientCode: null,
    clientName: null,
    clientNick: null,
    clientEn: null,
    clientDes: null,
    clientLogo: null,
    clientType: null,
    address: null,
    website: null,
    email: null,
    tel: null,
    contact1: null,
    contact1Tel: null,
    contact1Email: null,
    contact2: null,
    contact2Tel: null,
    contact2Email: null,
    creditCode: null,
    enableFlag: null,
  }
  handleQuery();
}
// 单选选中数据
const handleRowChange = (row) => {
  if (row) {
    state.selectedRow = row;
  }
}

const getList = async() => {
  state.loading=true;
  let data=await CustomerApi.getCustomerPage(state.queryParams)
  state.clientList=data.list;
  state.total=data.total;
  // state.clientList = [
  //   {
  //     address: null,
  //     attr1: null,
  //     attr2: null,
  //     attr3: 0,
  //     attr4: 0,
  //     clientCode: "C00246",
  //     clientDes: null,
  //     clientEn: null,
  //     clientLogo: null,
  //     clientName: "测试客户",
  //     clientNick: null,
  //     clientType: "ENTERPRISE",
  //     contact1: null,
  //     contact1Email: null,
  //     contact1Tel: null,
  //     contact2: null,
  //     contact2Email: null,
  //     contact2Tel: null,
  //     createTime: 1704418977000,
  //     creditCode: null,
  //     email: null,
  //     enableFlag: "Y",
  //     id: 44,
  //     remark: "",
  //     tel: null,
  //     website: null,
  //   }
  // ]
  state.loading=false;
}
const emit = defineEmits(['onSelected'])
const confirmSelect = () => {
  if (state.selectedClientId == null || state.selectedClientId == 0) {
    message.warning(t('请至少选择一条数据!'))
    return;
  }
  emit('onSelected', state.selectedRow);
  Flag.value = false;
}
/** 初始化 **/
onMounted(async () => {
  getList();
})
</script>

<style></style>