<template>
  <div class="head-container">
    <el-col v-if="buttonList!==undefined && buttonList.length>0" :span="24" class="SearchTool" style="padding-bottom: 0px;">
      <el-form :inline="true" @submit.native.prevent>
        <el-form-item>
          <el-input v-model="searchVal" placeholder="请输入内容" size="small"></el-input>
        </el-form-item>
        <!-- 这个就是当前页面内，所有的btn列表 -->
        <el-form-item v-for="item in buttonList">
          <!-- 这里触发点击事件 -->
          <el-button type="primary" @click="callFunc(item)" size="small">{{item.name}}</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </div>
</template>
<script>
export default {
  name: 'SearchTool',
  data() {
    return {
      searchVal: '' //双向绑定搜索内容
    }
  },
  props: ['buttonList'], //接受父组件传值
  methods: {
    callFunc(item) {
      item.search = this.searchVal
      this.$emit('callFunction', item) //将值传给父组件
    }
  }
}
</script>