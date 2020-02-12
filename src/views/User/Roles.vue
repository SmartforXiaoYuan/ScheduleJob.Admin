<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--用户数据-->
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <!--工具栏-->
        <div class="head-container">
          <div>
            <!-- 搜索 -->
            <el-input
              v-model="query.blurry"
              clearable
              size="small"
              placeholder="输入名称或者邮箱搜索"
              style="width: 200px;"
              class="filter-item"
            />
            <el-date-picker
              v-model="query.createTime"
              :default-time="['00:00:00','23:59:59']"
              type="daterange"
              range-separator=":"
              size="small"
              class="date-item"
              value-format="yyyy-MM-dd HH:mm:ss"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
            <el-select
              v-model="query.enabled"
              clearable
              size="small"
              placeholder="状态"
              class="filter-item"
              style="width: 90px"
            >
              <el-option
                v-for="item in enabledTypeOptions"
                :key="item.key"
                :label="item.display_name"
                :value="item.key"
              />
            </el-select>
            <el-button type="primary">搜索</el-button>
            <el-button type="primary" @click="dialogVisible = true">新增</el-button>
          </div>
        </div>
        <!--表单渲染-->
        <el-dialog append-to-body :close-on-click-modal="false" title="1212" width="570px" :visible.sync="dialogVisible">
          <el-form ref="form" :inline="true" :model="form" :rules="rules" size="small" label-width="66px">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="form.username" />
            </el-form-item>
            <el-form-item label="电话" prop="phone">
              <el-input v-model="form.phone" />
            </el-form-item>
            <el-form-item label="昵称" prop="nickName">
              <el-input v-model="form.nickName" />
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="form.email" />
            </el-form-item>
            <!-- <el-form-item label="部门" prop="dept.id">
              <treeselect
                v-model="form.dept.id"
                :options="depts"
                style="width: 178px"
                placeholder="选择部门"
                @select="selectFun"
              />
            </el-form-item> -->
            <!-- <el-form-item label="岗位" prop="job.id">
              <el-select v-model="form.job.id" style="width: 178px" placeholder="请先选择部门">
                <el-option
                  v-for="(item, index) in jobs"
                  :key="item.name + index"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item> -->
            <el-form-item label="性别">
              <el-radio-group v-model="form.sex" style="width: 178px">
                <el-radio label="男">男</el-radio>
                <el-radio label="女">女</el-radio>
              </el-radio-group>
            </el-form-item>
            <!-- <el-form-item label="状态">
              <el-radio-group v-model="form.enabled">
                <el-radio
                  v-for="item in dict.user_status"
                  :key="item.id"
                  :label="item.value"
                >{{ item.label }}</el-radio>
              </el-radio-group>
            </el-form-item> -->
            <el-form-item style="margin-bottom: 0;" label="角色" prop="roles">
              <el-select
                v-model="form.roles"
                style="width: 437px"
                multiple
                placeholder="请选择"
              >
                <!-- <el-option
                  v-for="item in roles"
                  :key="item.name"
                  :disabled="level !== 1 && item.level <= level"
                  :label="item.name"
                  :value="item.id"
                /> -->
              </el-select>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary">取消</el-button>
            <el-button type="primary">确认</el-button>
          </div>
        </el-dialog>
        <!--表格渲染-->
        <el-table ref="table"  :data="data" style="width: 100%;">
          <el-table-column  type="selection" width="55" />
          <el-table-column  :show-overflow-tooltip="true" prop="username" label="用户名" />
          <el-table-column  :show-overflow-tooltip="true" prop="nickName" label="昵称" />
          <el-table-column  prop="sex" label="性别" />
          <el-table-column  :show-overflow-tooltip="true" prop="phone" width="100" label="电话" />
          <el-table-column  :show-overflow-tooltip="true" width="125" prop="email" label="邮箱" />
          <el-table-column  :show-overflow-tooltip="true" width="110" prop="dept" label="部门 / 岗位">
          </el-table-column>
          <el-table-column label="状态" align="center" prop="enabled">
          </el-table-column>
          <el-table-column prop="createTime" width="140" label="创建日期">
        
          </el-table-column>
          <el-table-column
            label="操作"
            width="125"
            align="center"
            fixed="right"
          >
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>

export default {
  name: 'User',
  data() {
    return {
        dialogVisible:false,
      form:{
        username:'',
        phone:'',
        nickName:'',
        email:'',
        sex:'',
        roles:''
      },  
      query:{
          blurry:'',
          createTime:'',
          enabled:''
      },
      height: document.documentElement.clientHeight - 180 + 'px;',
      deptName: '', depts: [], deptDatas: [], jobs: [], level: 3, roles: [],
      defaultProps: { children: 'children', label: 'name' },
      permission: {
        add: ['admin', 'user:add'],
        edit: ['admin', 'user:edit'],
        del: ['admin', 'user:del']
      },
      enabledTypeOptions: [
        { key: 'true', display_name: '激活' },
        { key: 'false', display_name: '锁定' }
      ],
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        nickName: [
          { required: true, message: '请输入用户昵称', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
        ],
        phone: [
          { required: true, trigger: 'blur' }
        ]
      },
      data:[]
    }
  },
  computed: {
  },
  created() {
  },
  mounted: function() {
  },
  methods: {
  }
}
</script>
<style scoped>
.head-container{
    margin:10px 10px
}
</style>
