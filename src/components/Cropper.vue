<template>
  <!-- <button
    @click="crop"
    style="font-size: 2em; position: absolute; z-index: 10; left: 200px"
  >
    Crop
  </button> -->
  <vue-cropper ref="vueCropperRef" :src="imgSrc" alt="Source Image" />
</template>

<script setup lang="ts">
  import { ref, onMounted, withDefaults } from "vue"
  import VueCropper from "@ballcat/vue-cropper"
  import "cropperjs/dist/cropper.css"

  //https://github.com/ballcat-projects/vue-cropper

  // local
  const imgSrc = ref("the image path")
  const vueCropperRef = ref<any>(null) // InstanceType<typeof VueCropper> | any

  // props
  // const props = defineProps<{
  //   src: string
  //   imgWidth: number
  //   imgHeight: number
  // }>()

  // props with withdefaults using ts
  const props = withDefaults(
    defineProps<{
      src: string
      imgWidth: number
      imgHeight: number
      frameWidth: string | null
      frameHeight: string | null
    }>(),
    {
      src: "",
      imgWidth: 0,
      imgHeight: 0,

      frameWidth: "35%",
      frameHeight: "65%",
    }
  )

  // define emits with ts
  const emit = defineEmits<{
    (e: "crop", data: any): void
  }>()

  const toDecimal = (percent: string) => {
    return parseFloat(percent) / 100
  }

  // methods
  onMounted(() => {
    imgSrc.value = props.src!
    // {"x":221,"y":761,"width":1466,"height":398,"rotate":0,"scaleX":1,"scaleY":1}'

    setTimeout(() => {
      // x equals the width halved and subject half of its 80% width
      let percentWidth = toDecimal(props.frameWidth as string)
      let percentHeight = toDecimal(props.frameHeight as string)

      // find x by halving the width and subtracting half of the frame width
      let x = props.imgWidth / 2 - (props.imgWidth * percentWidth) / 2
      // find y by halving the height and subtracting half of the frame height
      let y = props.imgHeight / 2 - (props.imgHeight * percentHeight) / 2
      // find the width by multiplying the frame width by the image width
      let width = props.imgWidth * percentWidth
      // find the height by multiplying the frame height by the image height
      let height = props.imgHeight * percentHeight

      vueCropperRef.value.setData({
        x: x,
        y: y,
        width: width,
        height: height,
        rotate: 0,
        scaleX: 1,
        scaleY: 1,
      })

      vueCropperRef.value.getCroppedCanvas().toBlob((blob: any) => {
        // console.log(`blob`, blob)
        // const url = URL.createObjectURL(blob)
        // window.open(url)

        //emit crop event with ts
        emit("crop", blob)
      })
    }, 50)
  })

  // const crop = () => {
  //   if (vueCropperRef.value) {
  //     const data = vueCropperRef.value.getData(true)
  //     console.log(`output->data`, data)
  //   }
  // }
</script>

<style></style>
