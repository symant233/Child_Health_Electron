<template>
  <span id="danger-level">
    <template v-if="!user.danger">&nbsp;</template>
    <template v-else-if="user.danger && !user.level">⭕</template>
    <template v-else>
      <template v-if="user.level === '1'">Ⅰ</template>
      <template v-if="user.level === '2'">Ⅱ</template>
      <template v-if="user.level === '3'">Ⅲ</template>
    </template>
  </span>
</template>

<script>
import db from '../../../datastore/'
export default {
  name: 'danger-level',
  props: ['user'] // { uid: Int, danger: String, level: String }
}
</script>

<style scoped>
#danger-level {
  color: red;
}

</style>
