<template>
  <div id="wrapper">
      <div class="left-side">
        <span class="title">
          Inserter!
        </span>
      </div>

      <div class="right-side">
      </div>
  </div>
</template>

<script>
  import db from '../../datastore/index'

  export default {
    name: 'inserter-page',
    methods: {
      open (link) {
        this.$electron.shell.openExternal(link)
      }
    }
  }
</script>

<style>
</style>
