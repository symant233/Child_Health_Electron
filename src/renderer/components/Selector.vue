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
              <span @click="questionDelete(user.uid)" class="del">删</span>
              <span @click="detail(user.uid)" class="edit">详</span>
            </td>
          </tr>
        </tbody>
      </table>
      <div id="load-all" @click="loadNextPage()" v-if="showLoad">
        加载下一页
      </div>
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
            <abbr title="点击刷新">Counts: {{ count }}</abbr>
          </button>

          <div
            class="field has-addons"
            style="display: inline-flex; margin-bottom: 0px; padding-top: 2px;"
          >
            <p class="control">
              <span class="select">
                <select v-model="selectForm.options">
                  <option
                    v-for="(option, index) in optionList"
                    :key="index"
                    :value="option.id"
                    >{{ option.value }}</option
                  >
                </select>
              </span>
            </p>
            <p class="control">
              <input
                class="input"
                type="text"
                placeholder="Text input"
                v-model="selectForm.input"
                @keyup.enter="search()"
              />
            </p>
            <p class="control">
              <a
                class="button is-info"
                @click="search()"
                style="border-bottom-right-radius: 4px;border-top-right-radius: 4px;"
                id="button-search"
              >
                🔍
              </a>
            </p>
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
            <li><a href="#/tele">🌟</a></li>
            <li><a href="#/inserter">Inserter</a></li>
            <li class="is-active is-primary">
              <a href="#/selector" id="nav-selector">Selector</a>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  </section>
</template>

<script>
import base from '../../datastore/base'
import Editable from './Common/Editable.vue'
import DangerLevel from './Common/DangerLevel.vue'
export default {
  name: 'select-page',
  components: { Editable, DangerLevel },
  data() {
    return {
      page: 0,
      showLoad: false,
      questionDeleteBoolean: false, // show model
      deleteUid: 0,
      today: new Date().toISOString().slice(0, 10),
      users: [],
      count: 0,
      selectForm: { options: 'baby', input: '' },
      optionList: [
        { id: 'uid', value: '序号' },
        { id: 'name', value: '产妇' },
        { id: 'baby', value: '宝宝' },
        { id: 'birth', value: '生日' },
        { id: 'danger', value: '高危' },
        { id: 'tele', value: '电话' }
      ]
    }
  },
  async mounted() {
    this.init()
  },
  methods: {
    async init() {
      this.users = await base.getUsersLimited()
      this.count = await base.getUsersCount()
      this.selectForm.options = await base.getBasicItem('search')
      this.selectForm.input = ''
      this.selectForm.text = ''
      if (this.count) this.showLoad = true
      this.page = 0
    },
    async loadNextPage() {
      if (!this.selectForm.text) {
        const tmp = await base.getUsersPage(++this.page)
        this.users.push(...tmp)
      } else {
        const tmp = await base.searchUsersPage(
          this.selectForm.id,
          this.selectForm.text,
          ++this.page
        )
        if (!tmp.length) this.showLoad = false
        this.users.push(...tmp)
      }
    },
    detail(uid) {
      window.location.hash = '#/detail/' + uid
    },
    questionDelete(uid) {
      this.questionDeleteBoolean = true
      this.deleteUid = uid
    },
    deleteComfirm(e) {
      const uid = parseInt(this.deleteUid)
      if (e === true) {
        base.deleteUser(uid)
        console.log('DB@ ' + uid + ' removed!')
        this.questionDeleteBoolean = false
      } else {
        console.log('DB@ remove uid: ' + uid + ' canceled!')
        this.questionDeleteBoolean = false
      }
    },
    getAge(birth) {
      if (!birth) return { parse: '' }
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
      return { parse: 'error' }
    },
    async search() {
      this.page = 0
      this.showLoad = true
      let id = this.selectForm.options
      await base.setBasicItem('search', id)
      let input = this.selectForm.input
      if (!input.startsWith('%')) {
        input = `%${input}%`
      }
      console.log('Search: ' + id + ': ' + input)
      if (id === 'danger') {
        if (input === '%%') {
          input = '%1%'
        } else {
          id = 'level'
        }
      }
      this.selectForm.text = input
      this.selectForm.id = id
      this.users = await base.searchUsersPage(id, input, 0)
      this.count = await base.searchUsersCount(id, input)
    }
  }
}
</script>

<style scoped>
@media print {
  .hero-body {
    overflow: hidden !important;
  }
  .hero {
    padding: 0 !important;
  }
  .hero-foot {
    display: none !important;
  }
  td {
    padding: 1px !important;
  }
  th {
    padding: 1px !important;
  }
}

#button-search:hover {
  background-color: #209cee;
}

#nav-selector {
  background: #00d1b2;
  border-color: #00d1b2;
}

#load-all {
  padding: 8px;
  background-color: lavender;
  cursor: pointer;
  text-align: center;
  color: coral;
}

table.table {
  margin-bottom: 0;
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
  overflow-x: hidden;
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
