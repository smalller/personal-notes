/**
 * Store 入口
 * @author LiQingSong
 */
import { createStore } from 'vuex';
import { importAllStore } from '@/utils/store';
import createPersistedState from 'vuex-persistedstate'

export default createStore({
  modules: importAllStore(),
  plugins: [createPersistedState()],
  getters: {}
})
