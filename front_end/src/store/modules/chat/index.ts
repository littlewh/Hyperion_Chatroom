import { Module } from 'vuex';
import actions from './actions';
import getters from './getters';
import state, { ChatState } from './state';
import { RootState } from '../../index';

const chat: Module<ChatState, RootState> = {
  namespaced: true,
  state,
  actions,
  getters,
};

export default chat;
