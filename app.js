import { scenes } from './scenes.js'

export const app = {
  data() {
    return {
      scenes: scenes,
      currentIndex: 0,
      isPlaying: false,
      isLoaded: false
    }
  },
  computed: {
    currentScene() {
      return this.scenes[this.currentIndex]
    },
    progressWidth() {
      return ((this.currentIndex + 1) / this.scenes.length) * 100
    }
  },
  methods: {
    nextScene() {
      if (this.currentIndex < this.scenes.length - 1) {
        this.currentIndex++
      }
    },
    previousScene() {
      if (this.currentIndex > 0) {
        this.currentIndex--
      }
    },
    toggleMusic() {
      const audio = this.$refs.bgMusic
      if (this.isPlaying) {
        audio.pause()
      } else {
        audio.play()
      }
      this.isPlaying = !this.isPlaying
    }
  },
  mounted() {
    // Préchargement des images
    Promise.all(this.scenes.map(scene => {
      return new Promise((resolve) => {
        const img = new Image()
        img.onload = resolve
        img.src = scene.img
      })
    })).then(() => {
      this.isLoaded = true
    })
  }
}