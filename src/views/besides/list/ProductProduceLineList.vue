<template>
    <!-- 列表 -->
    <ContentWrap>
        <el-table v-loading="loading" :data="list" :stripe="true">
            <!-- <el-table-column label="行ID" align="center" prop="id" /> -->
            <el-table-column label="产品物料编码" align="center" prop="itemCode" />
            <el-table-column label="产品物料名称" align="center" prop="itemName" />
            <el-table-column label="规格型号" align="center" prop="specification" />
            <el-table-column label="单位" align="center" prop="unitOfMeasure" />
            <el-table-column label="产出数量" align="center" prop="quantityProduce" />
            <el-table-column label="批次号" align="center" prop="batchCode" />
            <el-table-column label="仓库名称" align="center" prop="warehouseName" />
            <el-table-column label="库区名称" align="center" prop="locationName" />
            <el-table-column label="库位名称" align="center" prop="areaName" />
            <el-table-column label="来源类型" align="center" prop="orderSource" />
            <el-table-column label="创建时间" align="center" prop="createTime" :formatter="dateFormatter" width="180px" />
        </el-table>
        <!-- 分页 -->
        <Pagination :total="total" v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize"
            @pagination="getList" />
    </ContentWrap>
</template>
<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import * as ProductionApi from '/@/api/production/index'



const props = defineProps<{
    taskCode: undefined // 领料单ID（主表的关联字段）
}>()
const loading = ref(false) // 列表的加载中
const list = ref([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
    pageNo: 1,
    pageSize: 10,
    recordId: undefined
})

/** 监听主表的关联字段的变化，加载对应的子表数据 */
watch(
    () => props.taskCode,
    async (val) => {
        let data = await ProductionApi.getProductProducePage({ taskCode:val})
        if (data.list && data.list.length) {
            queryParams.recordId = data.list[0].id
            handleQuery()
        }else{
            list.value = []
            total.value =0
        }
    },
    { immediate: false }
)

/** 查询列表 */
const getList = async () => {
    loading.value = true
    try {
        const data = await ProductionApi.getProductProduceLinePage(queryParams)
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