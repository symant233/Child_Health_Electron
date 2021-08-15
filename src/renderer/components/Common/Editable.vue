<template>
  <div>
    <div v-show="!editing">
      <label @dblclick="editing = true">
        {{ message ? message : 'null' }}
      </label>
    </div>
    <!-- prettier-ignore -->
    <input
      class="editable-input"
      v-show="editing"
      v-model="message"
      v-on:blur="editing = false; doUpdate()"
      @keyup.enter="editing = false"
      @keyup.esc="esc = true; editing = false"
    />
  </div>
</template>

<script>
import base from '../../../datastore/base'
export default {
  name: 'editable',
  props: ['obj'], // obj: { uid: Int, key: String, value: String }
  data() {
    return {
      message: this.obj.value,
      last: this.obj.value, // 记忆上一次更改
      editing: false,
      esc: false // 是否是ESC退出
    }
  },
  methods: {
    async doUpdate() {
      if (!this.esc && this.obj.uid) {
        if (this.last === this.message) return
        this.last = this.message
        // database update
        var uid = parseInt(this.obj.uid)
        await base.updateUserProperty(uid, this.obj.key, this.message)
        console.log('DB@ updated uid: ' + uid)
      } else {
        this.message = this.last
      }
    }
  },
  watch: {
    obj: function(newLevel, oldLevel) {
      this.message = this.obj.value
    }
  }
}
</script>

<style scoped>
.editable-input {
  width: 90px;
}
</style>
