import postsData from '~/data/blog/posts.json';
import categoriesData from '~/data/blog/categories.json';

export const state = () => ({
  posts: [],
  categories: [],
  result: {}
});

export const getters = {
  getPosts: (state) => {
    return state.posts;
  },
  getCategories: (state) => {
    return state.categories;
  },
  getResult: (state) => {
    return state.result;
  }
};

export const mutations = {
  SET_POSTS: (state, posts) => {
    state.posts = posts;
  },
  SET_CATEGORIES: (state, categories) => {
    state.categories = categories;
  },
  SET_RESULT: (state, result) => {
    state.result = result;
  }
};

export const actions = {
  fetchPosts({ commit }) {
    commit('SET_POSTS', postsData);
  },
  fetchCategories({ commit }) {
    commit('SET_CATEGORIES', categoriesData);
  },
  saveResult({ commit }, result) {
    commit('SET_RESULT', result);
  }
};
