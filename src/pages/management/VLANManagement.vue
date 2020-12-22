<template>
  <div class="VLANManagement">
    <div class="port-head">
      <div class="head-text">
        <span>VLAN</span>
      </div>
      <div class="head-button">
        <el-button @click="helpDialog = true" ><i class="el-icon-notebook-1" title="帮助"></i></el-button>
        <el-dialog title="VLAN联机帮助"
                   :visible.sync="helpDialog"
                   width="50%">
            <div class="help">
              <h2>VLAN简介</h2>
                <p class="help-text">
                  VLAN（Virtual Local Area Network，虚拟局域网）技术可以把一个物理LAN划分成多个逻辑的LAN——VLAN，每个VLAN是一个广播域。处于同一VLAN的主机能够直接互通，而处于不同VLAN的主机不能够直接互通。
                </p>
              <h3>基于端口划分VLAN</h3>
                <p class="help-text">
                  VLAN可以基于端口进行划分。它按照设备端口来定义VLAN成员，将指定端口加入到指定VLAN中之后，端口就可以转发该VLAN的报文。
                </p>
                <span class="help-text">在某VLAN内，可根据需要配置端口加入Untagged端口列表或Tagged端口列表：</span>
                <ul class="help-ul">
                  <li>配置端口为Untagged端口，从Untagged端口发出的该VLAN报文不带VLAN Tag。</li>
                  <li>配置端口为Tagged端口，从Tagged端口发出的该VLAN报文带VLAN Tag。</li>
                </ul>
                <span class="help-text">端口的链路类型分为三种。在端口加入某VLAN时，对不同链路类型的端口加入的端口列表要求不同：</span>
                <ul class="help-ul" >
                  <li>Access：端口只能发送一个VLAN的报文，发出去的报文不带VLAN Tag。该端口只能加入一个VLAN的Untagged端口列表。</li>
                  <li>Trunk：端口能发送多个VLAN的报文，发出去的端口缺省VLAN的报文不带VLAN Tag，其他VLAN的报文都必须带VLAN Tag。在端口缺省VLAN中，该端口只能加入Untagged端口列表；在其他VLAN中，该端口只能加入Tagged端口列表。</li>
                  <li>Hybrid：端口能发送多个VLAN的报文，端口发出去的报文可根据需要配置某些VLAN的报文带VLAN Tag，某些VLAN的报文不带VLAN Tag。在不同VLAN中，该端口可以根据需要加入Untagged端口列表或Tagged端口列表。</li>
                </ul>
                <h3>VLAN接口</h3>
                <p class="help-text">不同VLAN间的主机不能直接通信，通过设备上的VLAN接口，可以实现VLAN间的三层互通。VLAN接口是一种三层的虚拟接口，它不作为物理实体存在于设备上。每个VLAN对应一个VLAN接口，VLAN接口的IP地址可作为本VLAN内网络设备的网关地址，对需要跨网段的报文进行基于IP地址的三层转发。</p>
                <h2>注意事项</h2>
                <p class="help-text">VLAN 1为系统缺省VLAN，用户不能手工创建和删除。</p>
            </div>
          <span slot="footer"
                class="dialog-footer">
            <el-button @click="helpDialog = false">取 消</el-button>
            <el-button type="primary"
                       @click="helpDialog = false">确 定</el-button>
          </span>
        </el-dialog>
      </div>
    </div>

    <div class="select-container">
      <div class="left-container">
        <el-input
            class="el-input"
            placeholder="搜索"
            v-model="searchData"
            clearable
          >
          <i slot="suffix" class="el-icon-search"></i>
          </el-input>
      </div>
      <div class="right-container">
        <el-button @click="reload" title="刷新"><i class="el-icon-refresh" ></i></el-button>
        <el-button @click="deleteVLAN($event)"><i class="el-icon-delete"></i></el-button>
        <el-button @click="add" title="添加VLAN"><i class="el-icon-plus" ></i></el-button>
      </div>
    </div>

    <div class="VLANtable">
      <el-table
        :data="tableData"
        row-key="id"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        :max-height="tableHeight"
      >
      <!-- @row-click="openDialog" -->

        <el-table-column
          prop="VLAN"
          label="VLAN"
          min-width="90"
          >
        <template slot-scope="scope" >
          <el-checkbox
           :class="{'checkbox':scope.row.VLAN == 1 || typeof(scope.row.id)=='string'}"
           @change="getDeleteData($event,scope)"
           style="float:left"
           >
          </el-checkbox>
          <span >{{scope.row.VLAN}}</span>
        </template>

        </el-table-column>
        <el-table-column
          prop="InterFace"
          label="接口"
          min-width="250"
          >
        </el-table-column>

        <el-table-column
          prop="LinkType"
          label="链路类型"
          min-width="250"
          >
        </el-table-column>
        <el-table-column
          prop="VLANport"
          label="VLAN接口IP地址"
          min-width="215"
          >
        </el-table-column>
        <el-table-column
          prop="Description"
          label="描述"
          min-width="125"
          >
        </el-table-column>
      </el-table>
    </div>
  </div>


</template>
<script>
import idea from"../../public.js"
export default {
  mounted() {
    // this.createData()
    this.reload()
  },
  name: "VALNManagement",
  data () {
    return {
      searchData:"",
      tableData:[],
      tableHeight:"680",
      dialogData:[],
      check:false,
      radio:"1",
      helpDialog : false,
      //接收删除VLAN
      deleteData:[],
      //接收已有VLAN
      hasVLAN:[],
      test:true,
    };
  },
  methods: {
    //获取数据
    //节流处理
    reload: idea.throttle(function(e){
      let param = {
        url: '/cgi-bin/getvlan.cgi',
        method:'post',
        bodyData:{
          ID:window.sessionStorage.getItem('userName')
        }
      }
      this.$http.requestPost(param).then((result) => {
        this.tableData = []
        this.hasVLAN = []
        console.log(result)
        // console.log(result.data.Data.VlanInfo)
        for(let i =0;i<result.data.Data.VlanInfo.length;i++){
          result.data.Data.VlanInfo[i].InterFace=result.data.Data.VlanInfo[i].children.length
          this.hasVLAN.push(result.data.Data.VlanInfo[i].VLAN)
          for(let j = 0; j<result.data.Data.VlanInfo[i].children.length; j++){
            // console.log(result.data.Data.VlanInfo[0].children[j])
            let num =result.data.Data.VlanInfo[i].children[j].InterFace
            result.data.Data.VlanInfo[i].children[j].InterFace = 'GE/1/0/'+num
          }
        }
        this.tableData=result.data.Data.VlanInfo;
        console.log(this.hasVLAN)
        console.log(this.tableData)
      })
    },1000),
    //发送添加的VLAN
    sendAdd(VLAN){
      let param = {
        url:'/cgi-bin/setvlan.cgi',
        // data:JSON.stringify(dialogData),
        // data:dialogData,
        method: 'post',
        bodyData: VLAN
      }
      console.log(param)
      // this.dialogVisible = false
      this.$http.requestPost(param).then((result)=>{
        // console.log(result.data)
        if(result.data.State == "success"){
          this.reload()
        }else if(result.data.State=='fail'){
          this.$message({type:'warning',message:result.data.Info});
        }else{
          this.$message({type:'warning',message:'未知错误，请联系开发人员！'})
        }
        // this.dialogVisible=false
      })
    },
    //删除VLAN
    deleteVLAN(event)  {
      const data=JSON.parse(JSON.stringify(this.deleteData))
      delete data.id
      let param = {
        url:'/cgi-bin/setvlan.cgi',
        method: 'post',
        bodyData: data
      }
      this.$set(param.bodyData,'Action',0)
      this.$http.requestPost(param).then((result)=>{
        if(result.data.State == "success"){
          this.reload()
        }else if(result.data.State=='fail'){
          this.$message({type:'warning',message:result.data.Info});
        }else{
          this.$message({type:'warning',message:'未知错误，请联系开发人员！'})
        }
      })
    },

    //制造假数据列表
    createData(){
      let i = 0
      let c = 0
      while(i<4){
        let item = {
          id:i+1,
          VLAN:i+1,
          VLANport:"192.168.0.233/255.255.255.0",
          Description:"VLAN001",
          InterFace:"3",
          children:[{
            id:i+1+"1",
            InterFace:'GE/1/0/1',
            LinkType:'Access'
          },{
            id:i+1+'2',
            InterFace:'GE/1/0/2',
            LinkType:'Hybrid'
          },{
            id:i+1+'3',
            InterFace:'GE/1/0/3',
            LinkType:'Trunk'
          }],
        }
        this.tableData.push(item)
        i++
      }
      console.log(this.tableData)
    },
    //搜索功能
    search(){
      //过滤得到满足条件的展示数据data
      this.tableData = this.data.filter((item,index)=>{
        return  item.Interface.includes (this.searchData)
      })
    },
    //添加VLAN
    add(){
      this.$prompt('请输入VLAN','创建',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        // inputPattern:/[1-9]([0-9]{5,11})/,
        // inpitErrorMessage: 'VLAN超出范围'
      }).then(({value})=>{
        //先行判断是否已存在VLAN
        if(this.hasVLAN.includes(Number(value))){
          this.$message({
            type:'warning',
            message:"VLAN已存在"
          })
        }else{
          let item = {
            VLAN:Number(value),
            Action:1
          }
          this.tableData.push(item)
          this.sendAdd(item)
        }
      }).catch(()=>{
        this.$message({
          type:'info',
          message:'取消输入'
        })
      })
    },
    getDeleteData(event,scope){
      // console.log(scope)
      this.deleteData=scope.row
      // console.log(this.deleteData)
    },
    show(scope){
      console.log(scope)
    }
  }

}
</script>
<style>
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
  .help-text{
    margin-left: 20px;
  }
  .help-ul{
    margin-left: 35px;
  }
  /* 搜索容器 */
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
  .el-col-16>.el-input,.VLANbox>.el-input{
    width: 350px;
    height: 45px;
  }
  .right-container{
    margin-left: 10px;
  }
  .VLANManagement>.el-row{
    margin-top: 15px;
  }
  .VLANbox{
    margin-top: 10px;
  }
  .checkbox{
    display: none !important;
  }
</style>
