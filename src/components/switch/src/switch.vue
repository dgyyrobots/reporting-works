<script lang="ts" setup>
import { propTypes } from '@/utils/propTypes'
import { ref } from 'vue'
import * as commonApi from '@/api/common/index.ts'
defineOptions({ name: 'SwitchS' })

let props= defineProps({
  name: propTypes.string.def(''),
  val: propTypes.string.def(''),
  obj: propTypes.object.def({}),
})
let obj= props.obj;
let autoGenFlag=ref(false)
const emit = defineEmits(['update:activeName'])
let change=async (fag:boolean)=>{
  console.log(obj)
  console.log(obj[props.val])
  if(fag){
    let data= await commonApi.getAutocode(props.name)
    obj[props.val]=data
      emit('update:activeName',data)
  }else{
    obj[props.val]=null
     emit('update:activeName',null)
  }
}
</script>
<template>
  <el-switch v-model="autoGenFlag" @change="change"  active-text="自动生成" style="white-space: nowrap;" />
</template>
