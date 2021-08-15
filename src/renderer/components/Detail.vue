<template>
  <div id="wrapper">
    <section class="hero is-white is-fullheight">
      <div class="modal is-active" id="about" v-if="questionDeleteBoolean">
        <div
          class="modal-background"
          @click="this.questionDeleteBoolean = false"
        ></div>
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
      <div class="hero-head" id="hero-head-detail">
        <div class="columns content is-medium">
          <div class="column">
            <a @click="goBack">＜</a>
            <a href="#/selector">❎</a>
            &nbsp;&nbsp;{{ user.uid }}
          </div>
          <div class="column is-half has-text-centered">
            <span style="text-decoration: underline;">
              {{ user.baby ? user.baby : '未命名' }}
            </span>
            健康体检表&nbsp;&nbsp;
          </div>
          <div class="column has-text-right">{{ today }}</div>
        </div>
      </div>
      <div class="hero-body" id="hero-body-detail">
        <!-- head table columns start-->
        <div class="columns">
          <div class="column is-half">
            <table
              class="table is-striped is-fullwidth is-hoverable is-bordered"
            >
              <thead>
                <tr>
                  <th style="width: 90px; min-width: 89px;"></th>
                  <th colspan="3" class="has-text-centered">宝宝信息</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>姓名</td>
                  <td width="50%">
                    <editable
                      :obj="{ uid: user.uid, key: 'baby', value: user.baby }"
                    ></editable>
                  </td>
                  <td style="width: 57px; min-width: 57px;">性别</td>
                  <td width="50%">
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
                  <!-- gender -->
                </tr>
                <tr>
                  <td>出生日期</td>
                  <td style="min-width: 108px;">
                    <editable
                      :obj="{ uid: user.uid, key: 'birth', value: user.birth }"
                    ></editable>
                  </td>
                  <td>年龄</td>
                  <td>{{ getAge(user.birth).parse }}</td>
                </tr>
                <tr>
                  <td>纠正胎龄</td>
                  <td>
                    <editable
                      :obj="{ uid: user.uid, key: 'fixed', value: user.fixed }"
                    ></editable>
                  </td>
                  <td>高危</td>
                  <td><danger-level :user="user"></danger-level></td>
                </tr>
                <tr>
                  <td>出生体重</td>
                  <td>
                    <editable
                      :obj="{
                        uid: user.uid,
                        key: 'weight',
                        value: user.weight
                      }"
                    ></editable>
                  </td>
                  <td>G</td>
                  <td>
                    <editable
                      :obj="{ uid: user.uid, key: 'G', value: user.G }"
                    ></editable>
                  </td>
                </tr>
                <tr>
                  <td>孕周</td>
                  <td>
                    <editable
                      :obj="{ uid: user.uid, key: 'week', value: user.week }"
                    ></editable>
                  </td>
                  <td>P</td>
                  <td>
                    <editable
                      :obj="{ uid: user.uid, key: 'P', value: user.P }"
                    ></editable>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="column">
            <table
              class="table is-striped is-fullwidth is-hoverable is-bordered"
            >
              <thead>
                <tr>
                  <th style="width: 57px; min-width: 57px;"></th>
                  <th class="has-text-centered" width="50%">母亲</th>
                  <th class="has-text-centered" width="50%">父亲</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>姓名</td>
                  <td>
                    <editable
                      :obj="{ uid: user.uid, key: 'name', value: user.name }"
                    ></editable>
                  </td>
                  <td>
                    <edit-parent
                      :obj="{
                        uid: uid,
                        key: 'name',
                        value: detail.fname,
                        mother: false
                      }"
                    ></edit-parent>
                  </td>
                </tr>
                <tr>
                  <td>年龄</td>
                  <td>
                    <edit-parent
                      :obj="{
                        uid: uid,
                        key: 'age',
                        value: detail.mage,
                        mother: true
                      }"
                    ></edit-parent>
                  </td>
                  <td>
                    <edit-parent
                      :obj="{
                        uid: uid,
                        key: 'age',
                        value: detail.fage,
                        mother: false
                      }"
                    ></edit-parent>
                  </td>
                </tr>
                <tr>
                  <td>职业</td>
                  <td>
                    <edit-parent
                      :obj="{
                        uid: uid,
                        key: 'job',
                        value: detail.mjob,
                        mother: true
                      }"
                    ></edit-parent>
                  </td>
                  <td>
                    <edit-parent
                      :obj="{
                        uid: uid,
                        key: 'job',
                        value: detail.fjob,
                        mother: false
                      }"
                    ></edit-parent>
                  </td>
                </tr>
                <tr>
                  <td>电话</td>
                  <td>
                    <editable
                      :obj="{ uid: user.uid, key: 'tele', value: user.tele }"
                    ></editable>
                  </td>
                  <td>
                    <edit-parent
                      :obj="{
                        uid: uid,
                        key: 'tele',
                        value: detail.ftele,
                        mother: false
                      }"
                    ></edit-parent>
                  </td>
                </tr>
                <tr>
                  <td>住址</td>
                  <td>
                    <edit-parent
                      :obj="{
                        uid: uid,
                        key: 'home',
                        value: detail.mhome,
                        mother: true
                      }"
                    ></edit-parent>
                  </td>
                  <td>
                    <edit-parent
                      :obj="{
                        uid: uid,
                        key: 'home',
                        value: detail.fhome,
                        mother: false
                      }"
                    ></edit-parent>
                  </td>
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

        <div class="add">
          <input
            class="num-input"
            type="number"
            v-model="addReport.weight"
            name="weight"
            value=""
            placeholder="体重(公斤)"
          />
          <select v-model="addReport.signalW">
            <option
              v-for="(option, index) in optionList"
              :key="index"
              :value="option"
              >{{ option }}</option
            >
          </select>
          <input
            class="num-input"
            type="number"
            v-model="addReport.height"
            name="height"
            value=""
            placeholder="身高(厘米)"
          />
          <select v-model="addReport.signalH">
            <option
              v-for="(option, index) in optionList"
              :key="index"
              :value="option"
              >{{ option }}</option
            >
          </select>
          <input
            class="num-input"
            type="number"
            v-model="addReport.head"
            name="head"
            value=""
            placeholder="头围(厘米)"
          />
          <select v-model="addReport.signalC">
            <option
              v-for="(option, index) in optionList"
              :key="index"
              :value="option"
              >{{ option }}</option
            >
          </select>
          <input
            style="width: 400px;"
            type="text"
            v-model="addReport.result"
            name="result"
            value=""
            placeholder="检查结果"
          />
          <button @click="newDetail">+</button>
        </div>
        <!-- detail table start -->
        <table class="table is-striped is-fullwidth is-hoverable is-bordered">
          <thead>
            <tr>
              <!-- <th style="min-width: 57px; width: 57px;">序号</th> -->
              <th style="min-width: 57px; width: 57px;">年龄</th>
              <th style="min-width: 57px; width: 57px;">体重</th>
              <th style="min-width: 57px; width: 57px;">身高</th>
              <th style="min-width: 57px; width: 57px;">头围</th>
              <th class="has-text-centered">检查结果</th>
              <th style="min-width: 108px; width: 108px;">时间</th>
              <th style="min-width: 63px; width: 63px;">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(report, index) in reports" :key="index">
              <!-- <td class="has-text-centered">{{ index+1 }}</td> -->
              <td>{{ report.age }}</td>
              <td>{{ report.weight }}&nbsp;{{ report.signalW }}</td>
              <td>{{ report.height }}&nbsp;{{ report.signalH }}</td>
              <td>{{ report.head }}&nbsp;{{ report.signalC }}</td>
              <td class="result">{{ report.result }}</td>
              <td>{{ report.time }}</td>
              <td>
                <span @click="deleteReport(report.id, index)" class="del"
                  >删</span
                >
                <span @click="edit(report)" class="edit">改</span>
              </td>
            </tr>
          </tbody>
        </table>
        <!-- detail table end -->
        <div class="modal is-active" id="about" v-if="editing">
          <div class="modal-background" @click="editing = false"></div>
          <div class="modal-content">
            <article
              class="message is-info"
              style="max-width: 600px; margin: auto;"
            >
              <div class="message-body">
                <div class="title">
                  编辑
                  <span @click="editing = false">
                    X
                  </span>
                </div>
                <div class="content">
                  年龄:&nbsp;<input
                    class="num-input"
                    type="text"
                    v-model="editReport.age"
                    name="age"
                    value=""
                    placeholder="年龄"
                  />
                  体重:&nbsp;<input
                    class="num-input"
                    type="number"
                    v-model="editReport.weight"
                    name="weight"
                    value=""
                    placeholder="体重"
                  />
                  <select v-model="editReport.signalW">
                    <option
                      v-for="(option, index) in optionList"
                      :key="index"
                      :value="option"
                      >{{ option }}</option
                    >
                  </select>
                  <br />身高:&nbsp;<input
                    class="num-input"
                    type="number"
                    v-model="editReport.height"
                    name="height"
                    value=""
                    placeholder="身高"
                  />
                  <select v-model="editReport.signalH">
                    <option
                      v-for="(option, index) in optionList"
                      :key="index"
                      :value="option"
                      >{{ option }}</option
                    >
                  </select>
                  头围:&nbsp;<input
                    class="num-input"
                    type="number"
                    v-model="editReport.head"
                    name="head"
                    value=""
                    placeholder="头围"
                  />
                  <select v-model="editReport.signalC">
                    <option
                      v-for="(option, index) in optionList"
                      :key="index"
                      :value="option"
                      >{{ option }}</option
                    >
                  </select>
                  结果:&nbsp;
                  <textarea
                    class="textarea"
                    v-model="editReport.result"
                    name="result"
                    value=""
                    placeholder="检查结果"
                  />
                  <br />
                  <button @click="update" class="button is-primary">
                    更新
                  </button>
                  <button
                    @click="
                      editing = false
                      editReport = {}
                    "
                    class="button"
                  >
                    取消
                  </button>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>

    <div class="charts">
      <div id="chart" style="width: 640px; height: 500px; margin: auto;"></div>
      <div id="chart2" style="width: 640px; height: 500px; margin: auto;"></div>
    </div>
  </div>
</template>

<script>
import base from '../../datastore/base'
import Editable from './Common/Editable.vue'
import EditParent from './Common/EditParent.vue'
import DangerLevel from './Common/DangerLevel.vue'
import echarts from 'echarts'
import fs from 'fs'
import path from 'path'
export default {
  name: 'enrty-detail',
  components: { Editable, EditParent, DangerLevel },
  computed: {
    uid: function() {
      return parseInt(this.$route.params.uid)
    }
  },
  data() {
    return {
      questionDeleteBoolean: false, // show model
      deleteInfo: {},
      today: new Date().toISOString().slice(0, 10),
      user: {}, // need init
      detail: {}, // need init
      reports: [], // need init
      addReport: {},
      editReport: {},
      editing: false,
      optionList: ['', '⊥', '╧', '↑', '⇑', '⤊', '⊤', '╤', '↓', '⇓', '⤋']
    }
  },
  beforeCreate: async function() {
    // initialize database
    var uid = parseInt(this.$route.params.uid)
    var res = await base.getDetailByUid(uid)
    // 无详情则进行初始化
    if (!res) {
      await base.initDetailByUid(uid)
      this.detail = await base.getDetailByUid(uid)
    } else {
      this.detail = res
    }
  },
  mounted: async function() {
    this.user = await base.getUserByUid(this.uid)
    this.reports = await base.getReportsByUid(this.uid)
    // sort reports by age
    this.reports.sort(this.sortFilter)
    // render line chart
    this.renderChart()
  },
  methods: {
    renderChart() {
      var myChart = echarts.init(document.getElementById('chart'))
      var myChart2 = echarts.init(document.getElementById('chart2'))
      var boy = JSON.parse(fs.readFileSync(path.join(__static, 'boy.json')))
      var girl = JSON.parse(fs.readFileSync(path.join(__static, 'girl.json')))
      const seq = ['+2', '+1', '0', '-1', '-2']
      var data = [
        {
          name: '宝宝',
          type: 'line',
          color: '#fbb8a1',
          data: Array(49).fill(null),
          connectNulls: true,
          smooth: true
        }
      ]
      var data2 = [
        {
          name: '宝宝',
          type: 'line',
          color: '#fbb8a1',
          data: Array(49).fill(null),
          connectNulls: true,
          smooth: true
        }
      ]
      let y, m, d, month
      var reports = this.reports
      reports.forEach(r => {
        var tmp = r.age.split('/')
        y = parseInt(tmp[0])
        m = parseInt(tmp[1])
        d = parseInt(tmp[2])
        month = y * 12 + m
        if (d > 15) month = month + 1
        data[0].data[month] = r.weight
        data2[0].data[month] = r.height
      })

      if (this.user.male === 'true') {
        seq.forEach(i => {
          data.push({
            name: `男孩${i}SD`,
            type: 'line',
            color: '#6fbae1',
            data: boy[`weight${i}`],
            connectNulls: true,
            smooth: true
          })
        })
      } else if (this.user.male === 'false') {
        seq.forEach(i => {
          data.push({
            name: `女孩${i}SD`,
            type: 'line',
            color: '#e58dc2',
            data: girl[`weight${i}`],
            connectNulls: true,
            smooth: true
          })
        })
      } else {
        data.push({
          name: `男孩0SD`,
          type: 'line',
          color: '#6fbae1',
          data: boy[`weight0`],
          connectNulls: true,
          smooth: true
        })
        data.push({
          name: `女孩0SD`,
          type: 'line',
          color: '#e58dc2',
          data: girl[`weight0`],
          connectNulls: true,
          smooth: true
        })
      }

      const option = {
        title: {
          text: '体重(kg)-月龄'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['男孩0SD', '女孩0SD', '宝宝']
        },
        color: ['#e58dc2', '#fbb8a1', '#90e5e7', '#6fbae1'],
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          feature: {
            dataZoom: {},
            restore: {},
            dataView: {},
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: [...Array(49).keys()]
        },
        yAxis: {
          type: 'value'
        },
        series: data
      }
      myChart.setOption(option)

      if (this.user.male === 'true') {
        seq.forEach(i => {
          data2.push({
            name: `男孩${i}SD`,
            type: 'line',
            color: '#6fbae1',
            data: boy[`height${i}`],
            connectNulls: true,
            smooth: true
          })
        })
      } else if (this.user.male === 'false') {
        seq.forEach(i => {
          data2.push({
            name: `女孩${i}SD`,
            type: 'line',
            color: '#e58dc2',
            data: girl[`height${i}`],
            connectNulls: true,
            smooth: true
          })
        })
      } else {
        data2.push({
          name: `男孩0SD`,
          type: 'line',
          color: '#6fbae1',
          data: boy[`height0`],
          connectNulls: true,
          smooth: true
        })
        data2.push({
          name: `女孩0SD`,
          type: 'line',
          color: '#e58dc2',
          data: girl[`height0`],
          connectNulls: true,
          smooth: true
        })
      }
      const option2 = {
        title: {
          text: '身高(cm)-月龄'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['男孩0SD', '女孩0SD', '宝宝']
        },
        color: ['#e58dc2', '#fbb8a1', '#90e5e7', '#6fbae1'],
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          feature: {
            dataZoom: {},
            restore: {},
            dataView: {},
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: [...Array(49).keys()]
        },
        yAxis: {
          type: 'value'
        },
        series: data2
      }
      myChart2.setOption(option2)
    },
    goBack() {
      window.history.go(-1)
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
    },
    newDetail() {
      var newData = {
        id: Date.now(),
        uid: this.uid,
        age: this.getAge(this.user.birth).parse,
        ...this.addReport,
        time: this.today
      }
      if (!this.addReport.weight || !this.addReport.height) return
      base.insertReport(newData)
      this.reports.push(newData)
      this.addReport = {}
    },
    deleteReport(id, i) {
      this.deleteInfo = { id: id, index: i }
      this.questionDeleteBoolean = true
    },
    edit(report) {
      this.editReport = report
      this.editing = true
    },
    update() {
      var id = this.editReport.id
      if (id) {
        base.updateReportById(this.editReport)
      }
      this.editing = false
    },
    deleteComfirm(e) {
      var id = this.deleteInfo.id
      var i = this.deleteInfo.index
      if (e === true) {
        this.reports.splice(i, 1)
        base.deleteReportById(id)
        console.log('DB@ uid: ' + this.uid + ' id: ' + id + ' removed!')
      }
      this.questionDeleteBoolean = false
    },
    sortFilter(a, b) {
      // 比较两个给定的report里age哪个大
      var atmp = a.age.split('/')
      var btmp = b.age.split('/')
      if (atmp[0] !== btmp[0]) {
        return atmp[0] > btmp[0] ? 1 : -1
      }
      if (atmp[1] !== btmp[1]) {
        return atmp[1] > btmp[1] ? 1 : -1
      }
      if (atmp[2] !== btmp[2]) {
        return atmp[2] > btmp[2] ? 1 : -1
      }
    }
  }
}
</script>

<style scoped>
#hero-body-detail {
  display: block;
  padding-top: 0rem;
}

#hero-head-detail {
  padding: 10px 39px;
}

.tabs.is-boxed a {
  border-radius: 0px;
}

.num-input {
  width: 88px;
}

.content input.num-input {
  width: 88px;
}

.del {
  color: red;
}

.edit {
  color: #008cd5;
}

.add {
  /* border: 1px solid #eee;
  margin: 10px 0; */
  padding-bottom: 15px;
}

input {
  border: 1px solid #ccc;
  padding: 5px;
  border-radius: 3px;
  margin-right: 15px;
}

select {
  border: 1px solid #ccc;
  padding: 5px;
  border-radius: 3px;
  margin-right: 15px;
  margin-bottom: 15px;
}

#mask {
  background: rgba(0, 0, 0, 0.5);
  width: 100%;
  height: 100%;
  position: fixed;
  z-index: 4;
  top: 0;
  left: 0;
}

.mask {
  width: 300px;
  height: 250px;
  background: rgba(255, 255, 255, 1);
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  z-index: 47;
  border-radius: 5px;
}

.title span {
  float: right;
  cursor: pointer;
}

.content {
  padding: 10px;
}

.content input {
  width: 270px;
  margin-bottom: 15px;
}

.result {
  word-break: break-all;
}

@media print {
  section {
    page-break-after: auto;
  }
}
</style>
