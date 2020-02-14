<template>
  <div>
    <div class="app-container">
      <!--工具条-->
      <div style="display:flex;">
        <SearchTool :buttonList="buttonList" @callFunction="callFunction"></SearchTool>
      </div>
      <div style="display:flex;flex-direction: row;">
        <div style="width:60%;margin-left: 10px; margin-right: 10px;">
          <!--表格渲染-->
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span style="font-weight:700">角色列表</span>
            </div>
            <div class="text item">
              <el-table :data="tableData" highlight-current-row v-loading="listLoading" @row-click="operate" style="width: 100%;">
                <el-table-column type="index" width="80"></el-table-column>
                <el-table-column prop="Name" label="角色名" width sortable></el-table-column>
                <el-table-column prop="Description" label="说明" width sortable></el-table-column>
                <el-table-column prop="CreatedDate" label="创建时间" :formatter="formatCreateTime" width sortable></el-table-column>
                <!--<el-table-column prop="CreateBy" label="创建者" width="" sortable>-->
                <!--</el-table-column>-->
                <el-table-column prop="Enabled" label="状态" width="200" sortable>
                  <template slot-scope="scope">
                    <el-tag :type="scope.row.Enabled  ? 'success' : 'danger'" disable-transitions>{{scope.row.Enabled ? "正常":"禁用"}}</el-tag>
                  </template>
                </el-table-column>
              </el-table>
              <!--工具条-->
              <el-col :span="24" class="toolbar">
                <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="50" :total="total" style="float:right;"></el-pagination>
              </el-col>
            </div>
          </el-card>

        </div>
        <div style="width:40%">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span style="font-weight:700">菜单分配</span>
              <el-button :loading="loadingSave" @click="saveAssign" style="float: right; padding: 6px 9px;" type="primary"><i class="el-icon-check"></i>保存</el-button>
            </div>

            <el-tree :data="menuTreeData" show-checkbox node-key="value" ref="tree" default-expand-all :expand-on-click-node="true" :check-strictly="true">
              <span class="custom-tree-node" slot-scope="{ node, data }">
                <span>{{ node.label }}</span>
              </span>
            </el-tree>
          </el-card>

        </div>
      </div>
      <!--新增界面-->
      <el-dialog title="新增" :visible.sync="addFormVisible" v-model="addFormVisible" :close-on-click-modal="false">
        <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
          <el-form-item label="角色名" prop="Name">
            <el-input v-model="addForm.Name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="状态" prop="Enabled">
            <el-select v-model="addForm.Enabled" placeholder="请选择角色状态">
              <el-option label="激活" value="true"></el-option>
              <el-option label="禁用" value="false"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="说明" prop="Description">
            <el-input v-model="addForm.Description" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="addFormVisible = false">取消</el-button>
          <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
// import SearchToolbar from '../../components/SearchToolbar.vue'
import SearchTool from '@/components/SearchToolbar.vue'
import util from '../../../util/date'
import { getRoleListPage, addRole, GetMenusTreeList, addRoleModule } from '../../api/api'
export default {
  components: { SearchTool },
  name: 'User',
  data() {
    return {
      filters: {
        name: ''
      },
      buttonList: [],
      statusList: [
        { name: '激活', value: true },
        { name: '禁用', value: false }
      ],
      roleid: 0,
      total: 0,
      page: 1,
      listLoading: false,
      dialogVisible: false,
      addLoading: false,
      tableData: [],
      query: {
        blurry: '',
        createTime: '',
        enabled: ''
      },
      loadingSave: false,
      addFormVisible: false,
      //新增界面数据
      addForm: {
        CreatedId: '',
        CreatedName: '',
        Name: '',
        IsDrop: false
      },
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
        phone: [{ required: true, trigger: 'blur' }]
      },
      addFormRules: {
        Name: [{ required: true, message: '请输入角色名', trigger: 'blur' }],
        Enabled: [{ required: true, message: '请选择状态', trigger: 'blur' }]
      },
      menuTreeData: []
    }
  },
  computed: {},
  created() {},
  mounted: function() {
    this.getPermissions()
    this.getRoles()
    this.buttonList = [
      {
        name: '查询',
        IsHide: false,
        IsButton: true,
        path: '',
        Func: 'getRoles'
      },
      {
        name: '新增',
        IsHide: false,
        IsButton: true,
        path: '',
        Func: 'handleAdd'
      }
    ]
  },
  methods: {
    callFunction(item) {
      this.filters = {
        name: item.search
      }
      this[item.Func].apply(this, item)
    },
    handleCurrentChange(val) {
      this.page = val
      this.getRoles()
    },
    formatEnabled: function(row, column) {
      return row.Enabled ? '正常' : '未知'
    },
    formatCreateTime: function(row, column) {
      return !row.CreatedDate || row.CreatedDate == ''
        ? ''
        : util.formatDate.format(new Date(row.CreatedDate), 'yyyy-MM-dd hh:mm:ss')
    },
    //获取用户列表
    getRoles() {
      let _this = this
      console.log('测试apply不理解')
      let para = {
        page: this.page,
        key: this.filters.name
      }
      this.listLoading = true
      getRoleListPage(para).then(res => {
        // this.total = res.data.Date.dataCount
        this.tableData = res.data.Data.Models
        this.listLoading = false
      })
    },
    //显示新增界面
    handleAdd() {
      this.addFormVisible = true
      this.addForm = {
        CreateId: 0,
        CreatedName: '',
        Name: '',
        Enabled: ''
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
            addRole(para).then(res => {
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
                this.getRoles()
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
    //获取菜单树
    getPermissions() {
      let _this = this
      let para = { needbtn: false }
      GetMenusTreeList(para).then(res => {
        _this.loadingSave = false
        this.data = res.data.Data.children
        console.log(res)
        this.menuTreeData = JSON.parse(JSON.stringify(this.data))
      })
    },
    saveAssign() {
      let _this = this
      this.loadingSave = true
      console.log(this.$refs.tree.getCheckedKeys())
      let pids = this.$refs.tree.getCheckedKeys()
      let para = { pids: pids, rid: this.roleid }
      if (para.rid > 0 && para.pids.length > 0) {
        addRoleModule(para).then(res => {
          _this.loadingSave = false
          if ((res.data.Code = 200)) {
            this.$message({
              message: res.data.Msg,
              type: 'success'
            })
            this.getRoles()
          } else {
            this.$message({
              message: res.data.Msg,
              type: 'error'
            })
          }
        })
      } else {
        this.$message({
          message: '参数错误',
          type: 'error'
        })
      }
    },
    operate(row) {
      // this.loadingSave = true
      this.roleid = row.Id
      // this.getPermissionIds(id)
      this.$refs.tree.setCheckedKeys(row.MenuIds)
    }
  }
}
</script>
<style scoped>
.head-container {
  margin: 10px 10px;
}
</style>
