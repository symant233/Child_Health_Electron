<template>
  <section class="hero is-white is-fullheight">
    <div class="modal is-active" id="about" v-if="questionDeleteBoolean">
        <div class="modal-background"></div>
        <div class="modal-content">
            <article class="message is-danger" style="max-width: 300px; margin: auto;">
                <div class="message-body">
                    <h2 class="title">⚠是否删除?</h2>
                    <a class="button is-warning" @click="deleteComfirm(true)">确认删除</a>
                    <a class="button" @click="deleteComfirm(false)">取消</a>
                </div>
            </article>
        </div>
        <button class="modal-close is-large delete" aria-label="close" onclick="close_setting()"></button>
    </div>
    <div class="hero-head"></div>
    <!-- Hero content: will be in the middle -->
    <div class="hero-body" id="hero-body">
      <table class="table is-striped is-fullwidth is-hoverable is-bordered">
        <thead>
          <tr>
            <th><abbr title="自动递增唯一标识(删除序号不会再新增), 点击序号删除该行">序号</abbr></th>
            <th>产妇名</th>
            <th>宝宝名</th>
            <th style="width: 116px; min-width: 116px;">出生日期</th>
            <th>纠正胎龄</th>
            <th>电话号码</th>
            <th class="has-text-centered">备注</th>
            <th style="width: 47px;"><abbr title="是否为高危儿童">危</abbr></th>
            <th><abbr title="年/月/日, 如有纠正胎龄则按其计算.">年龄</abbr></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.uid" :id="'table-uid-' + user.uid">
            <td @click="questionDelete($event)">{{ user.uid }}</td>
            <th>{{ user.name }}</th>
            <td>{{ user.baby }}</td>
            <th>{{ user.birth }}</th>
            <td>{{ user.fixed }}</td>
            <th>{{ user.tele }}</th>
            <td><abbr :title="user.note">{{ user.note }}</abbr></td>
            <td>{{ user.danger ? '⭕' : '' }}</td>
            <td>{{ user.age }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- Hero footer: will stick at the bottom -->
    <div class="hero-foot">
      <nav class="navbar tabs is-boxed is-right is-fixed-bottom">
        <div class="container is-left">
          <!-- left side navbar -->
          <button class="button is-light" style="width: 100px; padding-top: 6px;" onclick="window.location.reload()">
            <abbr title="点击刷新">Counts: {{ this.users.length }}</abbr>
          </button>

          <div style="padding-top: 10px; display: inline-flex;">
            <label class="radio">
              <input type="radio" name="prefix" value="5" v-model="prefix" @click="setPrefix(5)">
              5天
            </label>
            <label class="radio">
              <input type="radio" name="prefix" value="2" v-model="prefix" @click="setPrefix(2)">
              2天
            </label>
          </div>

          <div class="buttons" id='status'>
            <button class="button is-primary" id="status-ok"> ✔ Succeed!&nbsp;</button>
            <button class="button is-danger" id="status-err"> ❌ Failed...</button>
          </div>
        </div>

        <div class="container">
          <ul>
            <li class="is-active is-danger"><a href="#/tele" id="nav-selector">🌟</a></li>
            <li><a href='#/inserter'>Inserter</a></li>
            <li><a href='#/selector'>Selector</a></li>
          </ul>
        </div>
      </nav>
    </div>
  </section>
</template>

<script>
  import db from '../../datastore/index'
  export default {
    name: 'tele-page',
    data () {
      return {
        questionDeleteBoolean: false, // show model
        deleteUid: 0,
        today: new Date().toISOString().slice(0, 10),
        prefix: db.get('pre').value(),
        users: this.getTele().reverse()
      }
    },
    methods: {
      questionDelete (e) {
        var uid = e.currentTarget.innerText
        this.questionDeleteBoolean = true
        this.deleteUid = uid
      },
      deleteComfirm (e) {
        var uid = this.deleteUid
        if (e === true) {
          var r = db.get('users').remove({ uid: parseInt(uid) }).write()
          console.log('DB@ ' + r[0] + ' removed!')
          this.questionDeleteBoolean = false
        } else {
          console.log('DB@ remove uid: ' + uid + ' canceled!')
          this.questionDeleteBoolean = false
        }
      },
      getAge (birth, cn) {
        birth = Date.parse(birth.replace('/-/g', '/'))
        var pre = db.get('pre').value()
        if (birth) {
          var day = 0
          var month = 0
          var year = 0
          var oneDay = 1000 * 60 * 60 * 24
          var now = new Date()
          var birthday = new Date(birth)
          var age = parseInt((now - birthday) / oneDay) + pre
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
          if (cn) {
            var parse = year + '岁' + month + '月'
          } else {
            var parse = year + '/' + month + '/' + day
          }
          return { year: year, month: month, day: day, parse: parse }
        }
      },
      getTele () {
        const users = db.get('users').value()
        const pre = db.get('pre').value()
        var usersNew = []
        const checkList = [
          '0/1/0', '0/3/0', '0/6/0', '0/9/0',
          '1/0/0', '1/6/0', '2/0/0', '2/6/0',
          '3/0/0', '3/6/0', '4/0/0', '4/6/0',
          '5/0/0', '5/6/0', '6/0/0'
        ]
        for (var index in users) {
          var user = users[index]
          if (user.fixed) {
            var age = this.getAge(user.fixed).parse
            var cn = this.getAge(user.fixed, true).parse
          } else {
            var age = this.getAge(user.birth).parse
            var cn = this.getAge(user.birth, true).parse
          }
          for (var index in checkList) {
            var item = checkList[index]
            user.age = cn
            if (age === item) {
              usersNew.push(user)
            }
          }
        }
        return usersNew
      },
      setPrefix (pre) {
        db.set('pre', pre).write()
      }
    }
  }
</script>

<style scoped>
#button-search:hover {
  background-color: #209cee;
}
#nav-selector {
  background: #f14668;
  border-color: #f14668;
}
tbody tr td {
    text-overflow: ellipsis;
    -moz-text-overflow: ellipsis;
    overflow: hidden;  
    white-space: nowrap;  
    text-align: left  
}
th, td {
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
