import { fetch } from 'boot/axios'

import WConfig from '../../public/config'

const chooseEnv = WConfig.chooseEnv

const useConfig = WConfig[chooseEnv]
console.log(useConfig)
const host = useConfig.BASE_API_URL

export const getTradeAccountData = data => fetch(host + '/manage/user/list', data, 'GET')
