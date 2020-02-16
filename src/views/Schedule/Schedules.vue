<template>
  <div class="schedules">
    <div style="margin: 0px 10px 10px;">
      <el-button type="primary" size="small" @click="handleAdd">新建任务</el-button>
      <el-button type="success" size="small">暂停任务</el-button>
      <el-button type="warning" size="small" @click="handleStart">开启任务</el-button>
      <el-button type="success" size="small">立即执行</el-button>
      <el-button type="danger" size="small">修改任务</el-button>
      <el-button size="small">删除任务</el-button>
      <el-button type="primary" size="small">刷新数据</el-button>
    </div>
    <div style="">
      <div style="width:100%;margin-left: 10px; margin-right: 10px;">
        <!--表格渲染-->
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span style="font-weight:700">后台任务列表</span>
          </div>
          <div class="text item">
            <el-table :data="tableData" highlight-current-row style="width: 100%;" @row-click="operate" border :header-cell-style="{background:'#f8f8f9'}">
              <el-table-column type="selection" width="55" />
              <el-table-column prop="Name" label="作业名称" width sortable></el-table-column>
              <el-table-column prop="JobGroupName" label="作业分组" width sortable></el-table-column>

              <el-table-column prop="LastRunTime" label="最后执行时间" width="150" sortable></el-table-column>
              <el-table-column prop="Cron" label="间隔(Cron)" width sortable></el-table-column>

              <el-table-column prop="IsStart" label="状态" width sortable>
                <template slot-scope="scope">
                  <el-tag :type="scope.row.IsStart  ? '' : 'danger'" disable-transitions>{{scope.row.IsStart ? "已运行":"暂停"}}</el-tag>
                </template>

              </el-table-column>
              <el-table-column prop="Remark" label="描述" width sortable></el-table-column>
              <el-table-column prop="ApiUrl" label="ApiUrl" width sortable>
                <template>
                </template>
              </el-table-column>
              <el-table-column prop="MethodType" label="请求方式" width sortable></el-table-column>
              <el-table-column prop="HandlerJobNum" label="负责人" width sortable></el-table-column>
              <el-table-column prop="ErrorEmail" label="报警邮箱" width sortable></el-table-column>
              <el-table-column label="操作" width="150">
                <template scope="scope">
                  <el-button size="small">执行记录</el-button>
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

      <!--新增界面-->
      <el-dialog title="新增" :visible.sync="addFormVisible" v-model="addFormVisible" :close-on-click-modal="false">
        <el-form :model="addForm" label-width="120px" :rules="addFormRules" ref="addForm">
          <el-form-item label="作业名称" prop="Name">
            <el-input v-model="addForm.Name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="作业分组" prop="JobGroupName">
            <el-input v-model="addForm.JobGroupName" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="间隔(Cron)" prop="Cron">
            <el-input v-model="addForm.Cron" placeholder="如10分钟执行一次：0/0 0/10 * * * ? "></el-input>
          </el-form-item>
          <el-form-item label="描述">
            <el-input v-model="addForm.Remark" :min="0" :max="200"></el-input>
          </el-form-item>
          <el-form-item label="ApiUrl">
            <el-input v-model="addForm.ApiUrl" :min="0" :max="200"></el-input>
          </el-form-item>
          <el-form-item label="请求方式" prop="MethodType">
            <el-select v-model="addForm.MethodType" placeholder="请选择请求方式">
              <el-option label="Post" value="Post"></el-option>
              <el-option label="Get" value="Get"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="请求实体">
            <el-input v-model="addForm.RequestValue" placeholder="请求体(仅POST有效) 如：key1=value1&key2=value2"></el-input>
          </el-form-item>
          <el-form-item label="负责人">
            <el-input v-model="addForm.HandlerJobNum"></el-input>
          </el-form-item>
          <el-form-item label="报警邮箱">
            <el-input v-model="addForm.ErrorEmail"></el-input>
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
import { addScheduleJob, getScheduleJob, startScheduleJob } from '../../api/api'
import util from '../../../util/date'
export default {
  name: 'schedules',
  data() {
    return {
      tableData: [],
      total: 0,
      page: 1,
      addFormVisible: false,
      addLoading: false,
      scheduleJobId: 0,
      addForm: {
        Name: '',
        JobGroupName: '',
        Cron: '',
        Remark: '',
        ApiUrl: '',
        MethodType: '',
        HandlerJobNum: '',
        ErrorEmail: '',
        IsStart: 0,
        RequestValue: ''
      },
      addFormRules: {
        Name: [
          { required: true, message: '作业名称', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        JobGroupName: [{ required: true, message: '作业分组', trigger: 'blur' }],
        Cron: [{ required: true, message: 'Cron', trigger: 'blur' }],
        ApiUrl: [{ required: true, message: 'ApiUrl', trigger: 'blur' }],
        MethodType: [{ required: true, message: '请求方式', trigger: 'blur' }]
      }
    }
  },
  computed: {},
  created() {},
  mounted: function() {
    this.getJob()
  },
  methods: {
    handleCurrentChange(val) {
      this.page = val
    },
    getJob: function() {
      let para = {
        page: this.page
        // key: this.filters.name
      }
      getScheduleJob(para).then(res => {
        console.log(res)
        this.tableData = res
        this.listLoading = false
      })
    },
    //显示新增界面
    handleAdd() {
      this.addFormVisible = true
      this.addForm = {
        Name: '',
        JobGroupName: '',
        Cron: '',
        Remark: '',
        ApiUrl: '',
        MethodType: '',
        HandlerJobNum: '',
        ErrorEmail: '',
        IsStart: 0,
        RequestValue: ''
      }
    }, //新增
    addSubmit: function() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.addLoading = true
            let para = Object.assign({}, this.addForm)
            console.log(para)
            addScheduleJob(para).then(res => {
              console.log(res)
              if (util.isEmt.format(res)) {
                this.addLoading = false
                return
              }
              if (res.Code) {
                this.addLoading = false
                this.$message({
                  message: res.Msg,
                  type: 'success'
                })
                this.$refs['addForm'].resetFields()
                this.addFormVisible = false
                this.getJob()
              } else {
                this.$message({
                  message: res.Msg,
                  type: 'error'
                })
              }
            })
          })
        }
      })
    },
    operate(row) {
      this.scheduleJobId = row.Id
    },
    handleStart() {
      let para = {
        jobId: this.scheduleJobId
      }
      if (para.jobId <= 0) {
        this.$message({
          message: 'jobId参数不正确,请先选择',
          type: 'error'
        })
      }
      console.log(para)
      startScheduleJob(para).then(res => {
        console.log(res)
        if (res.Code) {
          this.$message({
            message: res.Msg,
            type: 'success'
          })
          this.getJob()
        } else {
          this.$message({
            message: res.Msg,
            type: 'error'
          })
        }
      })
    }
  }
}
</script>
<style scoped>
</style>