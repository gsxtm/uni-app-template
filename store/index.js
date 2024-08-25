import { createStore } from "vuex";

import {
  getTokenStorage,
  getUserinfoStorage,
  setTokenStorage,
  setUserinfoStorage,
} from "../common/index";

//Vuex.Store 构造器选项
const store = createStore({
  state() {
    return {
      token: getTokenStorage(),
      userinfo: getUserinfoStorage(),
      count: 0,
    };
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token;
      setTokenStorage(token);
    },
    SET_USERINFO: (state, payload) => {
      state.userinfo = payload;
      setUserinfoStorage(payload);
    },
    ADD_COUNT: (state) => {
      state.count++;
    },
  },
  actions: {
    clearLogin({ commit }) {
      commit("SET_TOKEN", "");
      commit("SET_USERINFO", {});
    },
    addCount({ commit }) {
      commit("ADD_COUNT");
    },
  },
});

export default store;
