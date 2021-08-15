<template>
  <section class="hero is-white is-fullheight">
    <div class="modal is-active" id="about" v-if="questionDeleteBoolean">
      <div class="modal-background"></div>
      <div class="modal-content">
        <article
          class="message is-danger"
          style="max-width: 300px; margin: auto;"
        >
          <div class="message-body">
            <h2 class="title">⚠是否删除?</h2>
            <a class="button is-warning" @click="deleteComfirm(true)"
              >确认删除</a
            >
            <a class="button" @click="deleteComfirm(false)">取消</a>
          </div>
        </article>
      </div>
      <button
        class="modal-close is-large delete"
        aria-label="close"
        onclick="close_setting()"
      ></button>
    </div>
    <div class="hero-head"></div>
    <!-- Hero content: will be in the middle -->
    <div class="hero-body" id="hero-body">
      <table class="table is-striped is-fullwidth is-hoverable is-bordered">
        <thead>
          <tr>
            <th>序号</th>
            <th style="min-width: 78px;">产妇名</th>
            <th style="min-width: 78px;">宝宝名</th>
            <th style="width: 116px; min-width: 116px;">出生日期</th>
            <th style="width: 107px; min-width: 89px">纠正胎龄</th>
            <th>电话号码</th>
            <th class="has-text-centered">备注</th>
            <th>性</th>
            <th style="width: 47px;"><abbr title="是否为高危儿童">危</abbr></th>
            <th><abbr title="年/月/日, 如有纠正胎龄则按其计算.">年龄</abbr></th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="user in users"
            :key="user.uid"
            :id="'table-uid-' + user.uid"
          >
            <td>{{ user.uid }}</td>
            <th>
              <editable
                :obj="{ uid: user.uid, key: 'name', value: user.name }"
              ></editable>
            </th>
            <td>
              <editable
                :obj="{ uid: user.uid, key: 'baby', value: user.baby }"
              ></editable>
            </td>
            <th>
              <editable
                :obj="{ uid: user.uid, key: 'birth', value: user.birth }"
              ></editable>
            </th>
            <td>
              <editable
                :obj="{ uid: user.uid, key: 'fixed', value: user.fixed }"
              ></editable>
            </td>
            <th>
              <editable
                :obj="{ uid: user.uid, key: 'tele', value: user.tele }"
              ></editable>
            </th>
            <td>
              <abbr :title="user.note">{{ user.note }}</abbr>
            </td>
            <td>
              <div v-if="user.male !== undefined">
                {{
                  user.male === 'true'
                    ? '男'
                    : user.male === 'false'
                    ? '女'
                    : ''
                }}
              </div>
            </td>
            <td><danger-level :user="user"></danger-level></td>
            <td>{{ getAge(user.birth).parse }}</td>
            <td>
              <span @click="questionDelete($event)" class="del">删</span>
              <span @click="detail(user.uid)" class="edit">详</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- Hero footer: will stick at the bottom -->
    <div class="hero-foot">
      <nav class="navbar tabs is-boxed is-right is-fixed-bottom">
        <div class="container is-left">
          <!-- left side navbar -->
          <button
            class="button is-light"
            style="width: 100px; padding-top: 6px;"
            @click="init()"
          >
            <abbr title="点击刷新">Counts: {{ this.users.length }}</abbr>
          </button>

          <div style="padding-top: 10px; display: inline-flex;">
            <label class="radio">
              <input
                type="radio"
                name="prefix"
                value="5"
                v-model="prefix"
                @click="setPrefix(5)"
              />
              5天
            </label>
            <label class="radio">
              <input
                type="radio"
                name="prefix"
                value="4"
                v-model="prefix"
                @click="setPrefix(4)"
              />
              4天
            </label>
            <label class="radio">
              <input
                type="radio"
                name="prefix"
                value="3"
                v-model="prefix"
                @click="setPrefix(3)"
              />
              3天
            </label>
            <label class="radio">
              <input
                type="radio"
                name="prefix"
                value="2"
                v-model="prefix"
                @click="setPrefix(2)"
              />
              2天
            </label>
          </div>

          <div class="buttons" id="status">
            <button class="button is-primary" id="status-ok">
              ✔ Succeed!&nbsp;
            </button>
            <button class="button is-danger" id="status-err">
              ❌ Failed...
            </button>
          </div>
        </div>

        <div class="container">
          <ul>
            <li class="is-active is-danger">
              <a href="#/tele" id="nav-selector">🌟</a>
            </li>
            <li><a href="#/inserter">Inserter</a></li>
            <li><a href="#/selector">Selector</a></li>
          </ul>
        </div>
      </nav>
    </div>
  </section>
</template>

<script>
import base from '../../datastore/base'
import Editable from './Common/Editable'
import DangerLevel from './Common/DangerLevel.vue'
export default {
  name: 'tele-page',
  components: { Editable, DangerLevel },
  data() {
    return {
      questionDeleteBoolean: false, // show model
      deleteUid: 0,
      today: new Date().toISOString().slice(0, 10),
      prefix: 2,
      users: [],
      staticUsers: []
    }
  },
  async mounted() {
    this.staticUsers = await base.getUsersAll()
    this.prefix = await base.getBasicItem('pre')
    this.init()
  },
  methods: {
    async init() {
      this.users = await this.getTele()
    },
    detail(uid) {
      window.location.hash = '#/detail/' + uid
    },
    questionDelete(e) {
      var uid = e.currentTarget.innerText
      this.questionDeleteBoolean = true
      this.deleteUid = uid
    },
    deleteComfirm(e) {
      var uid = this.deleteUid
      if (e === true) {
        base.deleteUser(parseInt(uid))
        console.log('DB@ ' + uid + ' removed!')
        this.questionDeleteBoolean = false
      } else {
        console.log('DB@ remove uid: ' + uid + ' canceled!')
        this.questionDeleteBoolean = false
      }
    },
    getAge(birth, cn) {
      birth = Date.parse(birth.replace('/-/g', '/'))
      var pre = this.prefix
      if (birth) {
        var day = 0
        var month = 0
        var year = 0
        var oneDay = 1000 * 60 * 60 * 24
        var now = new Date()
        var birthday = new Date(birth)
        var age = parseInt((now - birthday) / oneDay) + pre

        year = parseInt(age / 365.25)
        age = age - year * 365.25
        if (age > 0) {
          month = parseInt(age / 30.4375)
          age = age - month * 30.4375
          day = parseInt(age)
        }

        if (cn) {
          var parse = year + '岁' + month + '月'
        } else {
          var parse = year + '/' + month + '/' + day
        }
        return { year: year, month: month, day: day, parse: parse }
      }
    },
    async getTele() {
      const usersNew = []
      const checkList = [
        // 普通高危儿
        '0/1/0',
        '0/3/0',
        '0/6/0',
        '0/9/0',
        '1/0/0',
        '1/6/0',
        '2/0/0',
        '2/6/0',
        '3/0/0',
        '3/6/0',
        '4/0/0',
        '4/6/0',
        '5/0/0',
        '5/6/0',
        '6/0/0'
      ]
      const checkList2 = [
        // 二类高危儿
        '0/1/0',
        '0/2/0',
        '0/3/0',
        '0/4/0',
        '0/5/0',
        '0/6/0',
        '0/8/0',
        '0/10/0',
        '1/0/0',
        '1/3/0',
        '1/6/0',
        '1/9/0',
        '2/0/0',
        '2/6/0',
        '3/0/0',
        '3/6/0',
        '4/0/0',
        '4/6/0',
        '5/0/0',
        '5/6/0',
        '6/0/0'
      ]
      for (var index in this.staticUsers) {
        var user = this.staticUsers[index]
        var age = this.getAge(user.birth).parse
        var cn = this.getAge(user.birth, true).parse
        // 如果是二类高危儿则使用另一套匹配列表
        var list =
          this.staticUsers[index].level === '2' ? checkList2 : checkList
        for (var index in list) {
          var item = list[index]
          user.age = cn
          if (age === item) {
            usersNew.push(user)
          }
        }
      }
      return usersNew
    },
    async setPrefix(pre) {
      await base.setBasicItem('pre', pre)
      this.prefix = pre
      this.init()
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
  text-align: left;
}

thead > tr th {
  position: sticky;
  top: 0px;
  background-color: antiquewhite;
}

th,
td {
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

.navbar > .container {
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

.del {
  color: red;
}

.edit {
  color: green;
}
</style>
