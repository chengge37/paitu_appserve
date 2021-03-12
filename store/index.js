import Vue from 'vue'
import Vuex from 'vuex'
import modules from './modules'
import getters from './getters'
// import user from './modules/user'
// import refresh from './modules/refresh'

Vue.use(Vuex);
// export default new Vuex.Store({
//   modules: {
//     user,
//     refresh
//   },
//   getters
// })
export default new Vuex.Store({
  modules,
  getters
})