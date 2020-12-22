<template>
  <div>
    <div class="port-head">
      <div class="head-text">
        <span>电源管理</span>
      </div>
      <div class="head-button">
        <el-button icon="el-icon-refresh"></el-button>
        <!-- <el-button type="primary" plain>流量统计</el-button> -->
      </div>
    </div>



    <div class="power-table">
      <el-table
        :data="tableData"
        border
        :max-height="tableHeight"
        @row-click="openDialog"
        >

        <!-- <el-table-column
          type="index"
          label="序号"
          width="55">
        </el-table-column> -->
        <el-table-column
          prop="SlotNumber"
          label="槽位"
          min-width="60">

        </el-table-column>

        <el-table-column
          prop="Interface"
          label="插槽"
          min-width="200">
        </el-table-column>

        <el-table-column
          prop="Status"
          label="状态"
          :filters="filtersData"
          :filter-method="filterHandler"
          min-width="200">
        </el-table-column>

        <el-table-column
          prop="Temperature"
          label="温度"
          sortable
          min-width="200"
          >
        </el-table-column>

        <el-table-column
          prop="Description"
          label="描述"
          min-width="500">
        </el-table-column>
      </el-table>
       <el-dialog
        title="电源管理"
        :visible.sync="dialogVisible"
        width="30%">

          <el-row>
            <el-col :span="8"><span>插槽</span></el-col>
            <el-col :span="8">{{dialogData.Interface}}</el-col>
          </el-row>
          <el-row>
            <el-col :span="8"><span>状态</span></el-col>
            <el-col :span="8">
              <template>
                  <el-select v-model="dialogData.Status" >
                    <el-option
                      label="上电"
                      value="上电">
                    </el-option>
                    <el-option
                      label="下电"
                      value="下电">
                    </el-option>
                  </el-select>
              </template>
            </el-col>
          </el-row>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="setPower">确 定</el-button>
          </span>
      </el-dialog>

    </div>
  </div>
</template>
<script>
export default {
  mounted(){
    // this.createData()
    // this.createData2()
    // this.createData3()
    // this.createData4()
    // this.show()
    this.reload()
    // this.show()
  },
  name: "PowerManagement",
  data () {
    return {
      /* 表单 */
      tableHeight:"650",
      tableData:[],
      //对话框
      dialogVisible:false,
      dialogData:[],
      /* 槽位状态*/
      filtersData:[{
        text:"上电",
        value:"上电"
      },{
        text:"下电",
        value:"下电"
      },{
        text:"在位",
        value:"在位"
      },],
      test:1
    };
  },
  methods: {
  reload(){
    let param = {
      url:'/cgi-bin/getpower.cgi',
      method:'post',
      bodyData:{
        ID:window.sessionStorage.getItem('userName')
      }
    }
    this.$http.requestPost(param).then((result)=>{
      if(result.data.State=='success'){
        for(let i=0;i<result.data.Data.SlotInfo.length;i++){
          if(result.data.Data.SlotInfo[i].Status == 3 || result.data.Data.SlotInfo[i].Status == 7){
            result.data.Data.SlotInfo[i].Status = '上电';
          }else if(result.data.Data.SlotInfo[i].Status == 1){
            result.data.Data.SlotInfo[i].Status = '在位';
          }
          result.data.Data.SlotInfo[i].Temperature = result.data.Data.SlotInfo[i].Temperature+'℃';
        }
        this.tableData=result.data.Data.SlotInfo;
      }else if(result.data.State=='fail'){
        this.$message({type:'warning',message:result.data.Info});
      }else{
        this.$message({type:'warning',message:'未知错误，请联系开发人员！'})
      };

      // console.log(this.tableData)
    })
  },

  setPower(){
    let data = JSON.parse(JSON.stringify(this.dialogData))
    if(this.dialogData.Status == "上电"){
      data.Status=3
    }else if(this.dialogData.Status == "下电" ){
      data.Status=1
    }
    console.log(data)
    console.log(this.dialogData)
    let param = {
      url:'/cgi-bin/setpower.cgi',
      method: 'post',
      bodyData: data
    }
    this.$http.requestPost(param).then((result)=>{
      if(result.data.State=='success'){
        this.reload();
      }else if(result.data.State=='fail'){
        this.$message({type:'warning',message:result.data.Info});
      }else{
        this.$message({type:'warning',message:'未知错误，请联系开发人员！'})
      }
    })
    this.dialogVisible = false
  },
  //搜索数据
  search(){
    //过滤得到满足条件的展示数据data
    this.tableData = this.data.filter((item,index)=>{
      return  item.Interface.includes (this.searchData)
    })
  },
  //都是假数据啊
  createData(){
    let i = 0
    while(i<2){
      let item = {
        Interface:"CU",
        Temperature:"70.6℃",
        Status:"上电",
        SlotNumber:i
      }
      item.Interface = item.Interface + i
      item.Description = "GigabitEthermet1/0/"+i+"Interface"
      this.tableData.push(item)
      i++
    }
  },

  createData2(){
    let i = 0
    while(i<5){
      let item = {
        Interface:"AMC",
        Temperature:"70.8℃",
        Status:"下电"
      }
      item.Interface = item.Interface + i
      item.Description = "GigabitEthermet1/0/"+i+"Interface"
      this.tableData.push(item)
      i++
    }
  },

  createData3(){
    let i = 0
    while(i<1){
      let item = {
        Interface:"MCH",
        Temperature:"70.9℃",
        Status:"不在位"
      }
      item.Interface = item.Interface + i
      item.Description = "GigabitEthermet1/0/"+i+"Interface"
      this.tableData.push(item)
      i++
    }
  },

  createData4(){
    let i = 0
    while(i<1){
      let item = {
        Interface:"PM",
        Temperature:"72.0℃",
        Status:"在位"
      }
      item.Interface = item.Interface + i
      item.Description = "GigabitEthermet1/0/"+i+"Interface"
      this.tableData.push(item)
      i++
    }
  },
  /* 筛选 */
  filterHandler(value, row, column) {
    const property = column['property'];
    return row[property] === value;
  },

  //设置上下电
  openDialog(row,column,event){
    if(event.Status == "不在位"){
      this.warning()
    }else{
      this.dialogVisible=true
      // this.dialogData=row
      this.dialogData = JSON.parse(JSON.stringify(row))
      console.log(this.dialogData)
    }
  },
  // show(currentRow,oldCurrentRow){
  //   console.log(currentRow)
  //   console.log(oldCurrentRow)
  // }
},
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

  /* 表单 */
  .power-table{
    margin-top: 10px;
  }
</style>
