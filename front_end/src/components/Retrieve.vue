<!-- 登录界面-->
<template>
  <div class="login">
    <a-modal header="" footer="" :visible="showModal" :closable="false">
      <a-tabs @change="changeType">
        <a-tab-pane key="retrieve" tab="找回密码"> </a-tab-pane>
        <a-tab-pane key="login" tab="登录" force-render> </a-tab-pane>
      </a-tabs>
      <a-form id="components-form-demo-normal-login" :form="form" class="login-form" @submit="handleSubmit">
        <a-form-item>
          <a-input v-decorator="['username', { rules: [{ required: true, message: '请输入用户名!' }] }]" placeholder="username">
            <a-icon slot="prefix" type="user" style="color: rgba(0, 0, 0, 0.25)" />
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-input
            v-decorator="['password', { rules: [{ required: true, message: '请输入新密码!' }] }]"
            type="password"
            placeholder="Password"
          >
            <a-icon slot="prefix" type="lock" style="color: rgba(0, 0, 0, 0.25)" />
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-input v-decorator="['email', { rules: [{ required: true, message: '请输入邮箱!' }] }]" placeholder="email">
            <a-icon slot="prefix" type="mail" style="color: rgba(0, 0, 0, 0.25)" />
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-input v-decorator="['code', { rules: [{ required: false, message: '请输入验证码!' }] }]" placeholder="code">
            <a-icon slot="prefix" type="code" style="color: rgba(0, 0, 0, 0.25)" />
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" html-type="submit" :loading="loading" class="login-form-button">
            {{ '发送验证码' }}
          </a-button>
          <a-button type="primary" html-type="submit" :loading="loading" class="login-form-button">
            {{ buttonText }}
          </a-button>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { emailVerify, nameVerify, passwordVerify } from '@/utils/common';

const appModule = namespace('app');

@Component
export default class Login extends Vue {
  @appModule.Getter('loading') loading: boolean;

  @Prop() showModal: boolean;

  form: any = null;

  type: string = 'retrieve';

  buttonText: string = '找回';

  created() {
    this.form = this.$form.createForm(this, { name: 'normal_retrieve' });
  }

  changeType(type: string) {
    this.type = type;
    if (this.type === 'login') {
      this.buttonText = '登录';
      this.$router.push({ path: '/' });
    } else if (this.type === 'retrieve') {
      this.buttonText = '提交';
    }
  }

  handleSubmit(e: any) {
    e.preventDefault();
    this.form.validateFields((err: any, user: User) => {
      if (!err) {
        if (this.type === 'retrieve') {
          user.createTime = new Date().valueOf();
        }
        delete (user as any).remember;
        if (!nameVerify(user.username)) {
          return;
        }
        if (!passwordVerify(user.password)) {
          return;
        }
        if(!emailVerify(user.email)) {
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
