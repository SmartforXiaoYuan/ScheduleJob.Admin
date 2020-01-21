<template>
  <div class="headerNav">
      <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
        <el-breadcrumb separator-class="el-icon-arrow-right" style="float:left">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        </el-breadcrumb>
        <el-submenu index="2" style="float:right">
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
  name: "headerNav",
  data() {
    return {
      username: "",
      activeIndex: '1'
    };
  },
  created() {
    // console.log(this.homeFlag);
  },
  methods: {
    handleSelect(key, keyPath) {
        console.log(key, keyPath);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
    .el-breadcrumb {
        font-size: 14px;
        line-height: 4;
    }
</style>
