import { fetch } from 'boot/axios'

import WConfig from '../../public/config'

const chooseEnv = WConfig.chooseEnv

const useConfig = WConfig[chooseEnv]
console.log(useConfig)
const host = useConfig.BASE_API_URL

export const getTradeAccountData = data => fetch(host + '/manage/user/list', data, 'GET')

export const getTableConfig = data => fetch(host + '/manage/funcList/getTableConfig', data, 'GET')
export const getTableNames = data => fetch(host + '/manage/funcList/getAllTables', data, 'GET')

export const UpdateTableConfig = data => fetch(host + '/tt2', data, 'POST')
