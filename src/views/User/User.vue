<template>
  <div class="app-container">
    <el-row>
      <!--用户数据-->
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">

        <!--工具条-->
        <div class="head-container">
          <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters" @submit.native.prevent>
              <el-form-item>
                <el-input v-model="filters.name" placeholder="昵称/登录名" size="small"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" size="small" @click="getUsers">查询</el-button>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" size="small" @click="handleAdd">新增</el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </div>
        <!--表格渲染-->
        <el-table ref="table" :data="tableData" v-loading="listLoading" style="width: 100%;">
          <el-table-column type="selection" width="55" />
          <el-table-column :show-overflow-tooltip="true" prop="UserName" label="用户名" />
          <el-table-column :show-overflow-tooltip="true" prop="NickName" label="昵称" />
          <el-table-column prop="RoleNames" label="角色" width="" sortable>
            <template slot-scope="scope">
              <el-tag v-for="item in scope.row.RoleNames" :key="item.Id">{{item}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="Sex" label="性别" :formatter="formatSex" />
          <el-table-column :show-overflow-tooltip="true" prop="Age" label="年龄" />
          <el-table-column :show-overflow-tooltip="true" width="125" prop="Email" label="邮箱" />
          <el-table-column :show-overflow-tooltip="true" width="200" prop="Birth" label="生日" :formatter="formatBirth">
          </el-table-column>
          <el-table-column prop="CreateTime" width="150" label="创建日期">
          </el-table-column>
          <el-table-column prop="Status" label="状态" width="" sortable>
            <template slot-scope="scope">
              <el-tag :type="scope.row.Status == 1  ? 'success' : 'danger'" disable-transitions>{{scope.row.Status == 1 ? "正常":"禁用"}}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template scope="scope">
              <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!--工具条-->
        <el-col :span="24" class="toolbar">
          <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
          <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="50" :total="total" style="float:right;">
          </el-pagination>
        </el-col>
        <!--编辑界面-->
        <el-dialog title="编辑" :visible.sync="editFormVisible" v-model="editFormVisible" :close-on-click-modal="false">
          <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
            <el-form-item label="昵称" prop="NickName">
              <el-input v-model="editForm.NickName" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="登录名" prop="UserName">
              <el-input v-model="editForm.UserName" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="角色" prop="RIDs">
              <el-select multiple v-model="editForm.RIDs" placeholder="请选择角色">
                <el-option :key="0" :label="'未选择角色'" :value="0"></el-option>
                <el-option v-for="item in roles" :key="item.Id" :label="item.Name" :value="item.Id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="性别">
              <el-radio-group v-model="editForm.Sex">
                <el-radio class="radio" :label="1">男</el-radio>
                <el-radio class="radio" :label="0">女</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="年龄">
              <el-input-number v-model="editForm.Age" :min="0" :max="200"></el-input-number>
            </el-form-item>
            <el-form-item label="生日">
              <el-date-picker type="date" placeholder="选择日期" v-model="editForm.Birth"></el-date-picker>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click.native="editFormVisible = false">取消</el-button>
            <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
          </div>
        </el-dialog>
        <!--新增界面-->
        <el-dialog title="新增" :visible.sync="addFormVisible" v-model="addFormVisible" :close-on-click-modal="false">
          <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
            <el-form-item label="昵称" prop="NickName">
              <el-input v-model="addForm.NickName" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="登录名" prop="UserName">
              <el-input v-model="addForm.UserName" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="UserPWD">
              <el-input v-model="addForm.UserPWD" show-password auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="性别">
              <el-radio-group v-model="addForm.Sex">
                <el-radio class="radio" :label="1">男</el-radio>
                <el-radio class="radio" :label="0">女</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="年龄">
              <el-input-number v-model="addForm.Age" :min="0" :max="200"></el-input-number>
            </el-form-item>
            <el-form-item label="生日">
              <el-date-picker type="date" placeholder="选择日期" v-model="addForm.Birth"></el-date-picker>
            </el-form-item>
            <!-- <el-form-item label="创建日期">
              <el-date-picker type="date" placeholder="选择日期" v-model="addForm.CreateTime"></el-date-picker>
            </el-form-item> -->
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click.native="addFormVisible = false">取消</el-button>
            <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
          </div>
        </el-dialog>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import util from '../../../util/date'
import { getUserListPage, addUser, getRoleListPage, editUser } from '../../api/api'
export default {
  name: 'User',
  data() {
    return {
      filters: {
        name: ''
      },
      roles: [],
      total: 0,
      page: 1,
      listLoading: false,
      addLoading: false,
      sels: [], //列表选中列
      tableData: [],
      addFormVisible: false,
      editFormVisible: false,
      listLoading: false,
      editLoading: false,

      query: {
        blurry: '',
        createTime: '',
        enabled: ''
      },
      height: document.documentElement.clientHeight - 180 + 'px;',
      deptName: '',
      depts: [],
      deptDatas: [],
      jobs: [],
      level: 3,
      roles: [],
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
      editForm: {
        Id: 0,
        UserName: '',
        UserPWD: '',
        NickName: '',
        Email: '',
        Sex: -1,
        Age: 0,
        Birth: ''
      },
      //新增界面数据
      addForm: {
        UserName: '',
        UserPWD: '',
        NickName: '',
        Email: '',
        Sex: -1,
        Age: 0,
        Birth: '',
        CreateTime: ''
      },
      addFormRules: {
        UserName: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        NickName: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
        UserPWD: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        Birth: [{ required: true, message: '请填写生日', trigger: 'blur' }]
      },
      editFormRules: {
        UserName: [{ required: true, message: '请输入登录名', trigger: 'blur' }],
        NickName: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
        Birth: [{ required: true, message: '请填写生日', trigger: 'blur' }]
      }
    }
  },
  computed: {},
  created() {},
  mounted: function() {
    this.getUsers()
  },
  methods: {
    //性别显示转换
    formatSex: function(row, column) {
      return row.Sex == 1 ? '男' : row.Sex == 0 ? '女' : '未知'
    },
    formatBirth: function(row, column) {
      return !row.Birth || row.Birth == ''
        ? ''
        : util.formatDate.format(new Date(row.Birth), 'yyyy-MM-dd')
    },
    handleCurrentChange(val) {
      this.page = val
      this.getUsers()
    },
    //获取用户列表
    getUsers() {
      let para = {
        page: this.page
        // key: this.filters.name
      }
      console.log(para)
      this.listLoading = true
      getUserListPage(para).then(res => {
        this.tableData = res.data.Data.Models
        this.listLoading = false
      })
    },
    //批量删除
    batchRemove: function() {},
    //显示新增界面
    handleAdd() {
      this.addFormVisible = true
      this.addForm = {
        UserName: '',
        UserPWD: '',
        NickName: '',
        Email: '',
        Sex: -1,
        Age: 0,
        Birth: '',
        CreateTime: ''
      }
    }, //新增
    addSubmit: function() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.addLoading = true
            let para = Object.assign({}, this.addForm)
            para.Birth =
              !para.Birth || para.Birth == ''
                ? util.formatDate.format(new Date(), 'yyyy-MM-dd')
                : util.formatDate.format(new Date(para.Birth), 'yyyy-MM-dd')
            para.CreateTime = util.formatDate.format(new Date(), 'yyyy-MM-dd hh:mm:ss')
            console.log(para)
            addUser(para).then(res => {
              console.log(res)
              if (util.isEmt.format(res)) {
                this.addLoading = false
                return
              }
              if (res.data.Code) {
                this.addLoading = false
                this.$message({
                  message: res.data.Msg,
                  type: 'success'
                })
                this.$refs['addForm'].resetFields()
                this.addFormVisible = false
                this.getUsers()
              } else {
                this.$message({
                  message: res.data.Msg,
                  type: 'error'
                })
              }
            })
          })
        }
      })
    },
    //显示编辑界面
    handleEdit: function(index, row) {
      this.editFormVisible = true
      this.editForm = Object.assign({}, row)
      getRoleListPage().then(res => {
        console.log(res)
        this.roles = res.data.Data.Models
      })
    }, //编辑
    editSubmit: function() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.editLoading = true
            //NProgress.start();
            let para = Object.assign({}, this.editForm)

            para.Birth =
              !para.Birth || para.Birth == ''
                ? util.formatDate.format(new Date(), 'yyyy-MM-dd')
                : util.formatDate.format(new Date(para.Birth), 'yyyy-MM-dd')

            editUser(para).then(res => {
              if (util.isEmt.format(res)) {
                this.editLoading = false
                return
              }
              if (res.data.Code == 200) {
                this.editLoading = false
                this.$message({
                  message: res.data.Msg,
                  type: 'success'
                })
                this.$refs['editForm'].resetFields()
                this.editFormVisible = false
                this.getUsers()
              } else {
                this.$message({
                  message: res.data.Msg,
                  type: 'error'
                })
              }
            })
          })
        }
      })
    }
  }
}
</script>
<style scoped>
.head-container {
  margin: 10px 10px;
}
</style>
