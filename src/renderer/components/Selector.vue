<template>
  <section class="hero is-white is-fullheight">
    <div class="hero-head"></div>
    <!-- Hero content: will be in the middle -->
    <div class="hero-body" id="hero-body">
      <table class="table is-striped is-fullwidth is-hoverable">
        <thead>
          <tr>
            <th><abbr title="自动递增唯一标识(删除序号不会再新增)">序号</abbr></th>
            <th>产妇名</th>
            <th>宝宝名</th>
            <th>出生日期</th>
            <th>纠正胎龄</th>
            <th>电话号码</th>
            <th>备注</th>
            <th><abbr title="是否为高危儿童">危</abbr></th>
            <th><abbr title="年/月/日, 如有纠正胎龄则按其计算.">年龄</abbr></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(user, index) in users" :key="index">
            <th>{{ user.uid }}</th>
            <th>{{ user.name }}</th>
            <th>{{ user.baby }}</th>
            <th>{{ user.birth }}</th>
            <th>{{ user.fixed }}</th>
            <th>{{ user.tele }}</th>
            <th>{{ user.note }}</th>
            <th>{{ user.danger ? '⭕' : '' }}</th>
            <th>{{ user.fixed ? getAge(user.fixed).parse : getAge(user.birth).parse }}</th>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- Hero footer: will stick at the bottom -->
    <div class="hero-foot">
      <nav class="navbar tabs is-boxed is-right is-fixed-bottom">
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
  import db from '../../datastore/index'
// new Date().toISOString().slice(0,10);
  export default {
    name: 'select-page',
    data () {
      return {
        test: 'Test message from src/renderer/components/Selector.vue',
        today: new Date().toISOString().slice(0, 10),
        users: db.get('users').value()
      }
    },
    methods: {
      getAge (birth) {
        birth = Date.parse(birth.replace('/-/g', '/'))
        if (birth) {
          var day = 0
          var month = 0
          var year = 0
          var oneDay = 1000 * 60 * 60 * 24
          var now = new Date()
          var birthday = new Date(birth)
          var age = parseInt((now - birthday) / oneDay)
          day = age % 30
          age = age - day
          if (age > 0) {
            month = age / 30
            age = month
            if (month >= 12) {
              month = age % 12
              year = (age - month) / 12
            }
          }
          var parse = year + '/' + month + '/' + day + '/'
          return { year: year, month: month, day: day, parse: parse }
        }
      },
      open (link) {
        this.$electron.shell.openExternal(link)
      }
    }
  }
</script>

<style scoped>
#nav-selector {
  background: #00d1b2;
  border-color: #00d1b2;
}
th {
  max-width: 260px;
}
nav.tabs {
  background: #f5f5f5;
}
.hero {
  padding-bottom: 41px;
}
.navbar {
  min-height: 41px;
}
.navbar>.container {
  min-height: 41px;
}
#hero-body {
  padding: 0px;
}
#status {
  margin-bottom: 0px;
}

#search {
  padding-top: 2px;
  bottom: 0px;
}

@media screen and (min-width: 1024px) {
  #search {
    margin-left: 120px;
  }
}

</style>
