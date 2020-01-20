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
            <td>{{ user.fixed ? getAge(user.fixed).parse : getAge(user.birth).parse }}</td>
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
            <abbr title="点击刷新">Counts: {{ count }}</abbr>
          </button>

          <div class="field has-addons" style="display: inline-flex; margin-bottom: 0px; padding-top: 2px;">
            <p class="control">
              <span class="select">
                <select v-model="selectForm.options">
                  <option v-for="(option, index) in optionList" :key="index" :value="option.id">{{ option.value }}</option>
                </select>
              </span>
            </p>
            <p class="control">
              <input class="input" type="text" placeholder="Text input" v-model="selectForm.input">
            </p>
            <p class="control">
              <a class="button is-info" @click="search()" style="border-bottom-right-radius: 4px;border-top-right-radius: 4px;" id="button-search">
                🔍
              </a>
            </p>
          </div>

          <div class="buttons" id='status'>
            <button class="button is-primary" id="status-ok"> ✔ Succeed!&nbsp;</button>
            <button class="button is-danger" id="status-err"> ❌ Failed...</button>
          </div>
        </div>
        <div class="container">
          <ul>
            <!-- <li><a href="#/">Home</a></li> -->
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
  export default {
    name: 'select-page',
    data () {
      return {
        questionDeleteBoolean: false, // show model
        deleteUid: 0,
        test: 'Test message from src/renderer/components/Selector.vue',
        today: new Date().toISOString().slice(0, 10),
        users: db.get('users').value(),
        count: db.get('users').size().value(),
        selectForm: { options: 'baby', input: '' },
        optionList: [
          { id: 'uid', value: '序号' },
          { id: 'name', value: '产妇' },
          { id: 'baby', value: '宝宝' },
          { id: 'birth', value: '生日' },
          { id: 'danger', value: '高危' }
        ]
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
          var parse = year + '/' + month + '/' + day
          return { year: year, month: month, day: day, parse: parse }
        }
      },
      search () {
        var id = this.selectForm.options
        var input = this.selectForm.input
        console.log('Search: ' + id + input)
        if (id === 'uid') {
          this.users = this.users.filter(function (user) {
            return user.uid === parseInt(input)
          })
        } else if (id === 'danger') {
          this.users = this.users.filter(function (user) {
            return user.danger === true
          })
        } else if (id === 'name') {
          this.users = this.users.filter(function (user) {
            return user.name.match(input)
          })
        } else if (id === 'baby') {
          this.users = this.users.filter(function (user) {
            return user.baby.match(input)
          })
        } else if (id === 'birth') {
          this.users = this.users.filter(function (user) {
            return user.birth.match(input)
          })
        }
      }
    }
  }
</script>

<style scoped>
#button-search:hover {
  background-color: #209cee;
}
#nav-selector {
  background: #00d1b2;
  border-color: #00d1b2;
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
