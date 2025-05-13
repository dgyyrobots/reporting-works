<template>
  <vab-app></vab-app>
</template>

<script lang="ts" setup>
import { noDebugger } from '/@/config/index'
import { useSettingsStore } from '/@/store/modules/settings'
import { useAppStore } from '/@/store/modules/app'

defineOptions({
  name: 'App',
})

const settingsStore = useSettingsStore()
const appStore = useAppStore()
const { updateTheme, changeColor } = settingsStore

appStore.getTenantByWebsite()
onBeforeMount(() => {
  changeColor()
  updateTheme()
  // 移除反调试代码，让开发过程更加顺畅
  // if (!location.hostname.includes('127') && !location.hostname.includes('localhost')) {
  //   if (location.hostname === 'vue-admin-beautiful.com' || location.hostname === 'chu1204505056.gitee.io' || noDebugger) {
  //     ;(() => {
  //       const block = () => {
  //         useIntervalFn(() => {
  //           ;(function () {
  //             return false
  //           })
  //             ['constructor']('debugger')
  //             ['call']()
  //         }, 50)
  //       }

  //       try {
  //         if (location.hostname === 'vue-admin-beautiful.com' || location.hostname === 'chu1204505056.gitee.io')
  //           console.error('禁止调试，请联系虎鲸智造客服0571-88300396！')
  //         block()
  //       } catch (err) {
  //         /* empty */
  //       }
  //     })()
  //   }
  // }
})
</script>
