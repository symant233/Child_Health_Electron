<template>
  <div>
    <div v-show="!editing">
      <label @dblclick="editing=true;">{{ message }}</label>
    </div>
    <input
      v-show="editing"
      v-model="message"
      v-on:blur="editing=false; doUpdate();"
      @keyup.enter="editing=false;"
      @keyup.esc="esc=true; editing=false;"
    />
  </div>
</template>

<script>
import db from '../../../datastore/'
export default {
  name: 'editable',
  props: ['obj'], // obj: { uid: Int, key: String, value: String }
  data () {
    return {
      message: this.obj.value,
      last: this.obj.value, // 记忆上一次更改
      editing: false,
      esc: false // 是否是ESC退出
    }
  },
  methods: {
    doUpdate () {
      if (!this.esc && this.obj.uid) {
        if (this.last === this.message) return
        this.last = this.message
        // db update
        var uid = parseInt(this.obj.uid)
        var changed = { [this.obj.key]: this.message }
        db.get('users').find({uid: uid}).assign(changed).write()
        console.log('DB@ updated uid: ' + uid)
      } else {
        this.message = this.last
      }
    }
  }
}
</script>

<style></style>
