<template>
  <el-dialog
    v-model="visible"
    :title="isSingleMode ? '请选择人员' : '请选择'"
    width="1100px"
    :close-on-click-modal="false"
    class="choose-person-dialog"
    :before-close="handleClose"
  >
    <div class="dialog-content">
      <div class="left-panel">
        <div class="panel-title">员工引用属性列表</div>
        <div class="search-box">
          <el-input v-model="searchKeyword" placeholder="" clearable>
            <template #append>
              <el-button @click="handSearch">
                <Icon icon="svg-icon:search" />
              </el-button>
            </template>
          </el-input>
        </div>
        <div class="alphabet-filter">
          <span 
            class="filter-item" 
            :class="{ active: currentLetter === 'all' }"
            @click="filterByLetter('all')"
          >全部</span>
          <span 
            v-for="letter in alphabetList" 
            :key="letter" 
            class="filter-item"
            :class="{ active: currentLetter === letter }"
            @click="filterByLetter(letter)"
          >
            {{ letter }}
          </span>
        </div>
        <div class="person-list">
          <div v-for="(group, key) in groupedPersons" :key="key" class="person-group">
            <div class="group-title">{{ key }}</div>
            <div 
              v-for="person in group" 
              :key="person.id" 
              class="person-item" 
              @click="handlePersonClick(person)"
            >
              {{ person.name }} ({{ person.id }})
            </div>
          </div>
        </div>
        <div class="pagination">
          <span class="page-btn prev" @click="handPageBtn(currentPage-1)">
            <Icon icon="svg-icon:arrow-left" />
          </span>
          <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>
          <span class="page-btn next" @click="handPageBtn(currentPage + 1)">
            <Icon icon="svg-icon:arrow-right" />
          </span>
        </div>
      </div>
      <div class="right-panel">
        <div class="panel-title">已选</div>
        <div class="selected-list">
          <div v-for="person in selectedPersons" :key="person.id" class="selected-item">
            {{ person.name }} ({{ person.id }})
          </div>
        </div>
      </div>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-checkbox v-model="selectAll" v-if="!isSingleMode">全选</el-checkbox>
        <el-button @click="resetSelection" v-if="!isSingleMode">重选</el-button>
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleConfirm" v-if="!isSingleMode">保存</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref,onMounted, computed, defineEmits, defineExpose, defineProps } from 'vue'
import { Icon } from '/@/components/Icon'
import { getPicker } from '@/api/mes/wk/index.ts'
const props = defineProps({
  isSingleMode: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['confirm', 'close'])

// 对话框可见性
const visible = ref(false)
const lookup_root_view_key = ref('')

// 搜索关键词
const searchKeyword = ref('')

// 当前选中的字母
const currentLetter = ref('all')

// 字母表过滤
const alphabetList = ['A', 'B', 'C', 'D', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']

// 全选
const selectAll = ref(false)

// 模拟人员数据
const personList = ref([
  { id: '210029', name: 'Andre Sicksch' },
  { id: '230063', name: '白敬华' },
  { id: '040048', name: '陈本洪' },
  { id: '230216', name: '包际晨' },
  { id: '220005', name: '白敬华' },
  { id: '230249', name: '曹宝财' },
  { id: '220040', name: '蔡德' },
  { id: '080507', name: '陈定安' },
  // 添加H开头的人员数据
  { id: '070174', name: '何曦' },
  { id: '230080', name: '何斌' },
  { id: '220032', name: '胡本龙' },
  { id: '160107', name: '花朝克' },
  { id: '230085', name: '何崇孝' },
  { id: '220041', name: '何海兵' },
  { id: '220025', name: '胡凯' }
])

// 分页 和人员总数
const currentPage = ref(1)
const totalPages = ref(1)
const pageSize = ref(10)

// 已选人员
const selectedPersons = ref([
])

// 按字母分组的人员列表
const groupedPersons = computed(() => {
  // 确保personList.value是数组
  if (!Array.isArray(personList.value)) {
    return {};
  }
  
  // 先根据搜索关键词筛选
  let filtered = personList.value.filter(person => {
    if (!searchKeyword.value) return true
    return person.name.includes(searchKeyword.value) || person.id.includes(searchKeyword.value)
  })
  
  // 再根据选中的字母筛选
  if (currentLetter.value !== 'all') {
    filtered = filtered.filter(person => {
      // 获取姓名首字母拼音
      const firstChar = getFirstLetterOfName(person.name)
      return firstChar === currentLetter.value
    })
  }
  
  const grouped = {}
  
  filtered.forEach(person => {
    // 获取姓名首字母
    const firstChar = getFirstLetterOfName(person.name)
    
    if (!grouped[firstChar]) {
      grouped[firstChar] = []
    }
    
    grouped[firstChar].push(person)
  })
  
  return grouped
})

// 获取姓名首字母
const getFirstLetterOfName = (name) => {
  // 判断是否为英文名
  if (/^[A-Za-z]/.test(name)) {
    return name.charAt(0).toUpperCase()
  }
  
  // 中文名根据拼音首字母分组
  // 这里简化处理，实际项目中可能需要使用拼音库
  const pinyinMap = {
    '艾': 'A', '安': 'A', '敖': 'A',
    '白': 'B', '包': 'B', '鲍': 'B', '毕': 'B', '卞': 'B',
    '曹': 'C', '蔡': 'C', '陈': 'C', '程': 'C', '崔': 'C','寸': 'C',
    '邓': 'D', '丁': 'D', '董': 'D', '杜': 'D', '戴': 'D','段': 'D','代': 'D','窦': 'D',
    '范': 'F', '冯': 'F', '傅': 'F', '方': 'F', '房': 'F','': 'F',
    '高': 'G', '郭': 'G', '顾': 'G', '龚': 'G', '甘': 'G',
    '何': 'H', '胡': 'H', '花': 'H', '黄': 'H', '韩': 'H', '侯': 'H',
    '金': 'J', '江': 'J', '姜': 'J', '蒋': 'J', '贾': 'J', '季': 'J',
    '李': 'L', '刘': 'L', '梁': 'L', '罗': 'L', '林': 'L', '卢': 'L',
    '马': 'M', '孟': 'M', '毛': 'M', '莫': 'M', '梅': 'M',
    '牛': 'N', '倪': 'N', '聂': 'N', '宁': 'N',
    '彭': 'P', '潘': 'P', '庞': 'P', '裴': 'P',
    '钱': 'Q', '秦': 'Q', '邱': 'Q', '乔': 'Q',
    '任': 'R', '阮': 'R', '饶': 'R', '芮': 'R',
    '孙': 'S', '宋': 'S', '苏': 'S', '沈': 'S', '石': 'S', '史': 'S',
    '唐': 'T', '田': 'T', '陶': 'T', '谭': 'T', '汤': 'T',
    '王': 'W', '吴': 'W', '魏': 'W', '汪': 'W', '韦': 'W', '卫': 'W',
    '徐': 'X', '谢': 'X', '夏': 'X', '肖': 'X', '熊': 'X', '项': 'X',
    '杨': 'Y', '叶': 'Y', '袁': 'Y', '姚': 'Y', '尹': 'Y', '严': 'Y',
    '张': 'Z', '赵': 'Z', '郑': 'Z', '周': 'Z', '朱': 'Z', '钟': 'Z', '曾': 'Z',
    '谷': 'G', '樊': 'F', '邹': 'Z', '詹': 'Z', '翟': 'Z','章': 'Z',
    // 可以根据需要添加更多映射
  }
  
  const firstChar = name.charAt(0)
  return pinyinMap[firstChar] || firstChar
}

// 处理搜索
const handSearch = () => {
  // 重置页码
  currentPage.value = 1
  
  // 准备搜索参数
  const searchParams = {
    name: searchKeyword.value
  }
  
  // 如果当前有字母筛选，保持字母筛选条件
  if (currentLetter.value !== 'all') {
    searchParams.first_char = currentLetter.value.toLowerCase()
  }
  
  // 调用接口，传递搜索参数
  feachData(lookup_root_view_key.value, searchParams.first_char, searchParams.name)
}

// 打开对话框
const open = (preSelectedPersons = [], singleMode = null) => {
  // 修改这里：不要直接修改props
  // 如果明确传入了singleMode参数，则使用一个本地变量来存储模式
  if (singleMode !== null) {
    isSingleMode.value = singleMode
  }
  
  if (preSelectedPersons.length > 0) {
    selectedPersons.value = [...preSelectedPersons]
  } else {
    selectedPersons.value = []
  }
  visible.value = true
}

// 添加一个本地响应式变量来存储单选/多选模式
const isSingleMode = ref(props.isSingle)

// 处理人员点击
const handlePersonClick = (person) => {
  if (isSingleMode.value) {
    // 单选模式：直接选中并关闭
    emit('confirm', [person])
    visible.value = false
  } else {
    // 多选模式：添加到已选列表
    selectPerson(person)
  }
}

// 选择人员
const selectPerson = (person) => {
  const index = selectedPersons.value.findIndex(p => p.id === person.id)
  if (index === -1) {
    selectedPersons.value.push(person)
  }
}

// 重置选择
const resetSelection = () => {
  selectedPersons.value = []
}

// 关闭对话框
const handleClose = () => {
  visible.value = false
  emit('close')
}

// 确认选择
const handleConfirm = () => {
  emit('confirm', selectedPersons.value)
  visible.value = false
}
const feachSearchKeyword = () => {
  const data = {
    col: 'col1',
    root_view_key: "lgeathbo"
  }
  return getPicker(data).then((res) => {
    if (res && res.length > 0 && res[0].lookup_root_view_key) {
      lookup_root_view_key.value = res[0].lookup_root_view_key
      return lookup_root_view_key.value // 返回获取到的值，便于链式调用
    } else {
      console.error('未获取到有效的lookup_root_view_key')
      throw new Error('未获取到有效的lookup_root_view_key')
    }
  })
}

const feachData = (key, firstChar, name) => {
  if (!key) {
    console.error('lookup_root_view_key不能为空')
    return Promise.reject('lookup_root_view_key不能为空')
  }
  
  const data = {
    col: 'col2',
    root_view_key: key,
    page: currentPage.value
  }
  
  // 如果传入了firstChar参数，则添加到请求参数中
  if (firstChar) {
    data.first_char = firstChar
  }
  
  // 如果传入了name参数，则添加到请求参数中
  if (name) {
    data.name = name
  }
  
  return getPicker(data).then((res) => {
    console.log(res, '222222dddddddddddddd')
    // 确保处理API返回的数据结构
    if (res && res.data && res.data.rows) {
      // 将API返回的数据转换为数组格式
      const rowsData = res.data.rows;
      const formattedData = [];
      
      // 处理返回的数据格式，提取所有人员信息并保留首字母分组信息
      Object.keys(rowsData).forEach(key => {
        if (Array.isArray(rowsData[key])) {
          rowsData[key].forEach(item => {
            formattedData.push({
              id: item.id || '',
              number: item.number || '',
              name: item.name || '',
              firstLetter: key // 保存接口返回的首字母分组
            });
          });
        }
      });
      
      personList.value = formattedData;
      console.log(personList.value, '2222255555555555555552')
      
      // 更新分页信息
      if (res.data.pages) {
        totalPages.value = res.data.pages;
      }
      if (res.data.page) {
        currentPage.value = res.data.page;
      }
    } else {
      // 如果没有正确的数据结构，设置为空数组
      personList.value = [];
    }
    
    return personList.value
  }).catch(error => {
    console.error('获取人员数据失败:', error);
    personList.value = []; // 出错时设置为空数组
    return []
  });
}

// 初始化数据加载
const initData = async () => {
  try {
    const key = await feachSearchKeyword()
    if (key) {
      // 初始加载不传first_char参数
      await feachData(key)
    }
  } catch (error) {
    console.error('初始化数据失败:', error)
  }
}

const handPageBtn = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    // 翻页时保持当前字母筛选条件和搜索关键词
    const firstChar = currentLetter.value !== 'all' ? currentLetter.value.toLowerCase() : null
    feachData(lookup_root_view_key.value, firstChar, searchKeyword.value || null)
  } 
}

onMounted(() => {
  initData()
})
// 暴露方法
defineExpose({
  open
})

// 按字母筛选
const filterByLetter = (letter) => {
  currentLetter.value = letter
  // 如果不是"全部"，则调用接口获取对应字母的数据
  if (letter !== 'all') {
    // 重置页码
    currentPage.value = 1
    // 调用接口，传递first_char参数
    feachData(lookup_root_view_key.value, letter.toLowerCase(), searchKeyword.value || null)
  } else {
    // 如果选择"全部"，则不传first_char参数
    feachData(lookup_root_view_key.value, null, searchKeyword.value || null)
  }
}
</script>

<style lang="scss" scoped>
.choose-person-dialog {
  :deep(.el-dialog) {
    background: rgba(0, 21, 41, 0.95);
    border: 1px solid #1ecfff;
    border-radius: 8px;
    box-shadow: 0 0 30px rgba(30, 207, 255, 0.4);
  }
  
  :deep(.el-dialog__header) {
    margin-right: 0;
    border-bottom: 1px solid rgba(30, 207, 255, 0.3);
    background: linear-gradient(90deg, #1573ce 0%, #0a2a50 100%);
    padding: 15px 20px;
  }
  
  :deep(.el-dialog__title) {
    color: #fff;
    font-size: 16px;
    font-weight: 500;
  }
  
  :deep(.el-dialog__headerbtn) {
    top: 15px;
    
    .el-dialog__close {
      color: #fff;
    }
  }
  
  :deep(.el-dialog__footer) {
    border-top: 1px solid rgba(30, 207, 255, 0.3);
    padding: 15px 20px;
  }
}

.dialog-content {
  display: flex;
  min-height: 400px;
  color: #fff;
  padding-top: 14px;
}

.left-panel {
  flex: 1;
  border-right: 1px solid rgba(30, 207, 255, 0.3);
  padding-right: 20px;
}

.right-panel {
  width: 450px;
  padding-left: 20px;
}

.panel-title {
  font-size: 16px;
  font-weight: 500;
  color: #1ecfff;
  margin-bottom: 15px;
}

.search-box {
  margin-bottom: 15px;
  
  :deep(.el-input__wrapper) {
    background-color: rgba(0, 21, 41, 0.5);
    border: 1px solid rgba(30, 207, 255, 0.5);
    box-shadow: none !important;
  }
  
  :deep(.el-input__inner) {
    color: #fff;
  }
  
  :deep(.el-input-group__append) {
    background-color: rgba(30, 207, 255, 0.2);
    border: 1px solid rgba(30, 207, 255, 0.5);
    color: #1ecfff;
  }
}

.alphabet-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 15px;
  
  .filter-item {
    display: inline-block;
    padding: 2px 6px;
    cursor: pointer;
    color: #b6eaff;
    
    &:hover, &.active {
      color: #1ecfff;
    }
  }
}

.person-list {
  height: 300px;
  overflow-y: auto;
  border: 1px solid rgba(30, 207, 255, 0.3);
  background-color: rgba(0, 21, 41, 0.3);
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: rgba(30, 207, 255, 0.5);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-track {
    background-color: rgba(0, 21, 41, 0.5);
  }
}

.person-group {
  margin-bottom: 10px;
  
  .group-title {
    font-weight: 500;
    padding: 5px 10px;
    background-color: rgba(30, 207, 255, 0.1);
  }
  
  .person-item {
    padding: 8px 15px;
    cursor: pointer;
    
    &:hover {
      background-color: rgba(30, 207, 255, 0.1);
    }
  }
}

.selected-list {
  height: 300px;
  overflow-y: auto;
  border: 1px solid rgba(30, 207, 255, 0.3);
  background-color: rgba(0, 21, 41, 0.3);
  
  .selected-item {
    padding: 8px 15px;
    border-bottom: 1px solid rgba(30, 207, 255, 0.1);
  }
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: rgba(30, 207, 255, 0.5);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-track {
    background-color: rgba(0, 21, 41, 0.5);
  }
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 15px;
  
  .page-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border: 1px solid rgba(30, 207, 255, 0.5);
    color: #1ecfff;
    cursor: pointer;
    
    &:hover {
      background-color: rgba(30, 207, 255, 0.1);
    }
  }
  
  .page-info {
    margin: 0 10px;
    color: #b6eaff;
  }
}

.dialog-footer {
  display: flex;
  align-items: center;
  
  .el-checkbox {
    margin-right: auto;
    
    :deep(.el-checkbox__label) {
      color: #fff;
    }
    
    :deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
      background-color: #1ecfff;
      border-color: #1ecfff;
    }
  }
  
  .el-button {
    margin-left: 10px;
  }
}
</style>