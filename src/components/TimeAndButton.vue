<template>
  <div class="time-and-button">
    <div class="head-time--filter">
      <span class="time-text">挂机时间设置（起始 ~ 结束）：</span>
      <span>
          <el-date-picker
              v-model="activeTime"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
          </el-date-picker>
        </span>
    </div>

    <div class="head-button">
      <el-button type="danger" @click="clearQuery">清除</el-button>
      <el-button type="primary" @click="query">查询</el-button>
      <el-button @click="exportExcel">导出</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "TimeAndButton",
  data(){
    return {
      initTime: [new Date(2000, 10, 10, 10, 10), new Date(2000, 10, 11, 10, 10)],
      activeTime: [],
    }
  },
  created() {
    this.activeTime = this.initTime
  },
  methods: {
    /**
     * 点击查询, 自定义一个查询点击的事件，在父组件中使用
     * @method query
     * */
    query() {
      this.$emit('query-click', this.activeTime)
      console.log('query-click')
    },
    /**
     * 清除查询，自定义一个清除点击的事件，在父组件中使用
     * @method clearQuery
     * */
    clearQuery() {
      this.$emit('clear-click')
      console.log('clear-click')
    },

    /**
     * 导出，自定义一个导出点击的事件，在父组件中使用
     * @method exportExcel
     * */
    exportExcel() {
      this.$emit('export-click')
      console.log('export-click')
    },
  }
}
</script>

<style scoped lang="less">
.time-and-button{
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
</style>