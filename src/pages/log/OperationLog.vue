<template>
<div class="OperationLog">

  <div class="port-head">
    <div class="head-text">
      <span>操作日志</span>
    </div>
    <div class="head-button">
<!--      <el-button title="帮助"><i class="el-icon-notebook-1"></i></el-button>-->
    </div>
  </div>

  <div class="select-container">
    <div class="left-container">
        <span>选择搜索时间：</span>
        <el-date-picker
          v-model="Stime"
          type="date"
          placeholder="开始日期"
          format="yyyy 年 MM 月 dd 日"
          value-format="yyyy-MM-dd">
        </el-date-picker>
        <el-date-picker
          v-model="Etime"
          type="date"
          placeholder="结束日期"
          format="yyyy 年 MM 月 dd 日"
          value-format="yyyy-MM-dd">
        </el-date-picker>
        <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
    </div>

    <div class="right-container">
      <el-button @click="reload"><i class="el-icon-refresh"></i></el-button>
      <el-button @click="dialogVisible = true"><i class="el-icon-delete"></i></el-button>
     </div>
  </div>

    <el-dialog
      title="是否删除所有日志"
      :visible.sync="dialogVisible"
      width="30%">
      <span>是否删除所有操作日志？</span>
      <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="deleteLog">确 定</el-button>
    </span>
    </el-dialog>

  <div class="log-table">
    <el-table
      :data="tableData"
      style="width: 100%"
      border
      max-height="680">
        <el-table-column
          type="index"
          label="序号"
          width="55">
        </el-table-column>
        <el-table-column
          prop="time"
          label="时间"
          width="300">
        </el-table-column>
        <el-table-column
          prop="operator"
          label="操作人员"
          width="300">
        </el-table-column>
        <el-table-column
          prop="detailedInformation"
          label="详细信息">
        </el-table-column>
    </el-table>
    <el-pagination
      :page-size="50"
      layout="total, prev, pager, next"
      :total='total'
      @current-change='getPage'>
    </el-pagination>
  </div>
</div>
</template>
<script>
export default {
  name: "OperationLog",
  mounted(){
    // this.createData()
    // this.createData2()
    // this.createData3()
    // this.createData4()
    this.reload()
  },
  data () {
    return {
      //搜索内容
      tableData:[],
      total:0,
      Page:1,
      searchState:0,
      Stime:'',
      Etime:'',
      dialogVisible: false,
    };
  },
  methods: {
    //获取
    reload(){
      //重置时间选择器
      let data = JSON.parse(JSON.stringify(this._data))
      if(this.searchState == 0){
        delete data.Stime
        delete data.Etime
        data.ID=window.sessionStorage.getItem('userName');
      }
      let param ={
        url:'/cgi-bin/getoplog.cgi',
        method:'post',
        bodyData:data
      }
      // console.log(param)
      this.$http.requestPost(param).then((result)=>{
        // console.log(result)
        if(result.data.State=='success'){
          this.total = result.data.Data.Sum
          this.tableData=result.data.Data.LogData
        }else if(result.data.State=='fail'){
          this.$message({type:'warning',message:result.data.Info});
        }else{
          this.$message({type:'warning',message:'未知错误，请联系开发人员！'})
        }

      })
    },
    //翻页的
    getPage(Page){
      // console.log('正在搜索')
      let data = JSON.parse(JSON.stringify(this._data));
      this.Page = Page
      if(this.searchState == 0){
        delete data.Stime
        delete data.Etime
      }
      let param = {
        url:'/cgi-bin/getoplog.cgi',
        method:'post',
        bodyData:data
      }
      // console.log(param)
      this.$http.requestPost(param).then((result)=>{
        if(result.data.State=='success'){
          this.reload()
        }else if(result.data.State=='fail'){
          this.$message({type:'warning',message:result.data.Info});
        }else{
          this.$message({type:'warning',message:'未知错误，请联系开发人员！'})
        }
      })
    },
    search(){
      this.Page=1
      let data = JSON.parse(JSON.stringify(this._data))
      data.tableData = []
      let param = {
        url:'/cgi-bin/getoplog.cgi',
        method:'post',
        bodyData:data
      }
      // console.log(param)
      this.$http.requestPost(param).then((result)=>{
        // console.log(result)
        // this.reload
        //让serachState改变，领分页进入搜索模式
        // this.searchState = 1
        if(result.data.State=='success'){
          this.total = result.data.Data.Sum
          this.tableData=result.data.Data.LogData
        }else if(result.data.State=='fail'){
          this.$message({type:'warning',message:result.data.Info});
        }else{
          this.$message({type:'warning',message:'未知错误，请联系开发人员！'})
        }
      })
    },
    createData(){
      for(let i = 0; i<3;i++){
        let item = {
          time:i,
          operator:"admin",
          detailedInformation:"AAAAAA"
        }
        this.tableData.push(item)
      }
    },
    createData2(){
      for(let i = 0; i<3;i++){
        let item = {
          time:i,
          operator:"admin",
          detailedInformation:"BBBBBB"
        }
        this.tableData.push(item)
      }
    },
    createData3(){
      for(let i = 0; i<3;i++){
        let item = {
          time:i,
          operator:"admin",
          detailedInformation:"CCCCCC"
        }
        this.tableData.push(item)
      }
    },
    createData4(){
      for(let i = 0; i<3;i++){
        let item = {
          time:i,
          operator:"admin",
          detailedInformation:"DDDDDD"
        }
        this.tableData.push(item)
      }
    },
    deleteLog(){

      const param={
        url:'/cgi-bin/setlog.cgi',
        method:'post',
        bodyData:{
          LogType:'oplog'
        }
      }
      this.$http.requestPost(param).then((result)=>{
        if(result.data.State=='success'){
          this.reload();
          this.tableData=[];
          this.dialogVisible = false
        }else if(result.data.State=='fail'){
          this.$message({type:'warning',message:result.data.Info});
        }else{
          this.$message({type:'warning',message:'未知错误，请联系开发人员！'});
        }
      })
    },
  },
}
</script>
<style scoped>
  /* 设置头部 */
  .port-head{
    display: flex;
    flex: 1;
    justify-content: space-between;
  }
  .head-text{
    height: 40px;
    line-height: 40px;
    text-align: center;
    font-size: 22px;
  }
  .select-container{
    display: flex;
    flex: 1;
    justify-content: space-between;
    height: 80px;
    line-height: 80px;
    margin-top: 10px;
    border-top: 2px solid #EBEEF5;
    border-bottom: 2px solid #EBEEF5;
  }
</style>
