<template>
  <!--  <div>后台管理系统-->
  <q-layout view="lHh Lpr lFf">
    <div class="login-wrap">
      <div class="ms-login">
        <div class="ms-title">后台管理系统</div>
        <el-form :model="param" :rules="rules" class="ms-content" label-width="0px" ref="login">
          <el-form-item prop="username">
            <el-input placeholder="username" v-model="param.username">
              <el-button icon="el-icon-lx-people" slot="prepend"></el-button>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              @keyup.enter.native="submitForm()"
              placeholder="password"
              type="password"
              v-model="param.password"
            >
              <el-button icon="el-icon-lx-lock" slot="prepend"></el-button>
            </el-input>
          </el-form-item>
          <div class="login-btn">
            <el-button @click="submitForm()" type="primary">登录</el-button>
          </div>
          <p class="login-tips">Tips : 用户名和密码随便填。</p>
        </el-form>
      </div>
    </div>
    <!--  </div>-->
  </q-layout>
</template>

<script>
  export default {
    data: function () {
      return {
        param: {
          username: 'admin',
          password: '123123'
        },
        rules: {
          username: [{
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          }],
          password: [{
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          }]
        }
      }
    },
    methods: {
      submitForm () {
        this.$refs.login.validate(valid => {
          if (valid) {
            this.$message.success('登录成功')
            localStorage.setItem('ms_username', this.param.username)
            this.$router.push('/')
          } else {
            this.$message.error('请输入账号和密码')
            console.log('error submit!!')
            return false
          }
        })
      }
    }
  }
</script>

<style scoped>
  .login-wrap {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    text-align: center;
    width: 100%;
    height: 100%;
    background-image: url('../assets/img/login-bg.jpg');
    background-size: 100%;
  }

  .ms-title {
    width: 100%;
    line-height: 50px;
    text-align: center;
    font-size: 20px;
    color: #fff;
    border-bottom: 1px solid #ddd;
  }

  .ms-login {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 350px;
    margin: -190px 0 0 -175px;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.3);
    overflow: hidden;
  }

  .ms-content {
    padding: 30px 30px;
  }

  .login-btn {
    text-align: center;
  }

  .login-btn button {
    width: 100%;
    height: 36px;
    margin-bottom: 10px;
  }

  .login-tips {
    font-size: 12px;
    line-height: 30px;
    color: #fff;
  }
</style>
