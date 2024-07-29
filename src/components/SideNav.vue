<template>
    <div class="side-nav">
      <router-link to="/" style="text-decoration: none; color: inherit;">
    <div class="title-section ">
      <img src="@/assets/img/logo.png" alt="Logo" class="logo" />
      <div class="title-text">Game app</div>
    </div>
      </router-link>
    <el-menu
        default-active="1"
        text-color="#333333"
        active-text-color="#409EFF"
    >
      <el-menu-item index="1">
        <router-link to="/dashboard" class="menu-link">
          <el-icon>
            <pie-chart/>
          </el-icon>
          ダッシュボード
        </router-link>
      </el-menu-item>
      <el-menu-item index="2">
        <router-link to="/userlist" class="menu-link">
          <el-icon>
            <user/>
          </el-icon>
          ユーザー一覧
        </router-link>
      </el-menu-item>
      <el-menu-item index="3">
        <router-link to="/questionlist" class="menu-link">
          <el-icon>
            <document/>
          </el-icon>
          問題一覧
        </router-link>
      </el-menu-item>
      <el-menu-item index="4">
        <router-link to="/answerlist" class="menu-link">
          <el-icon>
            <View/>
          </el-icon>
          解答一覧
        </router-link>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>

</script>

<style scoped>
.side-nav {
  width: 200px;
  height: 100vh;
  background-color: #ffffff;
  border-right: 1px solid #e0e0e0;
}

.title-section {
  display: flex;
  height: 100px;
  width: 100%;
  justify-content: center;
  align-items: center;
  background-color: #409EFF;
  color: white;
  margin-bottom: 30px;
}

.logo {
  width: 40px;
  height: 40px;
  margin-right: 10px;
}

.title-text {
  font-size: 1.5em;
  font-weight: bold;
}

.el-menu{
  padding: 20px;
}

.el-menu-item {
  display: flex;
  align-items: center;
  height: 35px;
  padding: 0 !important;
  margin-bottom: 30px;
}

.el-menu-item a {
  color: #515151; /* 继承父元素颜色 */
  text-decoration: none; /* 移除下划线 */
}


.menu-link {
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 10px;
  text-decoration: none;
  color: inherit;
  transition: background-color 0.3s, box-shadow 0.3s;
  border-radius: 10px;
}

.menu-link:hover {
  background-color: #409EFF;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  color: white;
}

.el-icon {
  margin-right: 10px;
}
</style>
