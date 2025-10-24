import { scenes } from './scenes.js'

// ----- Export de l'objet Vue (app) -----
// Structure : data, computed, watch, methods, mounted
export const app = {
  // ----- Etat local (data) -----
  data() {
    return {
      scenes: scenes,
      currentIndex: 0,
      isPlaying: false,
      isLoaded: false,
      displayedText: "",
      typingInterval: null,
      narrationAudio: null,
      foundChevreaux: [],
      canGoNext: true,
      caillouxInVentre: [],
      draggedCaillou: null
    }
  },

  // ----- Calculés (computed) -----
  computed: {
    currentScene() {
      return this.scenes[this.currentIndex]
    },
    progressWidth() {
      return ((this.currentIndex + 1) / this.scenes.length) * 100
    },
    caillouxRestants() {
      if (!this.currentScene.cailloux) return []
      return this.currentScene.cailloux.filter(c => !this.caillouxInVentre.some(c2 => c2.id === c.id))
    }
  },

  // ----- Observers (watch) -----
  watch: {
    currentIndex() {
      this.startTyping()
      this.foundChevreaux = []
      this.caillouxInVentre = []
      this.draggedCaillou = null
      this.canGoNext = !this.currentScene.interactive && !this.currentScene.caillouxGame
    }
  },

  // ----- Méthodes de l'application -----
  methods: {
    // Lecture de la narration audio de la scène actuelle
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

    // Navigation : scène suivante
    nextScene() {
      if (this.currentIndex < this.scenes.length - 1) {
        this.currentIndex++;
        this.playNarration();
      }
    },

    // Navigation : scène précédente
    previousScene() {
      if (this.currentIndex > 0) {
        this.currentIndex--;
        this.playNarration();
      }
    },

    // Contrôle musique d'ambiance
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

    // Effet de saisie du texte (typing)
    startTyping() {
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
      }, 40)
    },

    // ----- Mini-jeu chevreaux : gestion des trouvailles -----
    findChevreau(idx) {
      if (!this.foundChevreaux.includes(idx)) {
        this.foundChevreaux.push(idx);
        if (
          this.currentScene.chevreaux &&
          this.foundChevreaux.length === this.currentScene.chevreaux.length
        ) {
          this.canGoNext = true;
        }
      }
    },

    // ----- Mini-jeu cailloux : drag & drop -----
    startDragCaillou(caillou, event) {
      try {
        event.dataTransfer.setData('text/plain', String(caillou.id));
        event.dataTransfer.effectAllowed = 'move';
      } catch (err) {
        // fallback : certains environnements limitent setData sur SVG
      }
      this.draggedCaillou = caillou;
    },

    // Fallback tactile (mobile/tablette)
    startTouchCaillou(caillou) {
      this.draggedCaillou = caillou;
    },

    // Dépôt du caillou dans la dropzone
    dropCaillou(e) {
      let caillou = null;
      try {
        const id = e.dataTransfer ? e.dataTransfer.getData('text/plain') : null;
        if (id) {
          caillou = this.currentScene.cailloux.find(c => String(c.id) === String(id));
        }
      } catch (err) {
        // ignore
      }
      if (!caillou) caillou = this.draggedCaillou;
      if (caillou && !this.caillouxInVentre.some(c => c.id === caillou.id)) {
        this.caillouxInVentre.push(caillou);
        this.draggedCaillou = null;
        if (
          this.currentScene.cailloux &&
          this.caillouxInVentre.length === this.currentScene.cailloux.length
        ) {
          this.canGoNext = true
        }
      }
    }
  },

  // ----- Montage (préchargement et initialisation) -----
  mounted() {
    // Préchargement images puis initialisation de l'affichage et narration
    Promise.all(this.scenes.map(scene => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = resolve;
        img.src = scene.img;
      });
    })).then(() => {
      this.isLoaded = true;
      this.startTyping();

      // Lancer la première narration après un délai
      setTimeout(() => {
        this.playNarration();
      }, 1000);
    });
  }
}