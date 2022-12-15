<script setup lang="ts">
  import { RouterView } from "vue-router"

  import { ref, onMounted, onUnmounted } from "vue"

  // on mounted, console log message from index.html
  onMounted(() => {
    ///console.log(window.testMessage)

    // example of sending content to frame on index.html
    // const frame = document.getElementById("myFrame")
    // if (frame) {
    //   frame.innerHTML = "Hello from Vue 3!"
    // }

    try {
      ;(window as any).myAlert("Hello from Vue 3!") // talking to function on parent window
    } catch (error) {
      console.log(error)
    }
  })
</script>

<template>
  <RouterView />
</template>

<style scoped></style>
