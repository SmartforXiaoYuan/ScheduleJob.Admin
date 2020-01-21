<template>
  <div class="app" style="background-color: #304156;">
      <h4 style="color:#fff;text-align:center">
        Job
      </h4>
      <el-menu 
      default-active="1" 
      class="el-menu-vertical-demo"
      :collapse="isCollapse"
      :unique-opened="true"
      :router="true"
      background-color="#424f63"
      text-color="#fff"
      active-text-color="#65cea7">
          <el-menu-item class="widthButton" @click="changeNav">
            <i :class="isCollapse?'el-icon-s-unfold':'el-icon-s-fold'"></i>  
          </el-menu-item>
        <template v-for="(item,index) in navList" v-if="!item.hidden">
          <el-submenu :index="index+''" v-if="!item.leaf" :key="index">
            <template slot="title">
              <i :class="item.icon"></i>
              <span>
                {{item.name}}
              </span>
            </template>
            <el-menu-item v-for="child in item.children" :index="child.path" :key="child.path" v-if="!child.hidden">
              {{child.name}}
            </el-menu-item>
          </el-submenu>
          <el-menu-item v-else :index="item.path" :key="index">
            <i :class="item.icon"></i>
            <span slot="title">
              {{item.name}}
            </span>      
          </el-menu-item>
        </template>
      </el-menu>
  </div>
</template>

<script>
export default {
  name: 'asideNav',
  data(){
    return{
      isCollapse: false,
      navList:[],
      buttonWidth:{
        width:'180px'
      }
    }
  },
  methods: {
      getNavList(){
        // this.navList=this.$router.options.routes
        let data= [
            {
              icon: 'el-icon-menu',
              name: '控制台',
              path: '/home',
              leaf:true,
              hidden:false
            },
            {
              icon: 'el-icon-s-opportunity',
              name: '权限管理',
              leaf:false,
              hidden:false,
              children: [
                {
                  icon: 'el-icon-s-opportunity',
                  name: '用户管理',
                  path: '/user',
                  hidden: false
                },{
                  icon: 'el-icon-s-opportunity',
                  name: '角色管理',
                  path: '/role',
                  hidden: false
                },{
                  icon: 'el-icon-s-opportunity',
                  name: '菜单管理',
                  path: '/menu',
                  hidden: false
                }
              ]
            }
          ]
        this.navList = data
      },
      changeNav(){
        this.isCollapse=!this.isCollapse
      }
    },
    created(){
      this.getNavList()
    }
}
</script>

<style>
  .el-menu-item, .el-submenu__title {
    height: 50px;
    line-height: 50px;
  }
</style>
<style lang="less" scoped>
  .app{
    height: 100%;
    position: relative;
  }
  .el-radio-group{
    position: absolute;
    top:0;
    right:-5px;
    z-index: 999;
  }
   .el-menu{
        border:none
    }
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    height: 100%;
    min-height: 400px;
  }
  .el-menu--collapse{
    height:100%;
  }
  .el-menu-item, .el-submenu__title {
    height: 50px;
    line-height: 50px;
  }
  .widthButton{
    text-align: center;
    height: 30px;
    line-height: 30px;
    border-bottom: 1px solid #232323;
  }
</style>

