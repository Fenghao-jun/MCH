<template>
  <div class="home-page">
    <el-row class="joural">
      <el-col :span="2">
        <div>
          <span class="title">系统日志</span>
        </div>
      </el-col>
      <el-col :span="20">
        <div >
          <el-row class="joural-box">
            <el-col :span="6">
              <div @click="getSystemLog('Alert')" class="Alert">
                <i class="el-icon-warning-outline" title="Emergency,Alert"></i>
                <span>紧急告警:{{Alert}}</span>
              </div>
            </el-col>
              <el-dialog
                title="日志信息"
                :visible.sync="AlertDialog"
                width="width">
                <el-table
                  :data="AlertData">
                  <el-table-column
                    v-for="(value,key) in dialogTableHead"
                    :key="key"
                    :prop="key"
                    :label="value">
                  </el-table-column>
                </el-table>
                <div slot="footer">
                  <el-button @click="AlertDialog = false">取 消</el-button>
                  <el-button type="primary" @click="AlertDialog = false">确 定</el-button>
                </div>
              </el-dialog>
            <el-col :span="6">
              <div @click="getSystemLog('Error')" class="Error">
                <i class="el-icon-warning-outline" title="Critical,Error"></i>
                <span>重要告警:{{Error}}</span>
              </div>
              <el-dialog
                title="日志信息"
                :visible.sync="ErrorDialog"
                width="width">
                <el-table
                  :data="ErrorData">
                  <el-table-column
                    v-for="(value,key) in dialogTableHead"
                    :key="key"
                    :prop="key"
                    :label="value">
                  </el-table-column>
                </el-table>
                <div slot="footer">
                  <el-button @click="ErrorDialog = false">取 消</el-button>
                  <el-button type="primary" @click="ErrorDialog = false">确 定</el-button>
                </div>
              </el-dialog>
            </el-col>
            <el-col :span="6">
              <div @click="getSystemLog('Notification')" class="Notification">
                <i class="el-icon-warning-outline" title="Warning,Notification"></i>
                <span>一般告警:{{Notification}}</span>
              </div>
              <el-dialog
                title="日志信息"
                :visible.sync="NotificationDialog"
                width="width">
                <el-table
                  :data="NotificationData">
                  <el-table-column
                    v-for="(value,key) in dialogTableHead"
                    :key="key"
                    :prop="key"
                    :label="value">
                  </el-table-column>
                </el-table>
                <div slot="footer">
                  <el-button @click="NotificationDialog = false">取 消</el-button>
                  <el-button type="primary" @click="NotificationDialog = false">确 定</el-button>
                </div>
              </el-dialog>
            </el-col>
            <el-col :span="6">
              <div @click="getSystemLog('Debugging')" class="Debuging">
                <i class="el-icon-warning-outline" title="Informational,Debugging"></i>
                <span>提示信息:{{Debuging}}</span>
              </div>
              <el-dialog
                title="日志信息"
                :visible.sync="DebuggingDialog"
                width="width">
                <el-table
                  :data="DebuggingData">
                  <el-table-column
                    v-for="(value,key) in dialogTableHead"
                    :key="key"
                    :prop="key"
                    :label="value">
                  </el-table-column>
                </el-table>
                <div slot="footer">
                  <el-button @click="DebuggingDialog = false">取 消</el-button>
                  <el-button type="primary" @click="DebuggingDialog = false">确 定</el-button>
                </div>
              </el-dialog>
            </el-col>
          </el-row>
        </div>
      </el-col>
      <el-col :span="1">
        <div >
          <el-button @click="moreLog('/SystemLog')">详情</el-button>
        </div>
      </el-col>
    </el-row>

    <el-row class="system-information" type="flex">
      <el-col :span="14" class="system-left">

        <div>
          <el-row style="height:42px">
            <el-col :span="20" class="title">
              槽位拓扑图
            </el-col>
            <el-col :span="1">
              <el-button>详情</el-button>
            </el-col>
          </el-row>
        </div>

        <el-table
          :data="tableData"
          border
          :span-method="objectSpanMethod"
          :show-header="false"
          :cell-style="twinkle"
          >
            <el-table-column
              prop="CU"
              label="CU"
              width="100"
              >
              <template slot-scope="scope">
                <div class="cu-left" >
                  <span>{{scope.row.CU}}</span>
                  <div class="AMC-lamp">
                    <span>
                      <span>RUN</span>
                      <div class="normal-lamp"
                      :class="{'poweron': scope.row.CUflag === 3,'running': scope.row.CUflag === 7}"></div>
                    </span>
                    <span>
                      <span>ALM</span>
                      <div class="normal-lamp"
                      :class="{'alm-lamp1':scope.row.CUflag === 11}"></div>
                    </span>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="AMC1"
              label="AMC1"
              >
              <template slot-scope="scope">
                <div class="AMC1" :class="{'empty':scope.row.AMC1==' '}">
                  <span class="device">{{scope.row.AMC1}}</span>
                  <canvas class="canvas" id="canvas"></canvas>
                  <div class="AMC-lamp" >
                    <span>
                      <span>RUN</span>
                      <div
                        class="normal-lamp"
                        :class="{'poweron': scope.row.flag1 === 3,'running':scope.row.flag1 === 7}"
                      >
                      </div>
                    </span>
                    <span>
                      <span>ALM</span>
                      <div
                        class="normal-lamp"
                        :class="{'alm-lamp1':scope.row.flag1 === 11}"
                        >
                      </div>
                    </span>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="AMC2"
              label = "AMC2"
              >
              <template slot-scope="scope">
                <div class="AMC2" :class="{'empty':scope.row.AMC2==' '}">
                  <span class="device">{{scope.row.AMC2}}</span>
                  <div class="AMC-lamp">
                    <span>
                      <span>RUN</span>
                      <div
                        class="normal-lamp"
                        :class="{'poweron': scope.row.flag2 === 3,'running':scope.row.flag2 === 7}"
                        >
                      </div>
                    </span>
                    <span>
                      <span>ALM</span>
                      <div
                        class="normal-lamp"
                        :class="{'alm-lamp1':scope.row.flag2 === 11}"
                        >
                      </div>
                    </span>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="CU"
              width="100"
              label="CU"
              >
              <template slot-scope="scope">
                <div class="CU" >
                  <span>{{scope.row.CU}}</span>
                  <div class="AMC-lamp" >
                    <span>
                      <span>RUN</span>
                      <div
                        class="normal-lamp"
                        :class="{'poweron': scope.row.CUflag === 3,'running': scope.row.CUflag === 7}"
                      >
                      </div>
                    </span>
                    <span>
                      <span>ALM</span>
                      <div
                        class="normal-lamp"
                        :class="{'alm-lamp1':scope.row.CUflag === 11}"
                      >
                      </div>
                    </span>
                  </div>
                </div>
              </template>
            </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="10" class="system-right">
        <div>
          <span class="title">系统信息</span>
          <el-row class="bg-purple-light">
            <el-col :span="8">序列号：</el-col>
            <el-col :span="16">{{serialNumber}}</el-col>
          </el-row>
          <el-row>
            <el-col :span="8">FPGA版本：</el-col>
            <el-col :span="16">{{FPGAVersion}}</el-col>
          </el-row>
          <el-row class="bg-purple-light">
            <el-col :span="8">MCMC版本：</el-col>
            <el-col :span="16">{{MCMCVersion}}</el-col>
          </el-row>
          <el-row>
            <el-col :span="8">软件版本：</el-col>
            <el-col :span="16">{{softwareVersion}}</el-col>
          </el-row>
          <el-row class="bg-purple-light">
            <el-col :span="8">当前时间：</el-col>
            <el-col :span="16">{{date}}</el-col>
          </el-row>
          <el-row>
            <el-col :span="8">运行时间：</el-col>
            <el-col :span="16">{{systemDate}}</el-col>
          </el-row>
        </div>

      </el-col>
    </el-row>

      <el-row type="flex" justify="" >
        <el-col :span="24">
            <el-row type="flex" justify="" >
                <el-col :span="12" id="chartcpu1" style="width:475px;height:300px;margin-top:30px"></el-col>
                <el-col :span="12" id="chartcpu2" style="width:600px;height:300px;margin-top:30px"></el-col>
            </el-row>
        </el-col>
      </el-row>
  </div>
</template>
<script>
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/component/title'
import 'echarts/lib/chart/pie'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/tooltip'
import idea from '../../public.js'
import AsideNav from "../../components/AsideNav";
import {mapMutations, mapState} from "vuex";
export default {
  mounted(){
    this.reload()
    // const timer=setInterval(()=>{
    //   this.getchart()
    // },1000)

  },
  beforeDestroy(){
    // if (timer) {
    //   clearInterval(timer); // 在Vue实例销毁前，清除我们的定时器
    // }
  },
  name: "home",
  components:{
    AsideNav
  },
  data () {
    return {
    tableData: [{
          CU: 'CU',
          AMC1:"AMC",
          AMC2:"AMC",
          flag1: 3,
          flag2: 3,
          CUflag: 7
        }, {
          AMC1:"AMC",
          AMC2:"AMC",
          flag1: 11,
          flag2: 7
        }, {
          AMC1:"MCH",
          AMC2:"AMC",
          flag1: 3,
          flag2: 7
        }, {
          CU: 'CU',
          AMC1:"PM",
          AMC2:"AMC",
          flag1: 1,
          flag2: 7,
          CUflag:7
        }],
    AlertDialog:false,
    ErrorDialog:false,
    NotificationDialog:false,
    DebuggingDialog:false,
    dialogTableHead:{
      time: '时间',
      level: '警告类型',
      detailedInformation: '详情'
    },
    AlertData:[],
    ErrorData:[],
    NotificationData:[],
    DebuggingData:[],
    Alert:0,
    Error:0,
    Notification:0,
    Debuging:0,
    Message:{},
    serialNumber:'219801A1EY919CQ002N',
    FPGAVersion:'Ver.B ',
    MCMCVersion:'121',
    softwareVersion:'7.1.070 Release 6126P20 ',
    cpuSubText:0+'%',
    cpuUse:[0,0,0,0,0,0,0,0,0,0,0,0],
    cpuDate:[60,'','','','','','','','','','',0],
    ramData:[{
      name:'RAM未使用',
      value:0
    },{
      name:'RAM已使用',
      value:0
    }],
    //时间
    date:'',
    systemDate:'',
    year:0,
    mon:0,
    day:0,
    hour:0,
    min:0,
    sec:0,
    systemDate2:86000
    };
  },

  computed:{
    ...mapState({
      activeTab: state => state.activeTab,
      aliveTabs: state => state.aliveTabs,
      asideWidth: state => state.asideWidth
    }),
  },

  methods: {
    ...mapMutations({
      setStateValue: 'setStateValue',
      addTabs: 'addTabs'
    }),

    reload(){
      let param = {
        url:'/cgi-bin/getslot.cgi',
        method:'post',
        bodyData:{
          ID:window.sessionStorage.getItem('userName')
        }
      }
      this.$http.requestPost(param).then((result)=>{
        // console.log(result,'yes')
        if(result.data.State=='success'){
          for(let i =0;i<result.data.Data.tableData.length;i++){
            if(result.data.Data.tableData[i].AMC1==""){
              result.data.Data.tableData[i].AMC1=' '
            }
            if(result.data.Data.tableData[i].AMC2==''){
              result.data.Data.tableData[i].AMC2=''
            }
          }
          //日志部分
          this.Alert=result.data.Data.Alert
          this.Error=result.data.Data.Error
          this.Notification=result.data.Data.Notification
          this.tableData=result.data.Data.tableData
          this.systemDate2=result.data.Data.systemDate
          this.MCMCVersion=result.data.Data.MCMCVersion
          this.serialNumber=result.data.Data.serialNumber
          this.FPGAVersion=result.data.Data.FPGAVersion
          this.softwareVersion=result.data.Data.softwareVersion
          //时间处理
          this.year=result.data.Data.year
          this.mon=result.data.Data.mon
          this.day=result.data.Data.day
          this.hour=result.data.Data.hour
          this.min=result.data.Data.min
          this.sec=result.data.Data.sec
          setInterval(()=>{
            this.time()
            this.systemTime()
          },1000)
          this.systemTime()
        }else if(result.data.State=='fail'){
          this.$message({type:'warning',message:result.data.Info});
        }else{
          this.$message({type:'warning',message:'未知错误，请联系开发人员！'})
        }
      })
    },

    getchart(){
      let param = {
        url:'/cgi-bin/getsysinf.cgi',
        method:'post'
      }
      this.$http.requestPost(param).then((result)=>{
        if(result.data.State=='success'){
          this.ramData=[{
            name:'未使用',
            value:100-Number(result.data.Data.ramUsage)
          },{
            name:'已使用',
            value:Number(result.data.Data.ramUsage)
          }]
          this.chartCPU2()
          this.chartCPU1()
          this.cpuUse.shift()
          this.cpuUse.push(Number(result.data.Data.cpuUsage))
          this.cpuSubText=Number(result.data.Data.cpuUsage)+'%'
        }else if(result.data.State=='fail'){
          this.$message({type:'warning',message:result.data.Info});
        }else{
          this.$message({type:'warning',message:'未知错误，请联系开发人员！'})
        }

      })
    },

    getSystemLog:idea.throttle(function(level){
      var dialog=level+"Dialog"
      var data = level+'Data'
      let param={
        url:'/cgi-bin/getsyslog.cgi',
        method:'post',
        bodyData:{level:level,page:-1}
      }
      this.$http.requestPost(param).then((result,level)=>{
        // console.log(result)
        this._data[data]=result.data.Data.LogData;
        this._data[dialog]=true
      })
    },1000),

    //列表合并
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (rowIndex  === 0) {
          return {
            rowspan: 6,
            colspan: 1
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0
          };
        }
      }
      if(columnIndex === 3){
        if(rowIndex === 0){
          return{
            rowspan:6,
            colspan:1
          }
        }else {
          return {
            rowspan: 0,
            colspan: 0
          };
        }
      }
    },
    //cell-style大div

    //是否在位
    twinkle(row,column,rowIndex,columnIndex){
      // console.log(row)
      // console.log(row.column)
      if(row.column.label == "AMC1"){
        if(row.row.AMC1!==" "){
          return ""
        }else{
          return "background:grey;color:grey;"
        }
      }
      if(row.column.label == "AMC2"){
        if(row.row.AMC2!==" "){
          return ""
        }else{
          return "background:grey;color:grey;"
        }
      }
    },

    //导入AsideNav方法打开日志
    moreLog(menupath){
      // AsideNav.methods.openNavTab('/SystemLog');
      let path =menupath.replace('/','');
      this.setStateValue({ name: 'activeTab', value: path })
      console.log('ccc')
      let flag = this.aliveTabs.some( (item) => { return item === path } )
      if(!flag){
        this.addTabs( path )
      }
      this.$router.push(path)
    },

    //cpu线状图
    chartCPU1(){
      let chart = document.getElementById("chartcpu1")
      let mychart = echarts.init(chart)
      let option = {
        title:{
          text: 'CPU占用率',
          subtext:this.cpuSubText,
          subtextStyle:{
            fontSize:18,
            color:"red"
          },
          textStyle:{
            fontSize : 23,
            fontWeight: 'normal ',

          }
        },
        tooltip:{
          trigger:'axis'
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: this.cpuDate
        },
        yAxis: {
            type: 'value',
            max: 100
        },
        series: [{
            data: this.cpuUse,
            type: 'line',
            areaStyle: {}
        }]
      };

      mychart.setOption(option)
    },

    //RAM饼状图
    chartCPU2(){
      let chart = document.getElementById('chartcpu2')
      let mychart = echarts.init(chart)
      let option = {
        title:{
          text:'RAM使用率',
          left:'center',
          textStyle:{
            fontSize : 23,
            fontWeight: 'normal ',
          }
        },
        series: [{
          name:"",
          type: "pie",
          label:{
            formatter: '{hr|}\n  {b|{b}：}  {per|{d}%}  ',
            backgroundColor: '#eee',
            borderColor: '#aaa',
            borderWidth: 1,
            borderRadius: 4,
            rich:{
              a: {
                  color: '#999',
                  lineHeight: 22,
                  align: 'center',
              },
              hr: {
                  borderColor: '#aaa',
                  idth: '100%',
                  borderWidth: 0.5,
                  height: 0,
                  fontSize:20
              },
              per: {
                  color: '#eee',
                  backgroundColor: '#334455',
                  padding: [2, 4],
                  borderRadius: 2,
                  fontSize:15
              },
              b:{
                fontSize:18
              }
            }
          },
          data: this.ramData
        }]
      }
      mychart.setOption(option,true)
    },

    // 刷新时间
    time(){
      this.sec = this.sec+1
      if(this.sec == 60){
        this.sec = 0
        this.min=this.min+1
      }
      if(this.min == 60){
        this.min = 0
        this.hour = this.hour+1
      }
      if(this.hour == 24){
        this.hour = 0
        this.day = this.day+1
      }
      this.date=this.year+'年'+this.mon+'月'+this.day+'日'+this.hour+'时'+this.min+'分'+this.sec+'秒'
    },
    //刷新系统时间
    systemTime(){
      let sec = this.systemDate2%60
      let min = Math.trunc((this.systemDate2/60)%60)
      let hour = Math.trunc((this.systemDate2/3600))
      let day = Math.trunc(this.systemDate2/86400)
      if( min >= 60 ){
        min = 0
      }
      if( sec >= 60 ){
        sec = 0
      }
      if(hour >= 24){
        hour = 0
      }
      this.systemDate2 = this.systemDate2+1
      this.systemDate = day+'天'+hour+'时'+min+'分'+sec+'秒'
    },



  },


}
</script>
<style>
*{
  margin: 0;
  padding: 0;
}
.el-col-2{
  margin-left: 1%;
}
.title{
  font-size: 23px;
}
.joural-box .el-col-6{
  width: 22.5%;
  border: 1px solid #ebeef5;
  margin-left: 1%;
  text-align: center;
  font-size: 20px;
}
.el-icon-warning-outline::before{
  display: inline-block;
  padding: 2px 1px 0px 1px;
}
.Alert{
  color:red
}
.Error{
  color:orange
}
.Notification{
  color:rgba(199, 199, 18, 0.5)
}
.Debuging{
  color:grey
}
.el-icon-warning-outline{
  transform: scale(2);
}
.joural{
  border: 1px solid #ebeef5;
  padding:20px 10px;
  line-height: 45px;
  width: 100%;
}
.system-information{
  margin-top:20px;
}
.system-left{
  font-size: 23px;
  background: #ECEDEF
}
.system-right{
  margin-left: 10px;
  font-size: 20px;
  background: #ECEDEF
}
.system-right span{
  display: block;
  height:42px;
  font-size: 23px;
}
.system-right .el-row{
  height: 54px;
  line-height:54px
}
.el-table__body td{
  border: 3!important;
}
.el-col-12{
  width: 49.73%;
}
.AMC1,.AMC2{
  display: flex;
  flex: 1;
  justify-content: space-between;
}
.AMC-lamp{
  width: 56px;
}
/* 设备的样式 */
.normal-lamp{
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 0.5px solid #000;
  background: #909399;
}
/* :class test */
.test{
  opacity: 1;
}
/* 闪烁 */
@keyframes twinkle {
            0%{
                opacity:.0.8;
            }
            100%{
                opacity:0;
            }
}
.poweron{
  background: green;
}
.alm-lamp1{
  background: red;
  animation: twinkle 0.5s infinite alternate;
}
.running{
  background: green;
  animation: twinkle 0.5s infinite alternate;
}
.AMC-lamp span,.normal-lamp{
  float: left;
}
.AMC-lamp span *{
  margin-top: 5px;
}
.bg-purple-light{
  background:#FFFFFF
}
.device{
  line-height: 56px;
}
.empty{
  opacity: 0;
}
.canvas{
  width: 100px;
  height: 56px;
}
</style>
