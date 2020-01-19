<template>
  <section class="hero is-white is-fullheight">
    <div class="hero-head"></div>
    <!-- Hero content: will be in the middle -->
    <div class="hero-body" id="hero-body">
      <table class="table is-striped">
        <thead>
          <tr>
            <th>序号</th>
            <th>产妇姓名</th>
            <th>宝宝姓名</th>
            <th>出生日期</th>
            <th>纠正胎龄</th>
            <th>电话号码</th>
            <th>备注</th>
            <th>高危儿</th>
          </tr>
        </thead>
        <tbody>
          
        </tbody>
      </table>
    </div>
    <!-- Hero footer: will stick at the bottom -->
    <div class="hero-foot">
      <nav class="tabs is-boxed is-right">
        <div class="container is-left">
          <!-- left side navbar -->
          <div class="buttons" id='status'>
            <button class="button is-primary" id="status-ok"> ✔ Succeed!&nbsp;</button>
            <button class="button is-danger" id="status-err"> ❌ Failed...</button>
          </div>
        </div>
        <div class="container">
          <ul>
            <li><a href="#/">Home</a></li>
            <li><a href='#/inserter'>Inserter</a></li>
            <li class="is-active is-primary"><a href='#/selector' id="nav-selector">Selector</a></li>
          </ul>
        </div>
      </nav>
    </div>
  </section>
</template>

<script>
  export default {
    name: 'select-page'
  }
</script>

<style scoped>
#nav-selector {
  background: #00d1b2;
  border-color: #00d1b2;
}
nav.tabs {
  background: #f5f5f5;
}
#hero-body {
  padding: 0px;
}
</style>
