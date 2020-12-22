<template>
<div class="SystemLog">

  <div class="port-head">
    <div class="head-text">
      <span>系统日志</span>
    </div>
    <div class="head-button">
      <el-button title="帮助"><i class="el-icon-notebook-1"></i></el-button>
    </div>
  </div>

  <div class="select-container">
    <div class="left-container">
      <el-select v-model="level" placeholder="请选择" clearable @clear="reload">
        <el-option
          v-for="item in levelFilter"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
    </div>

    <div class="right-container">
      <el-button @click="reload"><i class="el-icon-refresh"></i></el-button>
      <el-button ><i class="el-icon-delete"></i></el-button>
     </div>
  </div>

  <div class="log-table">
    <el-table
      :data="tableData"
      style="width: 100%"
      border
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
      Page:1
    };
  },
  methods: {
    //获取
    //节流
    reload: idea.throttle(function(){
      let data = JSON.parse(JSON.stringify(this._data))
      delete data.levelFilter
      delete data.tableData
      let param ={
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
    },1000),


    search(){
      let data = JSON.parse(JSON.stringify(this._data))
      delete data.levelFilter
      delete data.tableData
      let param ={
        url:'/cgi-bin/getsyslog.cgi',
        method:'post',
        bodyData:data
      }
      // console.log(param)
      this.$http.requestPost(param).then((result)=>{
        if(result.data.State=='success'){

        }
        this.total = result.data[0]
        this.tableData = result.data[1]
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
    }
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
