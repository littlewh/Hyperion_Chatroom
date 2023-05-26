import cookie from 'js-cookie';
import { MutationTree } from 'vuex';
import { SET_USER, CLEAR_USER, SET_TOKEN, SET_MOBILE, SET_BACKGROUND, SET_ACTIVETABNAME, SET_LOADING } from './mutation-types';
import { AppState } from './state';

const mutations: MutationTree<AppState> = {// 定义mutations
    [SET_USER](state, payload: User) {
        state.user = payload;
        // 数据持久化到cookies
        cookie.set('user', payload, { expires: 3650 });// 10年
    },

    [CLEAR_USER](state) {// 退出登录
        state.user = {
            userId: '',
            username: '',
            password: '',
            avatar: '',
            email: '',
            createTime: 0,
        };
        cookie.set('user', '');// 清空cookie
        cookie.set('token', '');// 清空cookie
    },

    [SET_TOKEN](state, payload) {// 登录成功后设置token
        state.token = payload;
        cookie.set('token', payload, { expires: 3 });
    },

    [SET_MOBILE](state, payload: boolean) {// 设置是否为移动端
        state.mobile = payload;
    },

    [SET_BACKGROUND](state, payload: string) {// 设置背景图片
        state.background = payload;
        localStorage.setItem('background', payload);
    },
    [SET_ACTIVETABNAME](state, payload: 'message' | 'contacts') {// 设置当前激活的tab
        state.activeTabName = payload;
    },
    [SET_LOADING](state, payload: boolean) {// 设置loading
        state.loading = payload;
    },
};

export default mutations;
