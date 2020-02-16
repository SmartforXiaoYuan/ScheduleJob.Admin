<template>
  <div class="app-container">
    <el-row>
      <!--用户数据-->
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <!--工具栏-->
        <div class="head-container">
          <div style="margin-top:5px">
            <div class="filter-item el-input el-input--small el-input--suffix" style="margin-right:10px">
              <!--工具条-->
              <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
                <el-form :inline="true" :model="filters" @submit.native.prevent>
                  <el-form-item>
                    <el-input v-model="filters.Name" placeholder="菜单/按钮名"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" size="mini" @click="getMenuTreeTable">查询</el-button>
                  </el-form-item>
                </el-form>
              </el-col>
            </div>
          </div>
          <div class="crud-opts" style="margin-top:5px">
            <span class="crud-opts-left">
              <button type="button" class="el-button filter-item el-button--primary el-button--mini" @click="handleAdd">
                <i class="el-icon-plus"></i><span>
                  新增
                </span>
              </button>
              <button disabled="disabled" type="button" class="el-button filter-item el-button--success el-button--mini is-disabled">
                <i class="el-icon-edit"></i><span>
                  修改
                </span>
              </button>
              <button disabled="disabled" type="button" class="el-button filter-item el-button--danger el-button--mini is-disabled" slot="reference">
                <!----><i class="el-icon-delete"></i><span>
                  删除
                </span>
              </button>
              <button type="button" class="el-button filter-item el-button--warning el-button--mini">
                <!----><i class="el-icon-download"></i><span>导出</span>
              </button>
            </span>
            <div class="el-button-group crud-opts-right">
              <button type="button" class="el-button el-button--info el-button--mini is-plain">
                <!----><i class="el-icon-search"></i>
                <!---->
              </button>
              <button type="button" class="el-button el-button--default el-button--mini">
                <!----><i class="el-icon-refresh"></i>
                <!---->
              </button>
              <span>
                <button type="button" class="el-button el-button--default el-button--mini el-popover__reference" aria-describedby="el-popover-4583" tabindex="0">
                  <!----><i class="el-icon-s-grid"></i><span><i aria-hidden="true" class="fa fa-caret-down"></i></span>
                </button>
              </span>
            </div>
          </div>
        </div>
        <!--表格渲染-->
        <el-table ref="tableDom" :data="tableData" highlight-current-row v-loading="listLoading" row-key="Id" border lazy :load="load" :tree-props="{children: 'children', hasChildren: 'hasChildren'}" style="width: 100%;">
          <el-table-column type="selection" width="50">
          </el-table-column>
          <el-table-column type="index" width="80">
          </el-table-column>
          <el-table-column label="菜单名称" width="200" sortable>
            <template slot-scope="scope">
              <!-- <i class="fa" :class="scope.row.Icon"></i> -->
              {{scope.row.Name}}
            </template>
          </el-table-column>
          <el-table-column prop="Icon" label="图标">
            <template slot-scope="scope">
              <i class="fa" :class="scope.row.Icon"></i>
            </template>
          </el-table-column>
          <el-table-column prop="RoutePath" label="路由地址" width="" sortable>
          </el-table-column>
          <el-table-column prop="ApiUrl" label="API接口" width="" sortable>
          </el-table-column>
          <el-table-column prop="CreatedDate" label="创建时间" :formatter="formatCreateTime" width="150" sortable>
          </el-table-column>
          <el-table-column prop="OrderSort" label="排序" width="50">
          </el-table-column>

          <el-table-column label="操作" width="150">
            <template scope="scope">
              <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <!--编辑界面-->
    <el-dialog title="编辑" :visible.sync="editFormVisible" v-model="editFormVisible" :close-on-click-modal="false">
      <!-- <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm"> -->
      <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
        <el-form-item label="菜单名称" prop="Name">
          <el-input v-model="editForm.Name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="路由地址" prop="RoutePath">
          <el-tooltip class="item" effect="dark" content="/" placement="top-start">
            <el-input v-model="editForm.RoutePath" auto-complete="off"></el-input>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="Icon" prop="Icon">
          <el-input v-model="editForm.Icon" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="Description">
          <el-input v-model="editForm.Description" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="OrderSort">
          <el-input v-model="editForm.OrderSort" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item prop="PidArr" label="父级菜单" width="" sortable>
          <el-cascader style="width: 400px" :key="isResouceShowedit" v-model="editForm.PidArr" :options="options" filterable change-on-select></el-cascader>
        </el-form-item>
        <el-form-item prop="ApiUrl" label="API地址" width="" sortable>
          <el-input v-model="editForm.ApiUrl" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
      </div>
    </el-dialog>

    <!--新增界面-->
    <el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false">
      <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
        <el-form-item label="菜单名称" prop="Name">
          <el-input v-model="addForm.Name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="路由地址" prop="RoutePath">
          <el-tooltip class="item" effect="dark" content="/" placement="top-start">
            <el-input v-model="addForm.RoutePath" auto-complete="off"></el-input>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="描述" prop="Description">
          <el-input v-model="addForm.Description" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="OrderSort">
          <el-input v-model="addForm.OrderSort" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="父级菜单" prop="PidArr" width="" sortable>
          <el-cascader v-model="addForm.PidArr" :key="isResouceShow" style="width: 400px" :options="options" filterable :props="{ multiple: false, checkStrictly: true }"></el-cascader>
        </el-form-item>
        <el-form-item prop="ApiUrl" label="API地址" width="" sortable>
          <!-- <el-cascader style="width: 400px" v-model="addForm.ApiUrl" :options="options" filterable change-on-select></el-cascader> -->
          <el-input v-model="addForm.ApiUrl" auto-complete="off"></el-input>
        </el-form-item>
        <!-- 
        <el-form-item prop="Mid" label="API接口" width="" sortable>
          <el-select style="width: 100%;" v-model="addForm.Mid" placeholder="请选择API">
            <el-option :key="0" :value="0" :label="'无需api'"> </el-option>
            <el-option v-for="item in modules" :key="item.Id" :value="item.Id" :label="item.LinkUrl">
              <span style="float: left">{{ item.ApiUrl }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{
                item.Name
              }}</span>
            </el-option>
          </el-select>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import util from '../../../util/date'
import {
  addMenuInfo,
  GetTreeTable,
  GetMenusTreeList,
  removeMenuInfo,
  editMenuInfo
} from '../../api/api'

export default {
  name: 'MenuInfo',
  data() {
    return {
      filters: {
        Name: ''
      },
      tableData: [],

      options: [],
      addFormVisible: false,
      editFormVisible: false,
      listLoading: false,
      editLoading: false,
      addLoading: false,
      form: {
        username: '',
        phone: '',
        nickName: '',
        email: '',
        sex: '',
        roles: ''
      },
      addFormRules: {
        Name: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
        RoutePath: [{ required: true, message: '请输入路由地址', trigger: 'blur' }]
      },
      //新增界面数据
      addForm: {
        PidArr: [],
        ParentId: 0, //上级菜单ID
        OrderSort: 0,
        Name: '', //菜单名称
        RoutePath: '', //前端路由地址
        ApiUrl: '', //API数据请求地址
        Description: '',
        Icon: '',
        IsMenu: '' //是否是右侧菜单
      },
      isResouceShow: 0,
      isResouceShowedit: 0,
      editFormRules: {
        Name: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
        Code: [{ required: true, message: '请输入路由地址', trigger: 'blur' }]
      },
      //编辑
      editForm: {
        PidArr: [],
        ParentId: 0, //上级菜单ID
        OrderSort: 0,
        Name: '', //菜单名称
        RoutePath: '', //前端路由地址
        ApiUrl: '', //API数据请求地址
        Description: '',
        Icon: '',
        IsMenu: '' //是否是右侧菜单
      },
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
      // level: 3,
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
      data: [],
      loadNodeMap: new Map(),
      selectCurrRow: null
    }
  },
  computed: {},
  created() {},
  mounted: function() {
    this.getMenuTreeTable()
  },
  methods: {
    formatCreateTime: function(row, column) {
      return !row.CreatedDate || row.CreatedDate == ''
        ? ''
        : util.formatDate.format(new Date(row.CreatedDate), 'yyyy-MM-dd')
    },
    //显示编辑界面
    handleEdit: function(index, row) {
      let that = this
      that.editLoading = true

      this.editFormVisible = true
      this.editForm = {}
      ++this.isResouceShowedit
      this.options = []
      let para = { pid: row.Id }
      /***点击编辑是row复制***/
      this.selectCurrRow = row
      GetMenusTreeList(para).then(res => {
        this.options.push(res.data.Data)
        that.editForm = Object.assign({}, row)
        that.editLoading = false
      })
    }, //编辑
    editSubmit: function() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.editLoading = true
            //NProgress.start();
            let para = Object.assign({}, this.editForm)

            para.UpdateDate = util.formatDate.format(new Date(), 'yyyy-MM-dd')

            para.Pid = para.PidArr.pop()

            if (para.Id == para.Pid) {
              this.$message({
                message: '警告，父节点不能是自己！',
                type: 'error'
              })

              this.editLoading = false
              return
            }
            editMenuInfo(para).then(res => {
              console.log(res)
              if (util.isEmt.format(res)) {
                this.editLoading = false
                return
              }
              this.editLoading = false
              if (res.data.Code) {
                this.editLoading = false
                //NProgress.done();
                this.$message({
                  message: res.data.Msg,
                  type: 'success'
                })
                this.$refs['editForm'].resetFields()
                this.editFormVisible = false
                this.getMenuTreeTable()
                const { id } = this.selectCurrRow
                if (this.loadNodeMap.has(id)) {
                  const { tree, treeNode, resolve } = this.loadNodeMap.get(id)
                  this.$set(this.$refs.tableDom.store.states.lazyTreeNodeMap, id, [])
                  this.load(tree, treeNode, resolve)
                } else {
                  this.selectCurrRow.hasChildren = true
                }
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
    //删除
    handleDel: function(index, row) {
      this.$confirm('确认删除该记录吗?', '提示', {
        type: 'warning'
      })
        .then(() => {
          this.listLoading = true
          //NProgress.start();
          let para = { id: row.Id }
          removeMenuInfo(para).then(res => {
            if (util.isEmt.format(res)) {
              this.listLoading = false
              return
            }
            this.listLoading = false
            //NProgress.done();
            if (res.data.Data) {
              this.$message({
                message: '删除成功',
                type: 'success'
              })
            } else {
              this.$message({
                message: res.data.Msg,
                type: 'error'
              })
            }
            this.getMenuTreeTable()
            const { pid } = row
            const { tree, treeNode, resolve } = this.maps.get(pid)
            this.$set(this.$refs.table.store.states.lazyTreeNodeMap, pid, [])
            this.load(tree, treeNode, resolve)
          })
        })
        .catch(() => {})
    },
    //显示新增界面
    handleAdd() {
      this.options = []
      this.addForm = {
        CreatedId: '',
        CreatedName: '',
        UpdateId: '',
        UpdateName: '',
        PidArr: [],
        Name: '',
        Code: '',
        OrderSort: 0,
        Description: '',
        Enabled: true,
        Icon: ''
      }
      this.addFormVisible = true
      let para = { pid: 0 }
      ++this.isResouceShow
      GetMenusTreeList(para).then(res => {
        console.log(res.data.Data)
        this.options.push(res.data.Data)
      })
    },
    //新增
    addSubmit: function() {
      let _this = this
      this.$refs.addForm.validate(valid => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.addLoading = true
            //NProgress.start();
            let para = Object.assign({}, this.addForm)

            para.CreateDate = util.formatDate.format(new Date(), 'yyyy-MM-dd')
            para.UpdateDate = para.CreateDate
            para.IsMenu = true

            para.ParentId = para.PidArr.pop()

            var user = JSON.parse(window.localStorage.user)
            console.log(user)
            if (user && user.Id > 0) {
              para.CreatedId = user.Id
              para.CreatedName = user.UserName
              para.UpdateId = user.Id
              para.UpdateName = user.UserName
            } else {
              this.$message({
                message: '用户信息为空，先登录',
                type: 'error'
              })
              _this.$router.replace(_this.$route.query.redirect ? _this.$route.query.redirect : '/')
            }
            console.log(para)
            addMenuInfo(para).then(res => {
              if (util.isEmt.format(res)) {
                this.addLoading = false
                return
              }
              this.addLoading = false
              if (res.data.Code) {
                this.addLoading = false
                //NProgress.done();
                this.$message({
                  message: res.data.Msg,
                  type: 'success'
                })
                this.$refs['addForm'].resetFields()
                this.addFormVisible = false

                this.getMenuTreeTable()
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
    //获取用户列表
    getMenuTreeTable() {
      let para = {
        page: this.page
        // key: this.filters.Name
      }
      this.listLoading = true
      GetTreeTable(para).then(res => {
        this.tableData = res.data.Data
        this.listLoading = false
      })
    },
    load(tree, treeNode, resolve) {
      this.loadNodeMap.set(tree.id, { tree, treeNode, resolve })
      let para = {
        page: this.page,
        f: tree.Id
        // key: this.filters.Name
      }
      console.log('展开子菜单')
      GetTreeTable(para).then(res => {
        console.log(res)
        resolve(res.data.Data)
      })
    }
  }
}
</script>
<style>
.head-container {
  margin: 10px 10px;
}
.el-range-editor.el-input__inner {
  padding: 2px 10px !important;
}
.crud-opts {
  padding: 6px 0;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
}
.crud-opts .crud-opts-right {
  margin-left: auto;
}
.pic-uploader-component .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.pic-uploader-component .el-upload .pic-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.pic-uploader-component .el-upload .pic {
  width: 178px;
  height: 178px;
  display: block;
}
.pic-uploader-component .el-upload:hover {
  border-color: #409eff;
}
.json-editor[data-v-7b2923da] {
  height: 100%;
  margin-bottom: 10px;
}
.json-editor[data-v-7b2923da] .CodeMirror {
  font-size: 13px;
  overflow-y: auto;
  font-weight: 400;
}
.json-editor[data-v-7b2923da] .cm-s-rubyblue span.cm-string {
  color: #f08047;
}
.material-name[data-v-6967804c] {
  padding: 8px 0;
}
.col-do[data-v-6967804c] {
  text-align: center;
}
.button-do[data-v-6967804c] {
  padding: unset !important;
  font-size: 12px;
}
.pic-uploader-component .el-upload[data-v-0a136fa2] {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.pic-uploader-component .el-upload .pic-uploader-icon[data-v-0a136fa2] {
  font-size: 28px;
  color: #8c939d;
  width: 100%;
  height: 40px;
  text-align: center;
}
.pic-uploader-component .el-upload .pic[data-v-0a136fa2] {
  width: 100%;
  height: 40px;
  display: block;
}
.pic-uploader-component .el-upload[data-v-0a136fa2]:hover {
  border-color: #409eff;
}
</style>
