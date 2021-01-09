<template>
  <div id="wrapper">
    <section class="hero is-white is-fullheight">
      <!-- Hero content: will be in the middle -->
      <div class="hero-body" id="hero-body">
        <div class="columns">
          <div class="column is-half">
            <label class="label">更新操作:</label>
            <div class="field has-addons">
              <div class="control">
                <input class="input" type="number" placeholder="⚡Uid" v-model="uid">
              </div>
              <div class="control">
                <a class="button is-info" @click="load()">加载</a>
              </div>
            </div>

            <div class="field">
              <label class="label">宝宝姓名:</label>
              <div class="control">
                <input class="input" type="text" name="baby" id="baby" placeholder="👶Baby" v-model="baby">
              </div>
            </div>
            <div class="field">
              <label class="label">产妇姓名:</label>
              <div class="control">
                <input class="input is-info" type="text" name="name" id="name" placeholder="👩Name" v-model="name">
              </div>
              <p class="help is-danger" id='req-name' style="display: none;">* 该项不能为空</p>
            </div>
            <div class="field">
              <label class="label">联系电话:</label>
              <div class="control">
                <input class="input is-info" type="tel" name="tele" id="tele" placeholder="📞Telephone" v-model="tele">
              </div>
              <p class="help is-danger" id='req-tele' style="display: none;">* 该项不能为空</p>
            </div>
            <div class="field">
              <div class="control">
                <span><b>性别:&nbsp;&nbsp;</b></span>
                <label class="radio">
                  <input type="radio" name="male" value="true" id="male" v-model="male">
                  男
                </label>
                <label class="radio">
                  <input type="radio" name="male" value="false" checked v-model="male">
                  女
                </label>
              </div>
            </div>

          </div>
          <!-- column separator -->
          <div class="column is-half">
            <!-- <h3 class="title">&nbsp;</h3> -->
            <div class="field">
              <label class="label">出生日期</label>
              <div class="control">
                <input class="input is-info" type="date" name="birth" id="birth" v-model="birth" min="1990-01-01" max="2222-02-22">
              </div>
              <p class="help is-danger" id='req-birth' style="display: none;">* 该项不能为空</p>
            </div>
            <div class="field">
              <label class="label">纠正胎龄</label>
              <div class="control">
                <input class="input" type="date" name="fixed" id="fixed" v-model="fixed" min="1990-01-01" max="2222-02-02">
              </div>
            </div>

            <div class="field">
              <label class="label">备注:</label>
              <div class="control">
                <textarea class="textarea" name="note" id="note" placeholder="🖋Textarea" v-model="note"></textarea>
              </div>
            </div>

            <div class="field">
              <div class="control">
                <span><b>高危儿:&nbsp;&nbsp;</b></span>
                <label class="radio">
                  <input type="radio" name="level" value="false" checked v-model="danger">
                  否
                </label>
                <label class="radio">
                  <input type="radio" name="level" value="1" id="level" v-model="level">
                  Ⅰ类
                </label>
                <label class="radio">
                  <input type="radio" name="level" value="2" id="level" v-model="level">
                  Ⅱ类
                </label>
                <label class="radio">
                  <input type="radio" name="level" value="3" id="level" v-model="level">
                  Ⅲ类
                </label>
              </div>
            </div>

            <div class="field is-grouped">
              <div class="control">
                <button class="button is-primary" @click="submitButton()">提交</button>
              </div>
              <div class="control">
                <button class="button is-link is-warning" @click="reset()">清除</button>
              </div>
            </div>
          </div>
        </div>
        
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
              <li><a href="#/tele">🌟</a></li>
              <li class="is-active"><a href='#/inserter'>Inserter</a></li>
              <li><a href='#/selector'>Selector</a></li>
            </ul>
          </div>
        </nav>
      </div>
    </section>
  </div>
</template>

<script>
  import db from '../../datastore/index'
  const {dialog} = require('electron').remote
  export default {
    name: 'insert-page',
    data () {
      return {
        uid: '',
        name: '',
        baby: '',
        birth: '',
        fixed: '',
        tele: '',
        note: '',
        danger: 'false',
        male: 'null',
        level: '0'
      }
    },
    methods: {
      submitButton () {
        if (!this.uid) {
          if (this.insert()) {
            window.location.hash = '#/detail/' + this.uid
            this.reset()
          }
        } else {
          if (this.update()) {
            window.location.hash = '#/detail/' + this.uid
            this.reset()
          }
        }
      },
      reset () {
        this.uid = ''
        this.name = ''
        this.baby = ''
        this.birth = ''
        this.fixed = ''
        this.tele = ''
        this.note = ''
        this.danger = 'false'
        this.male = 'null'
        this.level = '0'
        this.inputRequired(false)
      },
      statusBar (bool) {
        if (bool === true) {
          document.getElementById('status').children[0].style.display = 'flex'
          setTimeout(function () { document.getElementById('status').children[0].style.display = 'none' }, 1500)
          return true
        } else {
          document.getElementById('status').children[1].style.display = 'flex'
          setTimeout(function () { document.getElementById('status').children[1].style.display = 'none' }, 1500)
          return false
        }
      },
      checkReq (name, birth, tele) {
        console.log('DB@ checking validation')
        if (name === '' || birth === '' || tele === '') {
          this.inputRequired(true)
        } else {
          this.inputRequired(false)
          console.log('DB@ checking validation true')
          return true
        }
        return false
      },
      inputRequired (judge) {
        var input = ['name', 'birth', 'tele']
        var pp = ['req-name', 'req-birth', 'req-tele']
        if (judge) {
          for (var i in input) {
            document.getElementById(input[i]).classList.remove('is-info')
            document.getElementById(input[i]).classList.add('is-danger')
          }
          for (var p in pp) {
            document.getElementById(pp[p]).style.display = 'flex'
          }
        } else {
          for (var k in input) {
            document.getElementById(input[k]).classList.remove('is-danger')
            document.getElementById(input[k]).classList.add('is-info')
          }
          for (var j in pp) {
            document.getElementById(pp[j]).style.display = 'none'
          }
        }
      },
      insert () {
        db.read()
        if (this.checkReq(this.name, this.birth, this.tele)) {
          // 必要属性已输入
          const tmp = db.get('users').find({ baby: this.baby, birth: this.birth }).value()
          if (tmp) {
            // 相同的出生日期同名宝宝
            dialog.showMessageBox({
              type: 'error',
              message: '插入失败',
              detail: this.birth + '出生日期已有宝宝' + this.baby + '\nUID:' + tmp.uid
            })
            return this.statusBar(false)
          }
          var increase = db.get('increase').value() + 1
          this.uid = increase
          db.get('users').push({
            uid: increase,
            name: this.name,
            baby: this.baby,
            male: this.male,
            birth: this.birth,
            fixed: this.fixed,
            tele: this.tele,
            note: this.note,
            danger: (this.level === '0') ? false : true,
            level: this.level
          }).write()
          db.update('increase', n => n + 1).write()
          console.log('DB@ inserted new data')
          return this.statusBar(true)
        }
        return this.statusBar(false)
      },
      load () {
        var uid = parseInt(this.uid)
        var res = db.get('users').find({ uid: uid }).value()
        if (res) {
          this.name = res.name
          this.baby = res.baby
          this.male = res.male
          this.birth = res.birth
          this.fixed = res.fixed
          this.tele = res.tele
          this.note = res.note
          this.danger = res.danger
          this.level = res.level
          if (typeof this.male === 'boolean') {
            this.male = 'null'
          } // 防止之前的bug导致的数据库放布尔值
          this.statusBar(true)
        } else {
          this.statusBar(false)
        }
      },
      update () {
        if (this.uid) {
          if (!this.checkReq(this.name, this.birth, this.tele)) return false
          var uid = parseInt(this.uid)
          var changed = {
            uid: uid,
            name: this.name,
            baby: this.baby,
            birth: this.birth,
            fixed: this.fixed,
            tele: this.tele,
            note: this.note,
            male: this.male,
            level: this.level
          }
          switch (typeof this.danger) {
            case 'string':
              // 点过后该值为字符串
              changed.danger = (this.danger === 'true')
                ? true
                : false
              break
            case 'boolean':
              // 加载后未点击则仍为布尔值
              changed.danger = this.danger
              break
            default:
              changed.danger = null
              break
          }
          if (!db.get('users').find({uid: uid}).value()) {
            dialog.showMessageBox({
              type: 'error',
              message: '未找到对应UID',
              detail: '如果进行插入操作, 请勿输入Uid.\n\n如果进行更新操作, 输入用户Uid后点击蓝色加载按钮后更改.'
            })
            return this.statusBar(false)
          }
          db.get('users').find({uid: uid}).assign(changed).write()
          console.log('DB@ updated uid: ' + this.uid)
          return this.statusBar(true)
        }
        return this.statusBar(false)
      }

    },
    watch: {
      // 监听`level`的改变
      level: function (newLevel, oldLevel) {
        if (newLevel !== '0') {
          this.danger = 'true'
        }
      },
      danger: function (newDanger, oldDanger) {
        if (newDanger === 'false') {
          this.level = '0'
        }
      }
    }
  }
</script>

<style>
#hero-body {
  display: block;
}

#status button {
  border-radius: unset;
  display: none;
  height: 41px;
  margin: 0px;
  position: fixed;
  bottom: 0px;
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

@media screen and (max-width: 768px) {
  h3.title {
    display: none;
  }
  #hero-body {
    padding-top: 24px;
    padding-bottom: 0px;
  }
}
</style>
