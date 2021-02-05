<template>
<div class="SystemLog">



  <div class="select-container">
    <div class="left-container">
      <el-select v-model="level" placeholder="请选择" clearable @clear="reload" size="small">
        <el-option
          v-for="item in levelFilter"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button
        type="primary"
        icon="el-icon-search"
        @click="search(level)"
        size="small">搜索</el-button>
      <el-button
        @click="dialogVisible = true"
        size="small"
        type="danger">删除</el-button>
      <el-button
        @click="reload"
        size="small"
        type="warning">刷新</el-button>

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
      :header-cell-style="headerStyle"
      >
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
          prop="level"
          label="级别"
          width="300"
          :filters="levelFilter"
          :filter-method="filterHandler">
          <template slot-scope="scope">
            <span @click="show(scope)">
              {{scope.row.level}}
            </span>
            <div
              class="levelType"
              :class="{'alert':scope.row.level=='Alert',
                       'error':scope.row.level=='Error',
                       'notification':scope.row.level=='Notification',
                       'debugging':scope.row.level=='Debugging'}">
            </div>
          </template>
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
import idea from '../../public.js'
export default {
  name: "SystemLog",
  mounted() {
    // this.createData()
    // this.createData2()
    // this.createData3()
    // this.createData4()
    this.reload()
    console.log(this.$route.query)
  },
  data () {
    return {
      tableData:[],
      levelFilter:[{
        text:'Alert',
        value:'Alert',
        label:'Alert'
      },{
        text:'Error',
        value:'Error',
        label:'Error'
      },{
        text:'Notification',
        value:'Notification',
        label:'Notification'
      },{
        text:'Debuging',
        value:'Debuging',
        label:'Debuging'
      }],
      level:'',
      total:0,
      Page:1,
      dialogVisible: false,
      headerStyle:{
        backgroundColor:'#94a2af',
        color:'#000000',
        borderRight:'1px solid #a8bcd0',
      }
    };
  },
  methods: {
    //获取
    //节流
    reload: idea.throttle(function(){
      //没有传递参数则为空
      this.level=this.$route.query.level || '';
      let data = JSON.parse(JSON.stringify(this._data))
      delete data.levelFilter
      delete data.tableData
      let param ={
        url:'/cgi-bin/getsyslog.cgi',
        method:'post',
        bodyData:data
      }
      console.log(param)
      this.$http.requestPost(param).then((result)=>{
        if(result.data.State=='success'){
          this.total = result.data.Data.Sum;
          this.tableData=result.data.Data.LogData;
        }else if(result.data.State=='fail'){
          this.$message({type:'warning',message:result.data.Info});
        }else{
          this.$message({type:'warning',message:'未知错误，请联系开发人员！'});
        }
      })
    },1000),


    search(level,page){
      console.log('我被调用了')
      // let data = JSON.parse(JSON.stringify(this._data))
      // console.log(tar)
      // console.log(this)
      const searchLevel=level||this.level;
      const searchPage=page||this.Page;
      // delete data.levelFilter
      // delete data.tableData
      let param ={
        url:'/cgi-bin/getsyslog.cgi',
        method:'post',
        bodyData:{
          Page:searchPage,
          level:searchLevel
        }
      }
      console.log(param)
      this.$http.requestPost(param).then((result)=>{
        if(result.data.State=='success'){
          this.total = result.data.Data.Sum;
          this.tableData = result.data.Data.LogData;
        }else if(result.data.State=='fail'){
          this.$message({type:'warning',message:result.data.Info});
        }else{
          this.$message({type:'warning',message:'未知错误，请联系开发人员！'})
        }

      })
    },


    getPage(Page){
      this.Page = Page
      let data = JSON.parse(JSON.stringify(this._data))
      if(this.level == ''){
        delete data.level
      }

      let param = {
        url:'/cgi-bin/getsyslog.cgi',
        method:'post',
        bodyData:data
      }
      this.$http.requestPost(param).then((result)=>{
        if(result.data.State=='success'){
          this.total = result.data.Data.Sum;
          this.tableData=result.data.Data.LogData;
        }else if(result.data.State=='fail'){
          this.$message({type:'warning',message:result.data.Info});
        }else{
          this.$message({type:'warning',message:'未知错误，请联系开发人员！'});
        }
      })
    },


    createData(){
      for(let i = 0; i<3;i++){
        let item = {
          time:i,
          level:"Alert",
          detailedInformation:"AAAAAA"
        }
        this.tableData.push(item)
      }
    },
    createData2(){
      for(let i = 0; i<3;i++){
        let item = {
          time:i,
          level:"Error",
          detailedInformation:"BBBBBB"
        }
        this.tableData.push(item)
      }
    },
    createData3(){
      for(let i = 0; i<3;i++){
        let item = {
          time:i,
          level:"Notification",
          detailedInformation:"CCCCCC"
        }
        this.tableData.push(item)
      }
    },
    createData4(){
      for(let i = 0; i<3;i++){
        let item = {
          time:i,
          level:"Debugging",
          detailedInformation:"DDDDDD"
        }
        this.tableData.push(item)
      }
    },
    filterHandler(value, row, column) {
      const property = column['property'];
      return row[property] === value;
    },
    getVal(val){
      console.log(val)
      this.val=val
    },
    deleteLog(){
      const param={
        url:'/cgi-bin/setlog.cgi',
        method:'post',
        bodyData:{
          LogType:'syslog'
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
    /*justify-content: space-between;*/
    /*height: 80px;*/
    /*line-height: 80px;*/
    padding-bottom: 15px;
  }
  .levelType{
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 0.5px solid #000;
    float: left;
    padding-top: 2px;
  }
  .alert{
    background: red;
  }
  .error{
    background: orange;
  }
  .notification{
    background:yellow
  }
  .debugging{
    background:grey
  }

</style>
