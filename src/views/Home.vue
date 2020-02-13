<template>
  <div class="home">
    <el-container>
      <asideNav ref="asidenav"></asideNav>
      <el-main>
        <headerNav></headerNav>
        <SearchTool></SearchTool>
        <router-view></router-view>
      </el-main>
    </el-container>
    <!-- <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
    <router-view></router-view> -->
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
import asideNav from '@/components/SidebarMenu.vue'
import headerNav from '@/components/header/Header'
import SearchTool from '@/components/SearchToolbar.vue'
export default {
  name: 'home',
  components: {
    HelloWorld,
    asideNav,
    headerNav,
    SearchTool
  }
}
</script>
<style>
.home {
  height: 100%;
}
.el-container {
  height: 100%;
}
.el-main {
  padding: 0px 0px 0px 4px !important;
}
.el-header {
  height: 50px !important;
  line-height: 50px;
}
</style>

