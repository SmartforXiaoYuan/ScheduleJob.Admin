import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  // {
  //   path: '/',
  //   name: 'home',
  //   component: Home
  // },
  // {
  //   path: '/about',
  //   name: 'about',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
  {
    path: '/',
    component: () =>
        import ('@/views/Home'),
    icon: 'el-icon-menu',
    leaf: true, //只有一个节点
    redirect: '/home',
    children: [{
        path: '/home',
        component: () =>
            import ('@/views/About'),
        name: '控制台',
    }]
  },{
    path: '/',
    component: () =>
        import ('@/views/Home'),
    name: '权限管理',
    icon: 'el-icon-s-opportunity',
    // leaf: true,
    redirect: '/user',
    children: [{
        path: '/user',
        name: '用户管理',
        component: () =>
            import ('@/views/User/User')
    },{
      path: '/role',
      name: '角色管理',
      component: () =>
          import ('@/views/User/Roles')
  }, {
        path: '/menu',
        name: '菜单管理',
        component: () =>
            import ('@/views/Menu/Menu')
    }]
}
]

const router = new VueRouter({
  routes
})
// router.beforeEach((to, from, next) => {
//   //NProgress.start();
//   if (to.path == '/login') {
//     localStorage.removeItem('data');
//   }
//   let user = JSON.parse(localStorage.getItem('data'));
//   if (!user && to.path != '/login') {
//     next({ path: '/login' })
//   } else {
//     next()
//   }
// })  
export default router
