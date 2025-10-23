import { scenes } from './scenes.js'

export const app = {
  data() {
    return {
      scenes: scenes,
      currentIndex: 0,
      isPlaying: false,
      isLoaded: false,
      displayedText: "",
      typingInterval: null,
      narrationAudio: null
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
  watch: {
    currentIndex() {
      this.startTyping()
    }
  },
  methods: {
    playNarration() {
      if (this.narrationAudio) {
        this.narrationAudio.pause();
        this.narrationAudio = null;
      }

      const audioPath = `assets/audio/${this.currentIndex + 1}.mp3`;
      this.narrationAudio = new Audio(audioPath);
      this.narrationAudio.volume = 0.95;
      this.narrationAudio.play().catch(error => {
        console.error('Erreur de lecture:', error);
      });
    },

    nextScene() {
      if (this.currentIndex < this.scenes.length - 1) {
        this.currentIndex++;
        this.playNarration(); // Jouer l'audio de la nouvelle scène
      }
    },

    previousScene() {
      if (this.currentIndex > 0) {
        this.currentIndex--;
        this.playNarration(); // Jouer l'audio de la nouvelle scène
      }
    },

    toggleMusic() {
      const audio = this.$refs.bgMusic
      if (this.isPlaying) {
        audio.pause()
      } else {
        audio.volume = 0.2;
        audio.play()
      }
      this.isPlaying = !this.isPlaying
    },
    startTyping() {
      // Efface le texte précédent et stoppe l'ancien timer
      clearInterval(this.typingInterval)
      this.displayedText = ""
      const fullText = this.currentScene.text
      let i = 0
      this.typingInterval = setInterval(() => {
        if (i < fullText.length) {
          this.displayedText += fullText[i]
          i++
        } else {
          clearInterval(this.typingInterval)
        }
      }, 40) // Vitesse plus rapide (8 ms par lettre)
    } 
  },
  mounted() {
    // Préchargement des images
    Promise.all(this.scenes.map(scene => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = resolve;
        img.src = scene.img;
      });
    })).then(() => {
      this.isLoaded = true;
      this.startTyping();
      
      // Attendre 1 seconde puis lancer le premier audio
      setTimeout(() => {
        const firstAudio = new Audio('assets/audio/1.mp3');
        firstAudio.volume = 0.95;
        firstAudio.play();
      }, 1000);
    });
  }
}