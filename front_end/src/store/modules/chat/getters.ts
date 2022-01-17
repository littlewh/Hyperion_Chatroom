import { GetterTree } from 'vuex';
import { ChatState } from './state';
import { RootState } from '../../index';

const getters: GetterTree<ChatState, RootState> = {
  socket(state) {
    return state.socket;
  },
  dropped(state) {
    return state.dropped;
  },
};

export default getters;
