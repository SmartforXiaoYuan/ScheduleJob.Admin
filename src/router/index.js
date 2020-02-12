import Vue from 'vue'
import VueRouter from 'vue-router'
import NoPage from '../views/404'


const _import = require('@/router/_import_' + process.env.NODE_ENV)//获取组件的方法

Vue.use(VueRouter)

const routes = [
  {
    path: '/404', component: NoPage, name: 'NoPage',
    meta: {
      title: 'NoPage',
      requireAuth: false,
      NoTabPage: true,
      NoNeedHome: true // 添加该字段，表示不需要home模板
    },
    hidden: true
  },
  {
    path: '/',
    component: () =>
      import('@/views/Home'),
    name: '首页',
    leaf: true,
    // meta: { title: '首页', requireAuth: true },
    children: [{
      path: '',
      name: 'About',
      meta: { title: '首页', requireAuth: true },
      component: () =>
        import('@/views/About')
    }]
  },
  {
    path: '/login',
    hidden: true,
    component: () =>
      import('@/views/login'),
    name: 'login',
    iconCls: 'fa-address-card',//图标样式class
  }, {
    path: '*',
    hidden: true,
    redirect: { path: '/404' }
  }

]

const router = new VueRouter({
  routes
})
export function resetRouter() {
  // router.matcher = newRouter.matcher // the relevant part
}

export function filterAsyncRouter(asyncRouterMap) {
  //注意这里的 asyncRouterMap 是一个数组
  const accessedRouters = asyncRouterMap.filter(route => {
    if (route.path) {
      try {
        route.component = _import(route.path.replace('/:id', ''))
      } catch (e) {
        try {
          route.component = () => import('@/views' + route.path.replace('/:id', '') + '.vue');
        } catch (error) {
          console.info('%c 当前路由 ' + route.path.replace('/:id', '') + '.vue 不存在，因此如法导入组件，请检查接口数据和组件是否匹配，并重新登录，清空缓存!', "color:red")
        }
      }
    }
    if (route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children)
    }
    return true
  })

  return accessedRouters
}

router.$addRoutes = (params) => {
  var f = item => {
    if (item['children']) {
      item['children'] = item['children'].filter(f);
      return true;
    } else if (item['IsButton']) {
      return item['IsButton'] === false;
    } else {
      return true;
    }
  }
  var params = params.filter(f);
  console.log(params)
  router.addRoutes(params)

  router.addRoutes([{
    path: '/test',
    component: () =>
      import('@/views/Home'),
    name: '权限管理',
    meta: { title: '权限管理' },
    icon: 'el-icon-s-opportunity',
    // leaf: true,

    children: [{
      path: '/user',
      name: '用户管理',
      meta: { title: '用户管理' },
      component: () =>
        import('@/views/User/User')
    }]
  }]);
  // window.localStorage.router = JSON.stringify([{
  //   path: '/test',
  //   component: () =>
  //     import('@/views/Home'),
  //   name: '权限管理',
  //   meta: { title: '权限管理' },
  //   icon: 'el-icon-s-opportunity',
  //   children: [{
  //     path: '/user',
  //     name: '用户管理',
  //     meta: { title: '用户管理' },
  //     component: () =>
  //       import('@/views/User/User')
  //   }]
  // }, {
  //   path: '/',
  //   component: () =>
  //     import('@/views/Home'),
  //   name: '首页',
  //   icon: 'el-icon-s-opportunity',
  //   leaf: true,
  //   children: [{
  //     path: '/about',
  //     name: 'About',
  //     meta: { title: '首页' },
  //     component: () =>
  //       import('@/views/About')
  //   }]
  // },]);
}
export default router
