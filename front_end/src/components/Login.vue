<!-- 登录界面-->
<template>
  <div class="login">
    <a-modal header="" footer="" :visible="showModal" :closable="false">
      <a-tabs @change="changeType">
        <a-tab-pane key="login" tab="登录"> </a-tab-pane>
        <a-tab-pane key="register" tab="注册" force-render> </a-tab-pane>
<!--        <a-tab-pane key="retrieve" tab="找回密码" force-render> </a-tab-pane>-->
      </a-tabs>
      <a-form id="components-form-demo-normal-login" :form="form" class="login-form" @submit="handleSubmit">
        <a-form-item>
          <a-input v-decorator="['username', { rules: [{ required: true, message: '请输入用户名!' }] }]" placeholder="username">
            <a-icon slot="prefix" type="user" style="color: rgba(0, 0, 0, 0.25)" />
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-input
            v-decorator="['password', { rules: [{ required: true, message: '请输入密码!' }] }]"
            type="password"
            placeholder="Password"
          >
            <a-icon slot="prefix" type="lock" style="color: rgba(0, 0, 0, 0.25)" />
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-checkbox
            v-decorator="[
              'remember',
              {
                valuePropName: 'checked',
                initialValue: false,
              },
            ]"
          >
            记住密码
          </a-checkbox>
          <a-button type="primary" html-type="submit" :loading="loading" class="login-form-button">
            {{ buttonText }}
          </a-button>
        </a-form-item>
        <div style="text-align: right;">
          <a-text
            style="font-size: 15px; color: #3094fc; cursor: pointer; text-decoration-line: underline"
            @click="back"
          >找回密码</a-text
          >
        </div>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { nameVerify, passwordVerify } from '@/utils/common';

const appModule = namespace('app');

@Component
export default class Login extends Vue {
  @appModule.Getter('loading') loading: boolean;

  @Prop() showModal: boolean;

  form: any = null;

  type: string = 'login';

  buttonText: string = '登录';

  created() {
    this.form = this.$form.createForm(this, { name: 'normal_login' });
  }

  changeType(type: string) {
    this.type = type;
    if (this.type === 'login') {
      this.buttonText = '登录';
    } else if (this.type === 'register') {
      this.buttonText = '注册';
      this.$router.push({ path: '/RegisterForChat' });
    } else if (this.type === 'retrieve') {
      this.buttonText = '找回密码';
      this.$router.push({ path: '/RetrievePasswordChat' });
    }

  }
  back(){
    this.$router.push({ path: '/RetrievePasswordChat' });
  }

  handleSubmit(e: any) {
    e.preventDefault();
    this.form.validateFields((err: any, user: User) => {
      if (!err) {
        if (this.type === 'register') {
          user.createTime = new Date().valueOf();
        }
        delete (user as any).remember;
        if (!nameVerify(user.username)) {
          return;
        }
        if (!passwordVerify(user.password)) {
          return;
        }
        this.$emit(this.type, user);
      }
    });
  }
}
</script>
<style lang="scss" scoped>
#components-form-demo-normal-login .login-form {
  max-width: 300px;
}
#components-form-demo-normal-login .login-form-forgot {
  float: right;
}
#components-form-demo-normal-login .login-form-button {
  width: 100%;
}
</style>
