<template>
  <div class="port-management">
    <div class="port-head">
      <div class="head-text">
        <span>接口</span>
      </div>
      <!-- <div class="head-button">
        <el-button type="primary" plain>面板</el-button>
        <el-button type="primary" plain>流量统计</el-button>
      </div>-->
    </div>

    <!-- 搜索容器 -->
    <div class="select-container">
      <div class="left-container">
        <!-- <el-select v-model="value">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select> -->

        <!-- 搜索框 -->
        <el-input
          class="el-input"
          placeholder="搜索"
          v-model="searchData"
          clearable
          @keyup.enter.native="search"
          @clear="reload"
        >
          <i slot="suffix" class="el-input__icon el-icon-search" @click="search"></i>
        </el-input>
        <!-- 筛选 -->
      </div>
      <!-- right -->
      <div class="right-container">
        <el-button icon="el-icon-refresh" @click="reload"></el-button>
      </div>
    </div>
    <!-- 显示表单 -->
    <div class="port-table">
      <el-table
        :data="tableData"
        border
        :max-height="tableHeight"
        @row-click="openDialog"
        >

          <el-table-column
            type="index"
            width="55"
            label="序号">
          </el-table-column>

          <!-- <el-table-column
            v-for="(value, key) in tableHead"
            :key="key"
            :prop="key"
            :label="value"
            min-width="300">
          </el-table-column> -->


          <el-table-column
            prop="Interface"
            label="接口"
            min-width="150">
          </el-table-column>

          <el-table-column
            prop="LinkStatus"
            label="链路状态"
            min-width="150">
          </el-table-column>

          <el-table-column
            prop="IpAddress"
            label="IP地址"
            min-width="150">
          </el-table-column>

          <el-table-column
            prop="Rate"
            label="速率(Mbps)"
            min-width="150">
          </el-table-column>

          <el-table-column
            prop="DuplexMode"
            label="双工模式"
            min-width="150">
          </el-table-column>

          <el-table-column
            prop="Description"
            label="描述"
            min-width="300">
          </el-table-column>
      </el-table>



      <!-- 弹窗 -->
      <el-dialog
        title="修改接口配置"
        :visible.sync="dialogVisible"
        width="60%"
        top="0">
        <el-row>
          <el-col :span="4">
            <div class="grid-content bg-purple">接口</div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple-light">{{dialogData.Interface}}</div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">
            <div class="grid-content bg-purple">
              链路状态
              <el-tooltip content="我是悬浮提示" placement="top">
                <i class="el-icon-warning"></i>
              </el-tooltip>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple-light">
              <el-button
                :type="dialogData.LinkStatus == ('Down'||'ADM') ? 'danger' : 'success' "
                disabled
              >{{dialogData.LinkStatus}}</el-button>
              <el-checkbox v-model="dialogData.checked" @click="changLinkStatus()">关闭</el-checkbox>
            </div>

          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">
            <div class="grid-content bg-purple">
              <span>描述</span>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple-light">
              <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4}"
                v-model="dialogData.Description"
              ></el-input>
            </div>
          </el-col>
          <el-col :span="4">
            <span>(1-255字符)</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">
            <div class="grid-content bg-purple">
              <span>MAC地址</span>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple-light">
              <el-input v-model="dialogData.MACAddress" readonly></el-input>
              <span>(XX-XX-XX-XX-XX-XX)</span>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">
            <div class="grid-content bg-purple">双工模式</div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple-light">
              <span>(当前:{{dialogData.DuplexMode}})</span>
              <br />
              <el-select v-model="dialogData.DuplexMode" placeholder="请选择">
                <el-option
                  v-for="item in DuplexModeType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              <el-tooltip content="我是悬浮提示" placement="top">
                <i class="el-icon-warning"></i>
              </el-tooltip>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">
            <div class="grid-content bg-purple">
              <span>VLAN相关参数</span>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple-light">
              <span>链路类型</span>
              <br />
              <el-select v-model="dialogData.LinkType" placeholder="请选择">
                <el-option
                  v-for="item in type"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              <el-tooltip content="我是悬浮提示" placement="top">
                <i class="el-icon-warning"></i>
              </el-tooltip>
            </div>
            <div>
              <span>PVID</span>
              <br />
              <el-input v-model="dialogData.PVID" placeholder="请输入内容"></el-input>
              <span>
                (1-4094)
                <el-tooltip content="我是悬浮提示" placement="top">
                  <i class="el-icon-warning"></i>
                </el-tooltip>
              </span>
            </div>
            <div v-if="dialogData.LinkType == 'Hybrid'">
              <span>Untagged VLAN列表</span>
              <br>
              <el-input v-model="dialogData.UntaggedVlan"></el-input>
              <span>（1-4094，取值示例：3,5,10-100）</span>
              <br>
              <span>Tagged VLAN列表</span>
              <br>
              <el-input v-model="dialogData.TaggedVlan"></el-input>
            </div>
            <div v-if="dialogData.LinkType == 'Trunk'">
              <span>Permit VLAN列表</span>
              <br>
              <el-input v-model="dialogData.PermitVlan"></el-input>
              <span>（1-4094，取值示例：3,5,10-100）</span>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">
            <div class="grid-content bg-purple">速率</div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple-light">
              <span>(当前:{{rateValue}})</span>
              <br />
              <el-select v-model="rateValue" placeholder="请选择">
                <el-option
                  v-for="item in rateType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              <el-tooltip content="我是悬浮提示" placement="top">
                <i class="el-icon-warning"></i>
              </el-tooltip>
            </div>
          </el-col>
        </el-row>
        <!-- <el-row>
          <el-col :span="4">
            <div class="grid-content bg-purple">
              允许超长帧通过
              <el-tooltip content="我是悬浮提示" placement="top">
                <i class="el-icon-warning"></i>
              </el-tooltip>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple-light">
              <el-radio v-model="jumboFrame" label="1">不允许</el-radio>
              <el-radio v-model="jumboFrame" label="2">
                <el-input :disabled="jumboFrame == '2' ? false:true" v-model="jumboFrameValue"></el-input>
              </el-radio>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">
            <div class="grid-content bg-purple">BPDU报文拦截</div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple-light">
              <el-checkbox v-model="BPDU">开启BPDU报文拦截</el-checkbox>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">
            <div class="grid-content bg-purple">EEE功能</div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple-light">
              <el-checkbox v-model="EEE">开启EEE功能</el-checkbox>
              <el-tooltip content="我是悬浮提示" placement="top">
                <i class="el-icon-warning"></i>
              </el-tooltip>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">
            <div class="grid-content bg-purple">端口流量控制</div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple-light">
              <el-select v-model="flowValue" placeholder="请选择">
                <el-option
                  v-for="item in flowControl"
                  :label="item.label"
                  :value="item.value"
                  :key="item.value"
                ></el-option>
              </el-select>
              <el-tooltip content="我是悬浮提示" placement="top">
                <i class="el-icon-warning"></i>
              </el-tooltip>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">
            <div class="grid-content bg-purple">端口风暴抑制</div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple-light">
              <span>
                广播风暴抑制
                <el-tooltip content="我是悬浮提示" placement="top">
                  <i class="el-icon-warning"></i>
                </el-tooltip>
              </span>
              <br />
              <el-select v-model="broadCastStorm1Value" placeholder="请选择">
                <el-option
                  v-for="item in broadCastStorm1"
                  :label="item.label"
                  :value="item.value"
                  :key="item.value"
                ></el-option>
              </el-select>
              <el-input v-model="broadCastStorm1Num" placeholder="请输入数值"></el-input>
              <br />
              <span>
                组播风暴抑制
                <el-tooltip content="我是悬浮提示" placement="top">
                  <i class="el-icon-warning"></i>
                </el-tooltip>
              </span>
              <br />
              <span>
                抑制报文类型
                <el-radio v-model="messageType" label="1">全部</el-radio>
                <el-radio v-model="messageType" label="2">未知报文</el-radio>
              </span>
              <br />
              <el-select v-model="broadCastStorm2Value" placeholder="请选择">
                <el-option
                  v-for="item in broadCastStorm2"
                  :label="item.label"
                  :value="item.value"
                  :key="item.value"
                ></el-option>
              </el-select>
              <el-input v-model="broadCastStorm2Num" placeholder="请输入数值"></el-input>
              <br />
              <span>
                未知单播风暴抑制
                <el-tooltip content="我是悬浮提示" placement="top">
                  <i class="el-icon-warning"></i>
                </el-tooltip>
              </span>
              <br />
              <el-select v-model="broadCastStorm3Value" placeholder="请选择">
                <el-option
                  v-for="item in broadCastStorm3"
                  :label="item.label"
                  :value="item.value"
                  :key="item.value"
                ></el-option>
              </el-select>
              <el-input v-model="broadCastStorm3Num" placeholder="请输入数值"></el-input>
            </div>
          </el-col>
        </el-row> -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="setPort(dialogData)">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import idea from '../../public.js';
export default {
  //生命周期 - 挂载完成（可以访问DOM元素）
mounted() {
  this.reload()
},
activated(){
  this.reload()
},
name:"PortManagement",
//import引入的组件需要注入到对象中才能使用
data() {
//这里存放数据
  return {
  //接口选择器
        options: [{
          value: '选项1',
          label: '所有接口'
        }, {
          value: '选项2',
          label: '接口A'
        }, {
          value: '选项3',
          label: '接口B'
        }],
        value:"选项1",
        //搜索内容
        searchData:"",
        tableHead:{
          Interface:"接口",
          LinkStatus:"链路状态",
          IpAddress:"IP地址",
          Rate:"速率(Mbps)",
          DuplexMode:"双工模式",
          Description:"描述"
        },
        data:[],
        tableData:[],
        tableHeight:"680",
        currentPage:1,
        totalNum:100,
        pageSize:5,
        //弹窗
        dialogVisible: false,
        dialogData:[],
        type:[{
               value:"Access",
               label:"Access"
               },{
               value:"Trunk",
               label:"Trunk"
               },{
               value:"Hybrid",
               label:"Hybrid"
               }],
        PVID:"",
        DuplexModeType:[{
          value:'全双工',
          label:'全双工'
        },{
          value:'半双工',
          label:'半双工'
        }],
        rateType:[{
              value:"10Mbps",
              label:"10Mbps"
              },{
              value:"100Mbps",
              label:"100Mbps"
              },{
              value:"1Gbps",
              label:"1Gbps"
              },{
              value:"自协商",
              label:"自协商"
              }],
        rateValue:"自协商",
        workTypeRadio:"1",
        jumboFrame:"1",
        jumboFrameValue:"",
        down:false,
        BPDU:false,
        EEE:false,
        flowControl:[{
              value:"选项1",
              label:"开启流量控制"
              },{
              value:"选项2",
              label:"关闭流量控制"
              },{
              value:"选项3",
              label:"只在接受包下开启"
              }],
        flowValue:"",
        broadCastStorm1:[{
              value:"选项1",
              label:"ratio"
              },{
              value:"选项2",
              label:"pps"
              },{
              value:"选项3",
              label:"Kbps"
              }],
        broadCastStorm1Value:"",
        broadCastStorm1Num:"100",
        broadCastStorm2:[{
              value:"选项1",
              label:"ratio"
              },{
              value:"选项2",
              label:"pps"
              },{
              value:"选项3",
              label:"Kbps"
              }],
        broadCastStorm2Value:"",
        broadCastStorm2Num:"",
        broadCastStorm3:[{
              value:"选项1",
              label:"ratio"
              },{
              value:"选项2",
              label:"pps"
              },{
              value:"选项3",
              label:"Kbps"
              }],
        broadCastStorm3Value:"",
        broadCastStorm3Num:"",
        messageType:"1",
        hasVLAN:[],

  };
},

//方法集合
methods: {
  //获取数据
  reload:idea.throttle(function(){
    let param = {
      url: '/cgi-bin/getport.cgi',
      method: 'post',
      bodyData: {
        ID:window.sessionStorage.getItem('userName')
      }
    }
    this.$http.requestPost(param).then((result) => {
      // console.log(result);
      if(result.data.State=='success'){
        this.tableData = [];
        for(let i =0 ;i<result.data.Data.PortInfo.length;i++){
          let num = result.data.Data.PortInfo[i].Interface
          result.data.Data.PortInfo[i].Interface="GE/1/0/"+num
          result.data.Data.PortInfo[i].DuplexMode == "FULL_DUPLEX"?result.data.Data.PortInfo[i].DuplexMode = "全双工":result.data.Data.PortInfo[i].DuplexMode = "半双工"
          result.data.Data.PortInfo[i].LinkStatus=='ADM'?result.data.Data.PortInfo[i].checked=true:result.data.Data.PortInfo[i].checked=false
        }
        this.hasVLAN=result.data.Data.hasVLAN;
        this.tableData=result.data.Data.PortInfo;
      }else if(result.data.State=='fail'){
        this.$message({type:'warning',message:result.data.Info});
      }else{
        this.$message({type:'warning',message:'未知错误，请联系开发人员！'})
      }
      // console.log(this.tableData)
    })
  }),

  //设置
  setPort(){
    //判断是否存在VLAN
    if(this.hasVLAN.includes(Number(this.dialogData.PVID))){
      if(this.dialogData.DuplexMode =="半双工")
      {this.dialogData.DuplexMode = "HALF_DUPLEX"}
      else if(this.dialogData.DuplexMode == "全双工")
      {this.dialogData.DuplexMode = "FULL_DUPLEX"}
      this.dialogData.PVID = parseInt(this.dialogData.PVID)
      //类型为Trunk进入判断
      if(this.dialogData.LinkType == 'Trunk'){
        //判断是否为string类型，如果不是则进行split
        if(typeof(this.dialogData.PermitVlan)=='string'){
          let PermitVlan = this.dialogData.PermitVlan
          this.dialogData.PermitVlan = PermitVlan.split(",")
        }
        for(let i = 0; i<this.dialogData.PermitVlan.length;i++){
          if(!(this.hasVLAN.includes(Number(this.dialogData.PermitVlan[i])))){
            alert('VLAN'+this.dialogData.PermitVlan[i]+'不存在')
            return
          }
        }
      }
      //类型为Hybrid进入判断
      if(this.dialogData.LinkType == 'Hybrid'){
        //判断是否为string类型，如果不是则进行split
        if(typeof(this.dialogData.TaggedVlan)=='string'){
          let TaggedVlan = this.dialogData.TaggedVlan
          this.dialogData.TaggedVlan = TaggedVlan.split(',')
        }
        if(typeof(this.dialogData.UntaggedVlan)=='string'){
          let UntaggedVlan = this.dialogData.UntaggedVlan
          this.dialogData.UntaggedVlan = UntaggedVlan.split(',')
        }
        //判断TaggedVlan
        for(let i = 0; i<this.dialogData.TaggedVlan.length;i++){
          if(!(this.hasVLAN.includes(Number(this.dialogData.TaggedVlan[i])))){
            alert('VLAN'+this.dialogData.TaggedVlan[i]+'不存在')
            return
          }
        }
        //判断UntaggedVlan
        for(let i = 0; i<this.dialogData.UntaggedVlan.length;i++){
          if(!(this.hasVLAN.includes(Number(this.dialogData.UntaggedVlan[i])))){
            alert('VLAN'+this.dialogData.UntaggedVlan[i]+'不存在')
            return
          }
        }
      };
      //判断ADM
      if(this.dialogData.checked==true){
        console.log('ADM')
        this.dialogData.LinkStatus='ADM'
      }else{
        console.log("up")
        this.dialogData.LinkStatus='Up'
      };
      let param ={
      url: '/cgi-bin/setport.cgi',
      method: 'post',
      bodyData: this.dialogData
      };
      console.log(param)
      this.$http.requestPost(param).then((result)=>{
      console.log(result.data)
      if(result.data.State == "success"){
        this.reload()
      }else{
        this.$message({
          showClose: true,
          message: '设置失败',
          type: 'error'
        })
      }
    })
      this.dialogVisible = false
    }else{
      this.$message({
        showClose: true,
        message: 'VLAN不存在',
        type: 'error'
      })
    }

  },
  //制作假表格
  createData(){
    let i = 0
    while(i<16){
      let item = {
        Interface:"GE/1/0/",
        LinkStatus:"Up",
        IpAddress:"192.168.0.",
        PVID:"0"
      }
      item.Interface = item.Interface + i
      item.IpAddress = item.IpAddress + i
      item.Description = "GigabitEthermet1/0/"+i+"Interface"
      this.tableData.push(item)
      i++
    }
  },
  //搜索数据
  search(){
    //过滤得到满足条件的展示数据data
    this.tableData = this.tableData.filter((item,index)=>{
      return  item.Interface.includes(this.searchData)
    })
  },

  //对话框
  openDialog(event){
    this.dialogData = event
    //判断速率是否自协商
    if(this.dialogData.RateValue == "UN_NEGOTIATION"){
      if(this.dialogData.Rate == "1000M"){
        this.rateValue = "1Gbps"
      }else if(this.dialogData.Rate == "100M"){
        this.rateValue = "100Mbps"
      }else if(this.dialogData.Rate == "10M"){
        this.rateValue = "10Mbps"
      }
    }else{
        this.rateValue = "自协商"
    }
    console.warn(this.dialogData)
    this.dialogVisible = true
  },
  changLinkStatus(){
    console.log(this.dialogData.checked)
    this.dialogData.checked==true?this.dialogData.checked=false:this.dialogData.checked=true;
  }

},

}
</script>
<style  scoped>
/* 设置头部 */
.port-head {
  display: flex;
  flex: 1;
  justify-content: space-between;
}
.head-text {
  height: 40px;
  line-height: 40px;
  text-align: center;
  font-size: 22px;
}

/* 搜索 */
.select-container {
  display: flex;
  flex: 1;
  justify-content: space-between;
}
.el-input {
  margin-left: 15px;
  width: 350px;
}
.select-container {
  height: 80px;
  line-height: 80px;
  margin-top: 10px;
  border-top: 2px solid #ebeef5;
  border-bottom: 2px solid #ebeef5;
}
.left-container {
  width: 500px;
  display: flex;
  flex: 1;
}
/* dialog */
.el-dialog__body * {
  margin-left: 0px;
}
.port-management > .el-row {
  margin-top: 15px !important;
}
</style>
