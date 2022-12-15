<script setup lang="ts">
  import { nextTick, ref, onMounted } from "vue"
  import SimpleCamera from "@/components/SimpleCamera.vue"
  import Cropper from "@/components/Cropper.vue"

  // props: startingScreen (number) with default 0
  const props = defineProps({
    startingScreen: {
      type: Number,
      default: 1,
    },
  })

  // onMounted set the currentScreen to the startingScreen prop
  onMounted(() => {
    currentScreen.value = props.startingScreen
  })

  // refs
  const camera = ref<InstanceType<typeof SimpleCamera>>()
  // UI state
  const screen = ["videoinput", "camera", "review"]
  const currentScreen = ref(0)
  const isCameraReady = ref(false)
  const devices = ref()
  const showCropper = ref(false)
  // camera dimensions
  const width = ref(1920)
  const height = ref(1920)
  // crop dimensions
  const cropWidth = ref("90%")
  const cropHeight = ref("45%")
  // blobs
  const photoFromCamera = ref()
  const photoCropped = ref()

  const nextScreen = (screenNumber?: number) => {
    if (screenNumber) {
      currentScreen.value = screenNumber
    } else {
      currentScreen.value++
    }
  }

  const onCameraReady = (status: boolean) => {
    //console.log(`output->status`, status)
    isCameraReady.value = status
  }

  // frameDimensions is an object with width and height
  const onSnap = (photo: string, frameWidth: number, frameHeight: number) => {
    // console.log(`output->frameWidth`, frameWidth)
    // console.log(`output->frameHeight`, frameHeight)
    photoFromCamera.value = photo
    //showCropper.value = true // cropper gets to work
    nextScreen()
  }

  const displayCropped = (blob: any) => {
    const url = URL.createObjectURL(blob)
    photoCropped.value = url
    showCropper.value = false
    // on next tick switch screen
    setTimeout(() => {
      nextScreen(2)
    }, 500)
  }

  const requestPhoto = () => {
    try {
      ;(window as any).onSavePhoto(photoCropped.value)
    } catch (error) {
      console.log(`error`, error)
    }
  }
</script>

<template>
  <div v-show="screen[currentScreen] == 'videoinput'">
    <button @click="nextScreen()" style="font-size: 2em">Start</button><br />
    width: <input type="input" v-model="width" /> <br />
    height: <input type="input" v-model="height" /><br />
  </div>
  <div v-if="screen[currentScreen] == 'camera'">
    <div v-if="!isCameraReady">
      <h1>Starting camera</h1>
    </div>

    <SimpleCamera
      ref="camera"
      @cameraReady="onCameraReady"
      @snap="onSnap"
      :frameWidth="cropWidth"
      :frameHeight="cropHeight"
    ></SimpleCamera>

    <!-- <div>
      devices:
      <pre>{{ devices }}</pre>
    </div> -->
  </div>
  <div v-if="screen[currentScreen] == 'review'">
    <!-- <button
      @click="currentScreen--"
      style="font-size: 2em; position: absolute; z-index: 10"
    >
      Back
    </button> -->
    <img class="photo-preview" :src="photoCropped" />
    <Cropper
      v-show="showCropper"
      :src="photoFromCamera"
      :imgWidth="width"
      :imgHeight="height"
      :frameWidth="cropWidth"
      :frameHeight="cropHeight"
      @crop="displayCropped"
    ></Cropper>
    <button @click="currentScreen--" style="font-size: 2em">
      Retake Photo
    </button>
    <button @click="requestPhoto" style="font-size: 2em; float: right">
      Save Photo
    </button>
  </div>
</template>

<style>
  .photo-preview {
    width: 100%;
    height: auto;
  }
</style>
