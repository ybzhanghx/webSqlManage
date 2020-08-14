import Vue from 'vue'
import axios from 'axios'

Vue.prototype.$axios = axios

const fetch = async (url = '', data = {}, type = 'GET') => {
  type = type.toUpperCase()
  if (type === 'GET') {
    let dataStr = '' // 数据拼接字符串
    Object.keys(data).forEach(key => {
      dataStr += key + '=' + data[key] + '&'
    })

    if (dataStr !== '') {
      dataStr = dataStr.substr(0, dataStr.lastIndexOf('&'))
      url = url + '?' + dataStr
    }
  }

  const res = await axios({
    url: url,
    method: type,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    // responseType: 'json',
    // withCredentials: true,
    data: data
  })

  if (res && res.status === 200) {
    // var ztoken = res.headers.authorization;
    // if (ztoken != null && ztoken !== '') {
    //   sessionStorage.setItem('ztoken', ztoken);
    // }
    return res.data
  }

  return null
}

export { fetch }

// const service = axios.create({
//   baseURL: 'http://47.113.92.166', // api的base_url
//   timeout: 20000 // request timeout
//
// })
// export default service
