<script lang="ts">
  import { defineComponent, ref, onUnmounted, computed } from "vue"
  import Camera from "simple-vue-camera" // https://www.npmjs.com/package/simple-vue-camera

  export default defineComponent({
    components: {
      Camera,
    },
    // define props width and height with defaults with ts
    props: {
      instructionText: {
        type: String,
        default: "Position label inside the frame",
      },
      showDevicesList: {
        type: Boolean,
        default: false,
      },
      cameraWidth: {
        type: Number,
        default: 1920,
      },
      cameraHeight: {
        type: Number,
        default: 1920,
      },
      frameWidth: {
        type: String,
        default: "50%",
      },
      frameHeight: {
        type: String,
        default: "50%",
      },
    },
    emits: ["snap", "cameraReady"],
    expose: ["snapshot", "getDevices", "changeCamera", "getFrameDimensions"],
    setup(props, { emit }) {
      const camera: any = ref(null)
      const devices: any = ref()
      const isCameraReady = ref<boolean>(false)
      const camResWidth = ref<number>(props.cameraWidth)
      const camResHeight = ref<number>(props.cameraHeight)
      const frameWidth = ref<string>(props.frameWidth)
      const frameHeight = ref<string>(props.frameHeight)
      const instructionText = ref(props.instructionText)

      // Camera starting
      // const start = async () => {
      //   await camera.value?.start()
      // }
      const started = async () => {
        console.log("camera started")
        isCameraReady.value = true
        emit("cameraReady", true)
        devices.value = await camera.value?.devices(["videoinput"])
      }

      const stopped = async () => {
        console.log("camera stopped")
        isCameraReady.value = false
        emit("cameraReady", false)
      }

      const error = (error: any) => {
        console.log(error)
      }

      // Capture photo
      const snapshot = async () => {
        const blob = await camera.value?.snapshot()
        const url = URL.createObjectURL(blob)

        // include frame dimensions
        const frame = document.querySelector(".picture-frame")

        emit("snap", url, frame?.clientWidth, frame?.clientHeight)
      }

      // function to expose devices to parent with ts
      const getDevices = () => {
        if (isCameraReady.value == false) return []
        return devices.value
      }

      const changeCamera = async (event: any) => {
        //const device = devices[0];
        await camera.value?.changeCamera(event.target.value)
      }

      const getFrameDimensions = () => {
        const frame = document.querySelector(".picture-frame")
        return {
          width: frame?.clientWidth,
          height: frame?.clientHeight,
        }
      }

      return {
        camera,
        //start,
        snapshot,
        devices,
        screen,
        isCameraReady,
        instructionText,
        camWidth: camResWidth,
        camHeight: camResHeight,
        frameWidth,
        frameHeight,
        // getframeWidth,
        // getframeHeight,
        started,
        stopped,
        error,
        getDevices,
        changeCamera,
        getFrameDimensions,
      }
    },
  })
</script>

<template>
  <camera
    :resolution="{ width: camWidth, height: camHeight }"
    ref="camera"
    :autoplay="true"
    :playsinline="true"
    @started="started"
    @stopped="stopped"
    @error="error"
  >
    <slot>
      <!-- picture frame in center -->
      <div
        v-if="isCameraReady"
        class="picture-frame"
        :style="{ width: frameWidth, height: frameHeight }"
      >
        <div class="frame-helptext">{{ instructionText }}</div>
        <!-- small square with white border -->
        <div class="frame-corner-1"></div>
        <div class="frame-corner-2"></div>
        <div class="frame-corner-3"></div>
        <div class="frame-corner-4"></div>
      </div>
      <select
        v-if="isCameraReady && showDevicesList"
        @change="changeCamera"
        style="font-size: 2em"
      >
        <option>Choose Camera</option>
        <option
          v-for="device in devices"
          :value="device.deviceId"
          @change="changeCamera"
        >
          {{ device.label }}
        </option>
      </select>
      <button
        v-if="isCameraReady"
        class="camera-button"
        @click="snapshot"
        style="font-size: 2em"
      >
        Capture
      </button>
    </slot>
  </camera>
</template>

<style>
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
    border: 1px solid #fff;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    /* width: 80%;
    height: 20%; */
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
