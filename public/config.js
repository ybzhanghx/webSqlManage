
const WConfig = {
  prod: {
    BASE_API_URL: 'http://localhost:8095',
    IDLE_TIME: 10
  },
  test: {
    BASE_API_URL: 'http://192.168.1.88:8095',
    IDLE_TIME: 10
  },
  chooseEnv: 'prod'
}
export default WConfig
