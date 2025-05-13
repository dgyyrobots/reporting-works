import request from '/@/config/axios/index.ts'


export const listAllUnitmeasure = () => {
    return request.get({ url: '/mes/md-unit-measure/selectall' })
}