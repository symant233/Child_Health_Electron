<template>
  <div id="wrapper">
    <section class="hero is-white is-fullheight">
      <!-- Hero content: will be in the middle -->
      <div class="hero-body" id="hero-body">
        <div class="columns">
          <div class="column is-half">
            <h3 class="title">Inserter:</h3>
            <div class="field">
              <label class="label">产妇姓名</label>
              <div class="control">
                <input class="input is-info" type="text" name="name" id="name" placeholder="👩Name">
              </div>
              <p class="help is-danger" id='req-name' style="display: none;">* 该项不能为空</p>
            </div>

            <div class="field">
              <label class="label">宝宝姓名</label>
              <div class="control">
                <input class="input" type="text" name="baby" id="baby" placeholder="👶Baby">
              </div>
            </div>

            <div class="field">
              <label class="label">出生日期</label>
              <div class="control">
                <input class="input is-info" type="date" name="birth" id="birth">
              </div>
              <p class="help is-danger" id='req-birth' style="display: none;">* 该项不能为空</p>
            </div>

            <div class="field">
              <label class="label">纠正胎龄</label>
              <div class="control">
                <input class="input" type="date" name="fixed" id="fixed">
              </div>
            </div>

          </div>
          <!-- column separator -->
          <div class="column is-half">
            <h3 class="title">&nbsp;</h3>
            <div class="field">
              <label class="label">联系电话:</label>
              <div class="control">
                <input class="input is-info" type="tel" name="tele" id="tele" placeholder="📞Telephone">
              </div>
              <p class="help is-danger" id='req-tele' style="display: none;">* 该项不能为空</p>
            </div>

            <div class="field">
              <label class="label">备注:</label>
              <div class="control">
                <textarea class="textarea" name="note" id="note" placeholder="🖋Textarea"></textarea>
              </div>
            </div>

            <div class="field">
              <div class="control">
                <span><b>高危儿:&nbsp;&nbsp;</b></span>
                <label class="radio">
                  <input type="radio" name="danger" value="true" id="danger">
                  Yes
                </label>
                <label class="radio">
                  <input type="radio" name="danger" value="false" checked>
                  No
                </label>
              </div>
            </div>

            <div class="field is-grouped">
              <div class="control">
                <button class="button is-primary" @click="insert()?reset():false">提交</button>
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
              <li><a href="#/">Home</a></li>
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
  export default {
    name: 'insert-page',
    methods: {
      reset () {
        document.getElementById('name').value = ''
        document.getElementById('baby').value = ''
        document.getElementById('birth').value = ''
        document.getElementById('fixed').value = ''
        document.getElementById('tele').value = ''
        document.getElementById('note').value = ''
        document.getElementById('danger').checked = false
      },
      insert () {
        function inputRequired (judge, input, pp) {
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
        }
        function checkReq (name, birth, tele) {
          console.log('DB@ checking validation')
          var input = ['name', 'birth', 'tele']
          var pp = ['req-name', 'req-birth', 'req-tele']
          if (name === '' || birth === '' || tele === '') {
            inputRequired(true, input, pp)
          } else {
            inputRequired(false, input, pp)
            console.log('DB@ checking validation true')
            return true
          }
          return false
        }
        var name = document.getElementById('name').value
        var baby = document.getElementById('baby').value
        var birth = document.getElementById('birth').value
        var fixed = document.getElementById('fixed').value
        var tele = document.getElementById('tele').value
        var note = document.getElementById('note').value
        var danger = document.getElementById('danger').checked
        if (checkReq(name, birth, tele)) {
          var increase = db.read().get('increase').value() + 1
          db.get('users').push({
            uid: increase,
            name: name,
            baby: baby,
            birth: birth,
            fixed: fixed,
            tele: tele,
            note: note,
            danger: danger
          }).write()
          db.update('increase', n => n + 1).write()
          console.log('DB@ inserted new data')
          document.getElementById('status').children[0].style.display = 'flex'
          setTimeout(function () { document.getElementById('status').children[0].style.display = 'none' }, 1500)
          return true
        }
        return false
      },
      open (link) {
        this.$electron.shell.openExternal(link)
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
