<template>
  <el-upload
    :limit="1"
    :file-list="fileList"
    :auto-upload="false"
    action="http://192.168.1.100/cgi-bin/getsyslog.cgi"
    ref="upload"
    :data="data"
  >
    <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
    <el-button style="margin-left: 10px;" size="small" type="success" @click="update">上传到服务器</el-button>
    <div slot="tip" class="el-upload__tip">只能上传zip文件</div>
  </el-upload>


</template>

<script>
export default {
  name: "updateSystem",
  data(){
    return{
      fileList:[],
      data:{
        ID:window.sessionStorage.getItem('userName')
      }
    }
  },
  methods:{
    update(){
      this.$refs.upload.submit();
      console.log('123123')
    }
  }
}
</script>

<style scoped>

</style>
