import type { App } from 'vue'
import  {ItemSelect}  from './itemSelect'
import  {SwitchS}  from './switch'
import  {ClientSelect}  from './clientSelect'
// import Icon  from './Icon/src/Icon.vue'
import { Icon } from './Icon'
export const setupGlobCom = (app: App<Element>): void => {
  app.component('icon', Icon)
  app.component('ItemSelect', ItemSelect)
  app.component('SwitchS', SwitchS)
  app.component('ClientSelect', ClientSelect)
}
