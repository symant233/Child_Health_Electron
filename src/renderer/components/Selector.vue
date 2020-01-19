<template>
</template>

<script>
  export default {
    name: 'select-page',
    methods: {
      open (link) {
        this.$electron.shell.openExternal(link)
      }
    }
  }
</script>

<style>
</style>
