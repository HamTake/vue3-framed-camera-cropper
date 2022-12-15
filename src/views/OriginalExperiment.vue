<script lang="ts">
  import { defineComponent, ref } from "vue"
  import Camera from "simple-vue-camera"

  // vue-cropper
  import Cropper from "../components/Cropper.vue"

  export default defineComponent({
    components: {
      Camera,
      Cropper,
    },
    setup() {
      const camera: any = ref(null)
      const devices: any = ref()
      const screen: Array<string> = ["videoinput", "camera", "review"]
      const currentScreen = ref(0)
      const photo = ref()
      const photoForCropper = ref()
      const isCameraReady = ref(false)
      const width = ref(1920)
      const height = ref(1920)
      const showCropper = ref(false)

      // Camera starting
      const start = async () => {
        await camera.value?.start()
      }
      const started = async () => {
        console.log("started")
        isCameraReady.value = true
        devices.value = await camera.value?.devices(["videoinput"])
      }

      // Capture photo
      const snapshot = async () => {
        const blob = await camera.value?.snapshot()

        const url = URL.createObjectURL(blob)
        photoForCropper.value = url
        currentScreen.value = 2
        //showCropper.value = true

        // open image new new tab
        // const url = URL.createObjectURL(blob)
        // window.open(url)
      }

      const error = (error: any) => {
        console.log(error)
      }

      const nextScreen = () => {
        if (currentScreen.value + 1 == 1) {
          console.log("starting camera")
        }
        currentScreen.value++
      }

      const changeCamera = async (event: any) => {
        //const device = devices[0];
        alert("device: " + event.target.value)
        await camera.value?.changeCamera(event.target.value)
      }

      const displayCropped = (blob: any) => {
        const url = URL.createObjectURL(blob)
        // window.open(url)
        showCropper.value = false
        photo.value = url
      }

      return {
        camera,
        start,
        snapshot,
        devices,
        screen,
        currentScreen,
        isCameraReady,
        photo,
        photoForCropper,
        width,
        height,
        started,
        error,
        nextScreen,
        changeCamera,
        displayCropped,
        showCropper,
      }
    },
  })
</script>

<template>
  <div v-show="screen[currentScreen] == 'videoinput'">
    <button @click="nextScreen" style="font-size: 2em">Start</button><br />
    width <input type="input" v-model="width" /> <br />
    height
    <input type="input" v-model="height" /><br />
  </div>
  <div v-if="screen[currentScreen] == 'camera'">
    <div v-if="!isCameraReady">
      <h1>Starting camera...</h1>
    </div>

    <camera
      :resolution="{ width: width, height: height }"
      ref="camera"
      :autoplay="true"
      :playsinline="true"
      @started="started"
      @error="error"
    >
      <!-- picture frame in center -->
      <div v-if="isCameraReady" class="picture-frame">
        <div class="frame-helptext">simple-vue-camera</div>
        <!-- small square with white border -->
        <div class="frame-corner-1"></div>
        <div class="frame-corner-2"></div>
        <div class="frame-corner-3"></div>
        <div class="frame-corner-4"></div>
      </div>
      <button @click="currentScreen--" style="font-size: 2em">Back</button>
      <select @change="changeCamera" style="font-size: 2em">
        <option>Choose Camera</option>
        <option
          v-for="device in devices"
          :value="device.deviceId"
          @change="changeCamera"
        >
          {{ device.label }}
        </option>
      </select>
      <button class="camera-button" @click="snapshot" style="font-size: 2em">
        Capture
      </button>
    </camera>

    <div>
      devices:
      <pre>{{ devices }}</pre>
    </div>
  </div>
  <div v-if="screen[currentScreen] == 'review'">
    <button
      @click="currentScreen--"
      style="font-size: 2em; position: absolute; z-index: 10"
    >
      Back
    </button>
    <img class="photo-preview" :src="photo" />
    <Cropper
      v-show="showCropper"
      :src="photoForCropper"
      :imgWidth="width"
      :imgHeight="height"
      @crop="displayCropped"
    ></Cropper>
    <button @click="currentScreen--" style="font-size: 2em">Back</button>
  </div>
</template>

<style>
  .photo-preview {
    width: 100%;
    height: auto;
  }
  .camera-button {
    position: absolute;
    bottom: 0px;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #fff;
    border: none;
    border-radius: 10px;
    height: 50px;
    font-size: 1.5rem;
    font-weight: 700;
    color: #000;
  }
  .picture-frame {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80%;
    height: 20%;
    min-height: 114px;
  }
  .frame-helptext {
    position: relative;
    top: -20px;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #fff;
    font-size: 1.5rem;
    font-weight: 700;
  }
  .frame-corner-1 {
    border-left: 4px solid #fff;
    border-top: 4px solid #fff;
    position: absolute;
    top: 0;
    left: 0;
    width: 14px;
    height: 14px;
  }
  .frame-corner-2 {
    border-right: 4px solid #fff;
    border-top: 4px solid #fff;
    position: absolute;
    top: 0;
    right: 0;
    width: 14px;
    height: 14px;
  }
  .frame-corner-3 {
    border-left: 4px solid #fff;
    border-bottom: 4px solid #fff;
    position: absolute;
    bottom: 0;
    left: 0;
    width: 14px;
    height: 14px;
  }
  .frame-corner-4 {
    border-right: 4px solid #fff;
    border-bottom: 4px solid #fff;
    position: absolute;
    bottom: 0;
    right: 0;
    width: 14px;
    height: 14px;
  }
</style>
