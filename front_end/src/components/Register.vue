<!-- 邮件界面-->
<template>
  <div class="register">
      <a-form id="components-form-demo-normal-register" :form="form" class="register-form" @submit="handleSubmit">
        <a-form-item>
          <a-text style="color: rgb(100, 100, 100); position: absolute; left: -35px; top: -9px">昵称:</a-text>
          <a-input v-decorator="['username', { rules: [{ required: true, message: '请输入昵称！' }] }]" placeholder="请输入昵称">
            <a-icon slot="prefix" type="user" style="color: rgba(0, 0, 0, 0.25)" />
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-text style="color: rgb(100, 100, 100); position: absolute; left: -35px; top: -9px">密码:</a-text>
          <a-input
            v-decorator="['password', { rules: [{ required: true, message: '请输入密码！' }] }]"
            type="password"
            placeholder="请输入密码"
          >
            <a-icon slot="prefix" type="lock" style="color: rgba(0, 0, 0, 0.25)" />
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-text style="color: rgb(100, 100, 100); position: absolute; left: -35px; top: -9px">邮箱:</a-text>
          <a-input v-decorator="['email', { rules: [{ required: true, message: '请输入邮箱！' }] }]" placeholder="请输入邮箱">
            <a-icon slot="prefix" type="mail" style="color: rgba(0, 0, 0, 0.25)" />
          </a-input>
        </a-form-item>
        <a-form-item style="position: absolute; width: 150px">
          <a-text style="color: rgb(100, 100, 100); position: absolute; left: -50px; top: -9px">验证码:</a-text>
          <a-input v-decorator="['code', { rules: [{ required: false, message: '请输入验证码！' }] }]" placeholder="请输入验证码">
            <a-icon slot="prefix" type="code" style="color: rgba(0, 0, 0, 0.25)" />
          </a-input>
          <a-button
            style="position: absolute; border: 0px; top: -8px; left: 160px; width: 95px"
            type="primary"
            html-type="submit"
            :loading="loading"
            class="register-form-button">
                  {{ '发送验证码' }}
          </a-button>
      </a-form-item>
        <a-form-item>
          <a-button
            style="position: absolute; top: 66px; left: -190px;width: 333px"
            type="primary"
            html-type="submit"
            :loading="loading"
            class="register-form-button">
                  {{ '提交' }}
          </a-button>
        </a-form-item>
    </a-form>

  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { emailVerify, nameVerify, passwordVerify } from '@/utils/common';

const appModule = namespace('app');

@Component
export default class Register extends Vue {
  @appModule.Getter('loading') loading: boolean;

  @Prop() showModal: boolean;

  form: any = null;

  type: string = 'register';

  created() {
    this.form = this.$form.createForm(this, { name: 'normal_register' });
  }

  handleSubmit(e: any) {
    // console.log("submit");
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
#components-form-demo-normal-register .register-form {
  max-width: 300px;
}
#components-form-demo-normal-register .register-form-forgot {
  float: right;
}
#components-form-demo-normal-register .register-form-button {
  width: 100%;
}
</style>
