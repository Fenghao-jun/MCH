<template>
  <div class="port-management">


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
        </el-input>
        <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>

<!--        <el-button type="button">-->
<!--          <span>更新软件</span>-->
<!--        </el-button>-->
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
              <el-tooltip  placement="top">
                <div slot="content">
                  <p>接口链路状态，取值为:</p>
                  <ul>
                    <li>ADM:接口已被手工关闭。</li>
                    <li>Down:没有物理连线或者线路故障。</li>
                    <li>Up:接口未被手工关闭，物理线路通畅。</li>
                  </ul>
                </div>
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
              <el-tooltip  placement="top">
                <div slot="content">
                  <ul>
                    <li>全双工：接口在发送数据包的同时可以接收数据包；</li>
                    <li>半双工：接口同一时刻只能发送或接收数据包；</li>
<!--                    <li>自协商：本接口和对端接口自动协商来决定是工作在全双工还是半双工模式。</li>-->
                  </ul>
                </div>
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
              <el-tooltip  placement="top">
                <div slot="content">
                  <p>根据端口在转发报文时对VLAN Tag的不同处理方式，可将端口的链路类型分为三种：</p>
                  <ul>
                    <li>Access：端口只能发送一个VLAN的报文，发出去的报文不带VLAN Tag。一般用于和不能识别VLAN Tag的用户终端设备相连，或者不需要区分不同VLAN成员时使用。</li>
                    <li>Trunk：端口能发送多个VLAN的报文，发出去的端口缺省VLAN的报文不带VLAN Tag，其他VLAN的报文都必须带VLAN Tag。通常用于网络传输设备之间的互连。</li>
                    <li>Hybrid：端口能发送多个VLAN的报文，端口发出去的报文可根据需要配置某些VLAN的报文带VLAN Tag，某些VLAN的报文不带VLAN Tag。一般用于相连的网络设备或用户终端中，部分识别VLAN Tag、部分不识别VLAN Tag的情况。</li>
                  </ul>
                </div>
                <i class="el-icon-warning"></i>
              </el-tooltip>
            </div>
            <div>
              <span>PVID</span>
              <br />
              <el-input v-model="dialogData.PVID" placeholder="请输入内容"></el-input>
              <span>
                (1-4094)
                <el-tooltip placement="top">
                  <div slot="content">
                    端口缺省VLAN的编号。端口收到不带VLAN Tag的报文时，会在缺省VLAN中传输；发送缺省VLAN的报文时，Access和Trunk端口会去掉VLAN Tag再发送，Hybrid端口可配置是否去掉VLAN Tag再发送。
                    <br>Access端口的缺省VLAN就是它所在的VLAN，Trunk端口和Hybrid端口可以允许多个VLAN通过，能够配置端口缺省VLAN。
                  </div>
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
              <span>(当前:{{dialogData.RateValue}})</span>
              <br />
              <el-select v-model="dialogData.Rate" placeholder="请选择">
                <el-option
                  v-for="item in rateType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>

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
        </el-row>-->
        <el-row>
          <el-col :span="4">
            <div class="grid-content bg-purple">端口流量控制</div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple-light">
              <el-select v-model="dialogData.FlowControl" placeholder="请选择">
                <el-option
                  v-for="item in flowControl"
                  :label="item.label"
                  :value="item.value"
                  :key="item.value"
                ></el-option>
              </el-select>
              <el-tooltip  placement="top">
                <div slot="content">
                  开启流量控制功能后，如果本端设备发生拥塞，将发送消息通知对端设备暂时停止发送报文；对端设备收到该消息后将暂时停止向本端发送报文；反之亦然。用于避免报文丢失。
                  <br>
                  开启接收时流量控制功能后，当本端收到对端的流量控制报文，会停止向对端发送报文；当本端发生拥塞时，设备不能向对端发送流量控制报文。
                </div>
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
                <el-tooltip placement="top">
                  <div slot="content">
                    <p>开启该功能后，当接口上的广播流量超过抑制阈值时，系统会丢弃超出流量限制的报文，将流量降低到限定范围内，保证网络业务的正常运行。配置Mbps=速率时表示不抑制。</p>
                    <ul>
                      <li>Mbps：接口每秒允许转发的最大兆比特数，取值范围为0～接口带宽。</li>
                    </ul>
                  </div>
                  <i class="el-icon-warning"></i>
                </el-tooltip>
              </span>
              <br />

              <el-input v-model="dialogData.BroadCast" placeholder="请输入数值"></el-input> Mbps
              <br />
              <span>
                组播风暴抑制
                <el-tooltip placement="top">
                  <div slot="content">
                    <p>开启该功能后，当接口上的组播流量超过抑制阈值时，系统会丢弃超出流量限制的报文，将流量降低到限定范围内，保证网络业务的正常运行。配置Mbps=速率时表示不抑制。
                    </p>
                    <ul>
                      <li>Mbps：接口每秒允许转发的最大兆比特数，取值范围为0～接口带宽。</li>
                    </ul>
                  </div>
                  <i class="el-icon-warning"></i>
                </el-tooltip>
              </span>
              <br />
              <!-- <span>
                抑制报文类型
                <el-radio v-model="messageType" label="1">全部</el-radio>
                <el-radio v-model="messageType" label="2">未知报文</el-radio>
              </span> -->

              <el-input v-model="dialogData.MultiCast" placeholder="请输入数值"></el-input> Mbps
<!--              <span>-->
<!--                未知单播风暴抑制-->
<!--                <el-tooltip content="我是悬浮提示" placement="top">-->
<!--                  <i class="el-icon-warning"></i>-->
<!--                </el-tooltip>-->
<!--              </span>-->
<!--              <br />-->
<!--              <el-select v-model="broadCastStorm3Value" placeholder="请选择">-->
<!--                <el-option-->
<!--                  v-for="item in broadCastStorm3"-->
<!--                  :label="item.label"-->
<!--                  :value="item.value"-->
<!--                  :key="item.value"-->
<!--                ></el-option>-->
<!--              </el-select>-->
<!--              <el-input v-model="broadCastStorm3Num" placeholder="请输入数值"></el-input>-->
            </div>
          </el-col>
        </el-row>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="setPort(dialogData)">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
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
              value:"10M",
              label:"10Mbps"
              },{
              value:"100M",
              label:"100Mbps"
              },{
              value:"1000M",
              label:"1000Mbps"
              },{
              value:"AUTO_NEGOTIATION",
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
              value:"TXRX_ENABLE",
              label:"开启流量控制"
              },{
              value:"DISABLE",
              label:"关闭流量控制"
              },{
              value:"RXONLY_ENABLE",
              label:"只在接受包下开启"
              }],
        flowValue:"",
        broadCastStorm1:[{
              value:"ratio",
              label:"ratio"
              },{
              value:"pps",
              label:"pps"
              },{
              value:"Mbps",
              label:"Mbps"
              }],
        broadCastStorm1Value:"Mbps",
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
      console.log(result);
      if(result.data.State=='success'){
        this.tableData = [];
        for(let i =0 ;i<result.data.Data.PortInfo.length;i++){
          let num = result.data.Data.PortInfo[i].Interface
          result.data.Data.PortInfo[i].Interface="GE/1/0/"+num
          result.data.Data.PortInfo[i].DuplexMode == "FULL_DUPLEX"?result.data.Data.PortInfo[i].DuplexMode = "全双工":result.data.Data.PortInfo[i].DuplexMode = "半双工"
          result.data.Data.PortInfo[i].LinkStatus=='ADM'?result.data.Data.PortInfo[i].checked=true:result.data.Data.PortInfo[i].checked=false
        }
        this.hasVLAN=result.data.Data.HasVlan;
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
    let submitDate=JSON.parse(JSON.stringify(this.dialogData));
    //判断是否存在VLAN
    if(this.hasVLAN.includes(Number(submitDate.PVID))){
      submitDate.PVID = parseInt(submitDate.PVID)
      //类型为Trunk进入判断
      if(this.dialogData.LinkType == 'Trunk'){
        //判断是否为string类型，如果不是则进行split
        if(typeof(submitDate.PermitVlan)=='string'){
          let PermitVlan = submitDate.PermitVlan
          submitDate.PermitVlan = PermitVlan.split(",")
        }
        for(let i = 0; i<submitDate.PermitVlan.length;i++){
          if(!(this.hasVLAN.includes(Number(submitDate.PermitVlan[i])))){
            alert('VLAN'+submitDate.PermitVlan[i]+'不存在')
            return
          }
        }
      }
      //类型为Hybrid进入判断
      if(this.dialogData.LinkType == 'Hybrid'){
        //判断是否为string类型，如果不是则进行split
        if(typeof(submitDate.TaggedVlan)=='string'){
          let TaggedVlan = submitDate.TaggedVlan
          submitDate.TaggedVlan = TaggedVlan.split(',')
        }
        if(typeof(submitDate.UntaggedVlan)=='string'){
          let UntaggedVlan = submitDate.UntaggedVlan
          submitDate.UntaggedVlan = UntaggedVlan.split(',')
        }
        //判断TaggedVlan
        for(let i = 0; i<submitDate.TaggedVlan.length;i++){
          if(!(this.hasVLAN.includes(Number(submitDate.TaggedVlan[i])))){
            alert('VLAN'+submitDate.TaggedVlan[i]+'不存在')
            return
          }
        }
        //判断UntaggedVlan
        for(let i = 0; i<submitDate.UntaggedVlan.length;i++){
          if(!(this.hasVLAN.includes(Number(submitDate.UntaggedVlan[i])))){
            alert('VLAN'+submitDate.UntaggedVlan[i]+'不存在')
            return
          }
        }
      };
      //判断ADM
      if(submitDate.checked==true){
        console.log('ADM')
        this.dialogData.LinkStatus='ADM'
      }else{
        console.log("up")
        this.dialogData.LinkStatus='Up'
      };
      //判断端口风暴抑制是否超出范围,不等大于rate
      const range = parseInt(submitDate.Rate);
        //判断广播风暴数值是否合法
      if(this.dialogData.BroadCast>range || !idea.isInt(+submitDate.BroadCast)){
        this.$message({type:'warning',message:`请输入小于${range}的整数`})
        return
      }else{
        this.dialogData.BroadCast= +this.dialogData.BroadCast;
      }
        //判断组团风暴数值是否合法
      if(this.dialogData.MultiCast>range || !idea.isInt(+submitDate.MultiCast)){
        this.$message({type:'warning',message:`请输入小于${range}的整数`})
        return
      }else {
        submitDate.MultiCast = +submitDate.MultiCast;
      }
      //转换为后端需要的数据
      if(this.dialogData.DuplexMode =="半双工") {
        submitDate.DuplexMode = "HALF_DUPLEX"
      }
      else if(this.dialogData.DuplexMode == "全双工") {
        submitDate.DuplexMode = "FULL_DUPLEX"
      }
      if(this.dialogData.RateValue=='自协商'){
        submitDate.RateValue='AUTO_NEGOTIATION'
      }
      let param ={
      url: '/cgi-bin/setport.cgi',
      method: 'post',
      bodyData: submitDate
      };
      console.log(param)
      this.$http.requestPost(param).then((result)=>{
      console.log(result.data)
      if(result.data.State == "success"){
        this.reload()
        this.dialogVisible = false
        this.$message({type:'success',message:'设置成功'})
      }else{
        this.$message({
          showClose: true,
          message: '设置失败',
          type: 'error'
        })
      }
    })
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
    this.dialogData = JSON.parse(JSON.stringify(event))

    //判断速率是否自协商
    if(this.dialogData.RateValue == "UN_NEGOTIATION"){
      if(this.dialogData.Rate == "1000M"){
        this.dialogData.RateValue = "1000Mbps"
      }else if(this.dialogData.Rate == "100M"){
        this.dialogData.RateValue = "100Mbps"
      }else if(this.dialogData.Rate == "10M"){
        this.dialogData.RateValue = "10Mbps"
      }
    }else{
      this.dialogData.RateValue = "自协商"
    }
    console.warn(this.dialogData)

    this.dialogVisible = true
  },

  changLinkStatus(){
    console.log(this.dialogData.checked)
    this.dialogData.checked==true?this.dialogData.checked=false:this.dialogData.checked=true;
  },




},

}
</script>
<style  scoped>
ul{
  margin-left: 15px;
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
  /*height: 80px;*/
  /*line-height: 80px;*/
  text-align: center;
  /*border-top: 2px solid #ebeef5;*/
  padding: 1% 0;
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
