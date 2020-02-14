import axios from 'axios';
import router from '../router/index'
import Vue from 'vue';
import store from "../store";
// 请求延时
axios.defaults.timeout = 20000
let base = '';



// 登录
export const requestLogin = params => {
  return axios.get(`${base}/api/Login/jwttoken3.0`, { params: params }).then(res => res.data);
};
export const requestLoginMock = params => { return axios.post(`${base}/login`, params).then(res => res.data); };
export const getUserByToken = params => {
  return axios.get(`${base}/api/user/getInfoByToken`, { params: params }).then(res => res.data);
};




export const getNavigationBar = params => {
  return axios.get(`${base}/api/MenuTree/GetNavigationBar`, { params: params }).then(res => res.data);
};

// 用户管理
export const getUserListPage = params => {
  return axios.get(`${base}/api/user/get`, { params: params });
};
export const removeUser = params => {
  return axios.delete(`${base}/api/user/delete`, { params: params });
};
export const editUser = params => {
  return axios.put(`${base}/api/user/put`, params);
};
export const addUser = params => {
  return axios.post(`${base}/api/user/post`, params);
};
export const batchRemoveUser = params => {
  return axios.delete(`${base}/api/Claims/BatchDelete`, { params: params });//没做
};
// 角色管理
export const getRoleListPage = params => {
  return axios.get(`${base}/api/role/get`, { params: params });
};
export const removeRole = params => {
  return axios.delete(`${base}/api/role/delete`, { params: params });
};
export const editRole = params => {
  return axios.put(`${base}/api/role/put`, params);
};
export const addRole = params => {
  return axios.post(`${base}/api/role/post`, params);
};
// 菜单模块管理
// 列表+展开子菜单
export const GetTreeTable = params => {
  return axios.get(`${base}/api/MenuTree/GetTreeTable`, { params: params });
};
//父级树
export const GetMenusTreeList = params => {
  return axios.get(`${base}/api/MenuTree/GetMenusTreeList`, { params: params });
};
export const editMenuInfo = params => {
  return axios.put(`${base}/api/Menu/put`, params);
};
export const addMenuInfo = params => {
  return axios.post(`${base}/api/Menu/post`, params);
};
export const removeMenuInfo = params => {
  return axios.delete(`${base}/api/Menu/delete`, { params: params });
};
export const getPermissionIds = params => {
  return axios.get(`${base}/api/MenuTree/GetPermissionIdByRoleId`, { params: params });
};
export const addRoleModule = params => {
  return axios.post(`${base}/api/MenuTree/Assign`, params);
};

export const saveRefreshtime = params => {

  let nowtime = new Date();
  let lastRefreshtime = window.localStorage.refreshtime ? new Date(window.localStorage.refreshtime) : new Date(-1);
  let expiretime = new Date(Date.parse(window.localStorage.TokenExpire))

  let refreshCount = 1;//滑动系数
  if (lastRefreshtime >= nowtime) {
    lastRefreshtime = nowtime > expiretime ? nowtime : expiretime;
    lastRefreshtime.setMinutes(lastRefreshtime.getMinutes() + refreshCount);
    window.localStorage.refreshtime = lastRefreshtime;
  } else {
    window.localStorage.refreshtime = new Date(-1);
  }
};


const ToLogin = params => {
  store.commit("saveToken", "");
  store.commit("saveTokenExpire", "");
  store.commit("saveTagsData", "");
  window.localStorage.removeItem('user');
  window.localStorage.removeItem('NavigationBar');

  router.replace({
    path: "/login",
    query: { redirect: router.currentRoute.fullPath }
  });

  window.location.reload()

};

// 请求延时
axios.defaults.timeout = 20000

var storeTemp = store;
axios.interceptors.request.use(
  config => {
    var curTime = new Date()
    var expiretime = new Date(Date.parse(storeTemp.state.tokenExpire))

    if (storeTemp.state.token && (curTime < expiretime && storeTemp.state.tokenExpire)) {
      // 判断是否存在token，如果存在的话，则每个http header都加上token
      config.headers.Authorization = "Bearer " + storeTemp.state.token;
    }

    saveRefreshtime();

    return config;
  },
  err => {
    return Promise.reject(err);
  }
);
// http response 拦截器
axios.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    // 超时请求处理
    console.log(error.config)
    var originalRequest = error.config;
    if (error.code == 'ECONNABORTED' && error.message.indexOf('timeout') != -1 && !originalRequest._retry) {

      Vue.prototype.$message({
        message: '请求超时！',
        type: 'error'
      });

      originalRequest._retry = true
      return null;
    }

    if (error.response) {
      if (error.response.status == 401) {
        var curTime = new Date()
        var refreshtime = new Date(Date.parse(window.localStorage.refreshtime))
        // 在用户操作的活跃期内
        if (window.localStorage.refreshtime && (curTime <= refreshtime)) {

        }
        ToLogin()
      }
      // 403 无权限
      if (error.response.status == 403) {
        Vue.prototype.$message({
          message: '失败！该操作无权限',
          type: 'error'
        });
        return null;
      }
    }
    return ""; // 返回接口返回的错误信息
  }
);

