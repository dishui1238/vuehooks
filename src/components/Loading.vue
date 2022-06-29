<template>
  <div class="loading-wrapper">
    <a-spin size="large" />
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  import ASpin from 'ant-design-vue/lib/spin'

  export default defineComponent({
    name: 'Loading',
    components: {
      ASpin,
    },
  })
</script>

<style lang="stylus" scoped>
  .loading-wrapper
    position fixed
    top 0
    left 0
    right 0
    bottom 0
    z-index 9999
    display flex
    align-items center
    justify-content center
    opacity 0.8
    background #FFF
</style>
