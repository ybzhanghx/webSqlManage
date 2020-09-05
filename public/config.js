
const WConfig = {
  prod: {
    BASE_API_URL: 'http://localhost:8095',
    IDLE_TIME: 10
  },
  test: {
    BASE_API_URL: 'http://192.168.10.18:8095',
    IDLE_TIME: 10
  },
  chooseEnv: 'test'
}
export default WConfig
