<template>
  <div class="headerNav">
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
      <el-breadcrumb separator="/" class="app-breadcrumb breadcrumb-inner" style="float:left;margin-left: 10px;">
        <!-- <el-breadcrumb-item :to="{ path: '/' }" style="margin-left:20px"  >首页</el-breadcrumb-item> -->
        <!-- <el-breadcrumb-item v-for="item in levelList" v-show="item.name" :key="item.path">
          <label v-if="item.name !='首頁'">{{ item.name }}</label>
          <router-link v-else :to="item.path">{{item.title}}</router-link>
        </el-breadcrumb-item> -->
        <el-breadcrumb-item v-for="(item,index)  in levelList" :key="item.path" v-if="item.meta.title">
          <span v-if="index==levelList.length-1" class="no-redirect">{{item.meta.title}}</span>
          <router-link v-else :to="item.path">{{item.meta.title}}</router-link>
        </el-breadcrumb-item>
      </el-breadcrumb>
      <el-submenu index=" 2" style="float:right">
        <template slot="title">我的工作台</template>
        <el-menu-item index="2-1">选项1</el-menu-item>
        <el-menu-item index="2-2">选项2</el-menu-item>
        <el-menu-item index="2-3">选项3</el-menu-item>
      </el-submenu>
    </el-menu>
    <div class="line"></div>
  </div>
</template>

<script>
export default {
  name: 'headerNav',
  data() {
    return {
      username: '',
      activeIndex: '1',
      levelList: null
    }
  },
  created() {
    this.getBreadcrumb()
  },
  watch: {
    $route() {
      this.getBreadcrumb()
    }
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath)
    },
    getBreadcrumb() {
      let matched = this.$route.matched.filter(item => item.name)
      // console.log(matched, this.levelList)
      const first = matched[0]
      if (first && first.name !== '首页') {
        matched = [{ path: '/about', meta: { title: '首页' } }].concat(matched)
      }
      this.levelList = matched
      // console.log(this.levelList)
      // console.log(this.$route)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.el-breadcrumb {
  font-size: 14px;
  line-height: 4;
}
.no-redirect {
  color: #97a8be;
  cursor: text;
}
</style>



 

 
