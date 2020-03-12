<template>
  <div id="wrapper">
    <section class="hero is-white is-fullheight">
      <div class="hero-head" id="hero-head">
        <div class="columns content is-medium">
          <div class="column">
            <a :href="'\/#\/selector#table-uid-' + this.uid">＜</a>
          </div>
          <div class="column is-half has-text-centered">
            <span style="text-decoration: underline;">
              {{ user.baby ? user.baby : '未命名' }}
            </span>
            健康体检表&nbsp;&nbsp;
          </div>
          <div class="column has-text-right">
            {{ new Date().toISOString().slice(0, 10) }}
          </div>
        </div>
        
      </div>
      <div class="hero-body" id="hero-body">
        <div class="columns">
          <div class="column is-half">
            <table class="table is-striped is-fullwidth is-hoverable is-bordered">
              <thead>
                <tr>
                  <th style="width: 90px;"></th>
                  <th colspan="3" class="has-text-centered">宝宝信息</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>姓名</td>
                  <td>{{ user.baby }}</td>
                  <td style="width: 90px;">性别</td>
                  <td></td> <!-- gender -->
                </tr>
                <tr>
                  <td>出生日期</td>
                  <td>{{ user.birth }}</td>
                  <td>年龄</td>
                  <td>{{ user.fixed ? getAge(user.fixed).parse : getAge(user.birth).parse }}</td>
                </tr>
                <tr>
                  <td>纠正胎龄</td>
                  <td>{{ user.fixed }}</td>
                  <td>高危儿</td>
                  <td>{{ user.danger ? '⭕' : '否' }}</td>
                </tr>
                <tr>
                  <td>出生体重</td>
                  <td></td>
                  <td>孕周</td>
                  <td></td>
                </tr>
                <tr>
                  <td>G</td>
                  <td></td>
                  <td>P</td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="column">
            <table class="table is-striped is-fullwidth is-hoverable is-bordered">
              <thead>
                <tr>
                  <th style="width: 90px;"></th>
                  <th class="has-text-centered">母亲</th>
                  <th class="has-text-centered">父亲</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>姓名</td>
                  <td>{{ user.name }}</td>
                  <td></td>
                </tr>
                <tr>
                  <td>年龄</td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td>职业</td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td>电话</td>
                  <td>{{ user.tele }}</td>
                  <td></td>
                </tr>
                <tr>
                  <td>住址</td>
                  <td></td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <!-- head table columns end -->
        
        <article class="message">
          <div class="message-body">
            <strong>备注:&nbsp;</strong>{{ user.note }}
          </div>
        </article>


      </div>
    </section>
  </div>
</template>

<script>
  import db from '../../datastore/'
  import Editable from './Common/Editable.vue'
  export default {
    name: 'enrty-detail',
    components: { Editable },
    data () {
      return {
        uid: parseInt(this.$route.params.uid),
        user: db.get('users').find({uid: parseInt(this.$route.params.uid)}).value()
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

          year = parseInt(age / 365.25)
          age = age - year * 365.25
          if (age > 0) {
            month = parseInt(age / 30.4375)
            age = age - month * 30.4375
            day = parseInt(age)
          }
          
          var parse = year + '/' + month + '/' + day
          return { year: year, month: month, day: day, parse: parse }
        }
      }
    }
  }
</script>

<style>
#hero-body {
  display: block;
  padding-top: 0rem;
}

#hero-head {
  padding: 10px 39px;
}

nav button {
  border-radius: unset;
  height: 41px;
  margin: 0px;
}

.tabs.is-boxed a {
    border-radius: 0px;
}

nav.tabs {
  background: #f5f5f5;
}

</style>
