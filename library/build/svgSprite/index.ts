import path from 'path'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

export const createSvgIcons = () => {
  return createSvgIconsPlugin({
    iconDirs: [path.resolve(process.cwd(), 'src/icon')],
    symbolId: 'icon-[name]',
  })
}
