<template>
<!--  PRI邻局移交记录-->
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
        <el-col :span="24">
          <div class='pri-filter' :class="{'filter-hide': isFilterHide}">

            <div class="filter-item">
              <el-select v-model="filterItemsForm.roadBureau" placeholder="所属路局" class="filter-item--input">
                <el-option label="区域一" value="shanghai"></el-option>
                <el-option label="区域二" value="beijing"></el-option>
              </el-select>
            </div>

            <div class="filter-item">
              <el-select v-model="filterItemsForm.outOrIn" placeholder="出局或入局" class="filter-item--input">
                <el-option label="区域一" value="shanghai"></el-option>
                <el-option label="区域二" value="beijing"></el-option>
              </el-select>
            </div>

            <div
                class="filter-item"
                v-for="(item, key) in filterItems"
                :key="key"
            >
              <el-input v-model="filterItemsForm[key]" :placeholder="'请输入' + item"
                        class="filter-item--input"></el-input>
            </div>

          </div>
        </el-col>
      </el-row>
    </div>

    <div class='pri-table'>
      <el-table
          :data="tableData"
          :max-height="tableHeight"
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

  </div>

</template>

<script>
export default {
  name: "PRIhandoverRecord",
  data() {
    return {
      value1: [new Date(2000, 10, 10, 10, 10), new Date(2000, 10, 11, 10, 10)],
      // tabIndex: 2,
      filterItemsForm: {
        MSISDN: '',
        RBCNumber: '',
        callReference: '',
        roadBureau: '',
        outOrIn: ''
      },
      filterItems: {
        MSISDN: 'MSISDN',
        RBCNumber: 'RBC号码',
        callReference: '呼叫参考'
      },
      tableHead: {name: '序号', address: '接收或者发送时间', age: '年龄', job: '工作', hobby: '爱好'},
      tableData: [],
      currentPage: 1,
      isFilterHide: true,
      tableHeight: '720',
      // tableHeight: '602',
    }
  },
  mounted() {
    this.createData()
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
  .table-filter{
    display: flex;
    justify-content: space-between;
    height: 25px;
  }
  .table-filter{
    .time-format{
      position: relative;
      top: -5px;
      .time-label{
        font-size: 14px;
      }
      .el-select{
        width: 70px;
        input.el-input__inner{
          height: 25px;
        }
        .el-input__icon {
          line-height: 25px;
        }
      }
    }

  }
}
</style>