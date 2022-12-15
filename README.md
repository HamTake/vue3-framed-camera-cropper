# Vue3-Framed-Camera-Cropper

An example of a camera running in Vue 3 with a framed portion to be cropped
for the final result. [Online Demo](https://beta.heroharmony.com/experiments/vue-camera/)

## Coding Concepts Covered

- /src/components/SimpleCamera.vue, uses basic Script hook
- /src/components/Cropper.vue, uses Script Setup
- /src/App.vue and index.html demos how Vue3 can communicate with outside parent
  - utilizing window, pickup a textMessage inside Vue
  - call JS functions outside, like sending the Photo to parent

## Known Shortcomings

- The camera resolution is given a fixed width and height
- No capability to retrieve device's max resolution?
- Framed area for cropping is a string percentage for now
- A number of props are given defaults, but not nessarily utilized in this example

## Project Notes

- Vue 3 / Vite
- TypeScript
- Composition API

## Packages Used

- [simple-vue-camera](https://github.com/BastiaanJansen/simple-vue-camera)
- [vue-cropper](https://github.com/ballcat-projects/vue-cropper)

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```
