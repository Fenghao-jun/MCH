<template>
  <div>
    <div>
      <div class='pri-head'>
        <div class="head-time--filter">
          <span class="time-text">挂机时间设置（起始 ~ 结束）：</span>
          <span>
            <el-date-picker
                v-model="value1"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
            </el-date-picker>
          </span>
        </div>

        <div class="head-button">
          <el-button type="danger" @click="clearQuery">清除</el-button>
          <el-button type="primary" @click="queryPri">查询</el-button>
          <el-button @click="exportExcel">导出</el-button>
        </div>
      </div>

      <div class="filter-container">
        <el-row>
          <el-col :span="22">
            <div class='pri-filter' :class="{'filter-hide': isFilterHide}">

              <div
                  class="filter-item"
                  v-for="(item, key) in filterItems"
                  :key="key"
              >
                <el-input v-model="filterItemsForm[key]" :placeholder="'请输入' + item"
                          class="filter-item--input"></el-input>
              </div>

              <div class="filter-item">
                <el-select v-model="filterItemsForm.BillResults" placeholder="请选择话单结果" class="filter-item--input">
                  <el-option label="区域一" value="shanghai"></el-option>
                  <el-option label="区域二" value="beijing"></el-option>
                </el-select>
              </div>

              <div class="filter-item">
                <el-select v-model="filterItemsForm.chainRemove" placeholder="请选择拆链原因" class="filter-item--input">
                  <el-option label="区域一" value="shanghai"></el-option>
                  <el-option label="区域二" value="beijing"></el-option>
                </el-select>
              </div>

              <div class="filter-item">
                <el-select v-model="filterItemsForm.chainRemoveCommunity" placeholder="请选择拆链小区"
                           class="filter-item--input">
                  <el-option label="区域一" value="shanghai"></el-option>
                  <el-option label="区域二" value="beijing"></el-option>
                </el-select>
              </div>

              <div class="filter-item">

                <el-input placeholder="请输入采集卡" class="filter-item--input"></el-input>
                <span class="continue-icon"> - </span>
                <el-input placeholder="请输入端口" class="filter-item--input"></el-input>
                <span class="continue-icon"> - </span>
                <el-input placeholder="请输入时隙" class="filter-item--input"></el-input>
              </div>
              <div class="filter-item">

                <el-input placeholder="请输入起始拆链公里标" class="filter-item--input"></el-input>
                <span class="continue-icon"> - </span>
                <el-input placeholder="请输入结束拆链公里标" class="filter-item--input"></el-input>

              </div>

            </div>
          </el-col>
          <el-col :span="2" v-if="showMoreFilter">
            <div class="more-filter">
              <!-- <span>更多条件</span> -->
              <el-button type="text" @click="moreFilter">
                更多条件
                <i v-if="isFilterHide" class="el-icon-caret-top"></i>
                <i v-else class="el-icon-caret-bottom"></i>
              </el-button>
            </div>
          </el-col>
        </el-row>
      </div>

      <div class='pri-table'>
        <el-table
            :data="tableData"
            :max-height="tableHeight"
            @row-click="openCommand"
            highlight-current-row
            border
        >
          <el-table-column
              v-for="(value, key) in tableHead"
              :key="key"
              :prop="key"
              :label="value"
              min-width="400"
          ></el-table-column>
        </el-table>
      </div>

      <div class="pri-pagination">
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[100, 200, 300, 400]"
            :page-size="100"
            layout="total, sizes, prev, pager, next, jumper"
            :total="400">
        </el-pagination>
      </div>
      <el-dialog
          title="原始指令"
          :visible.sync="commandDialog"
          width="30%"
      >
        <span>原始指令</span>

        <span slot="footer" class="dialog-footer">
          <el-button @click="commandDialog = false">取 消</el-button>
          <el-button type="primary" @click="commandDialog = false">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  name: "PRImoduleAnalysis",
  data() {
    return {
      value1: [new Date(2000, 10, 10, 10, 10), new Date(2000, 10, 11, 10, 10)],
      tabIndex: 2,
      // IMSI: '',
      // filterItems: [1,2,3,4,5,6,7,8,11,12,13,14,15,16,17,18],
      filterItemsForm: {
        IMSI: '',
        MSISDN: '',
        LocomotiveNumber: '',
        Trainnumber: '',
        CTCSID: '',
        RBCNumber: '',
        BillResults: '',
        chainRemove: '',
        chainRemoveCommunity: ''
      },
      filterItems: {
        IMSI: 'IMSI',
        MSISDN: '主叫MSISDN',
        LocomotiveNumber: '机车号',
        Trainnumber: '车次号',
        CTCSID: 'CTCS ID',
        RBCNumber: 'RBC号码',
        // BillResults: '话单结果',
        // chainRemove: '拆链原因',
        // chainRemoveCommunity: '拆链小区'
      },
      tableHead: {name: '姓名', address: '地址', age: '年龄', job: '工作', hobby: '爱好'},
      tableData: [],
      currentPage: 1,
      isFilterHide: true,
      tableHeight: '720',
      // tableHeight: '602',
      showMoreFilter: true,
      commandDialog: false,
    }
  },
  mounted() {
    this.createData()
    let items = document.querySelectorAll('.filter-item')
    // console.log(items.length, 'itemLength')
    this.showMoreFilter = items.length > 6 ? true : false
  },
  methods: {
    // 制造一些表格的假数据
    createData() {
      let n = 0
      while (n < 100) {
        let item = {
          name: '王小虎',
          address: '广州是和罚款了'
        }
        item.name = item.name + n
        this.tableData.push(item)
        n++
      }
    },

    // 展开或者收起筛选
    moreFilter() {
      this.isFilterHide = !this.isFilterHide
      this.tableHeight = this.isFilterHide ? '720' : 642
    },

    /**
     * 点击查询
     * @method queryPri
     * */
    queryPri() {
      console.log(this.filterItemsForm)
    },
    /**
     * 清除查询
     * @method clearQuery
     * */
    clearQuery() {
      console.log(this.filterItemsForm)
    },

    /**
     * 导出excel表格
     * @method exportExcel
     * */
    exportExcel() {
      console.log(this.filterItemsForm)
    },

    /**
     * 打开显示原始指令
     * @method openCommand
     * @param (object)row 被点击的行
     * @param (object)column 被点击的列
     * @param (object)event 点击事件对象
     * */
    openCommand(row, column, event) {
      this.commandDialog = true
      console.log(row, 'success click row')
    },
    handleSizeChange() {
    },

    handleCurrentChange() {
    },

  }
}
</script>

<style lang="less">
/* 头部 */
.pri-head {
  /* height: 50px; */
  display: flex;
  flex: 1;
  justify-content: space-between;

  .time-text {
    height: 40px;
    line-height: 40px;
    text-align: center;
    font-size: 18px;
  }
}

/* 筛选 */
.filter-container {
  // height: 130px;
  margin-bottom: 10px;

  .pri-filter {
    display: flex;
    flex-wrap: wrap;

  }

  .filter-hide {
    height: 40px;
    overflow: hidden;
  }

  .filter-item {
    margin-right: 30px;
    margin-top: 10px;
    /* width: 180px; */

    span {
      margin-bottom: 2px;
    }

    .continue-icon {
      height: 30px;
      line-height: 30px;
      text-align: center
    }
  }

  //.el-select.filter-item--input{
  //  width: 202px;
  //}
  .filter-item--input {
    width: 202px;

    .el-input__inner {
      height: 30px;
    }

    .el-input__icon {
      line-height: 30px;
    }

    input::-webkit-input-placeholder, textarea::-webkit-input-placeholder {
      color: rgb(136, 132, 132);
      font-size: 14px;
    }

    input:-moz-placeholder, textarea:-moz-placeholder {
      color: #666;
      font-size: 16px;
    }

    input::-moz-placeholder, textarea::-moz-placeholder {
      color: #666;
      font-size: 16px;
    }

    input:-ms-input-placeholder, textarea:-ms-input-placeholder {
      color: #666;
      font-size: 16px;
    }

  }

  .more-filter {
    text-align: center;
    font-size: 14px;
    color: #409EFF;
  }

}

/* 表格 */
.pri-table {
  //margin-top: 10px;
}
</style>