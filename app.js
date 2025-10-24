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
      narrationAudio: null,
      foundChevreaux: [],
      canGoNext: true,
      caillouxInVentre: [],
      draggedCaillou: null
    }
  },
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
  watch: {
    currentIndex() {
      this.startTyping()
      this.foundChevreaux = []
      this.caillouxInVentre = []
      this.draggedCaillou = null
      this.canGoNext = !this.currentScene.interactive && !this.currentScene.caillouxGame
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
    },
    findChevreau(idx) {
      if (!this.foundChevreaux.includes(idx)) {
        this.foundChevreaux.push(idx);
        // Si tous trouvés, débloquer la navigation
        if (
          this.currentScene.chevreaux &&
          this.foundChevreaux.length === this.currentScene.chevreaux.length
        ) {
          // Par exemple, tu peux activer le bouton suivant ici
          this.canGoNext = true;
        }
      }
    },
    startDragCaillou(caillou, event) {
      // Mettre l'id dans dataTransfer pour le drop natif
      try {
        event.dataTransfer.setData('text/plain', String(caillou.id));
        event.dataTransfer.effectAllowed = 'move';
      } catch (err) {
        // certains environnements empêchent setData sur SVG : on utilise le fallback
      }
      // fallback JS pour s'assurer qu'on sait quel caillou bouger
      this.draggedCaillou = caillou;
    },
    // touch fallback (mobile)
    startTouchCaillou(caillou) {
      this.draggedCaillou = caillou;
    },
    dropCaillou(e) {
      // Récupère d'abord via dataTransfer si disponible, sinon utilise le fallback draggedCaillou
      let caillou = null;
      try {
        const id = e.dataTransfer ? e.dataTransfer.getData('text/plain') : null;
        if (id) {
          caillou = this.currentScene.cailloux.find(c => String(c.id) === String(id));
        }
      } catch (err) {
        // ignore
      }
      if (!caillou) {
        caillou = this.draggedCaillou;
      }
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