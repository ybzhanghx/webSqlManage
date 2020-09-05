import { fetch } from 'boot/axios'

import WConfig from '../../public/config'

const chooseEnv = WConfig.chooseEnv

const useConfig = WConfig[chooseEnv]
console.log(useConfig)
const host = useConfig.BASE_API_URL

export const getTableDataList = data => fetch(host + '/v1/table/list', data, 'GET')
export const UpdateTableData = data => fetch(host + '/v1/table/updateTableData', data, 'POST')
// export const getTableConfig = data => fetch(host + '/manage/funcList/getTableConfig', data, 'GET')
export const getTableConfig = data => fetch(host + '/v1/dbTbInfo/TableConfig', data, 'GET')
// export const getTableNames = data => fetch(host + '/manage/funcList/getAllTables', data, 'GET')
export const getTableNames = data => fetch(host + '/v1/dbTbInfo/getAllTables', data, 'GET')

export const UpdateTableConfig = data => fetch(host + '/v1/dbTbInfo/updateTableConfig', data, 'POST')
