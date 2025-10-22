// === Scènes du conte ===
const scenes = [
  { img: "assets/images/1.png", text: "Il était une fois, une maman chèvre et ses sept chevreaux..." },
  { img: "assets/images/2.png", text: "Avant de partir, la maman avertit ses enfants : 'Ne laissez entrer personne !'" },
  { img: "assets/images/3.png", text: "Le loup arriva, frappant à la porte d’une voix rauque..." },
  { img: "assets/images/4.png", text: "Les chevreaux reconnurent sa voix et ne lui ouvrirent pas." },
  { img: "assets/images/5.png", text: "Le loup revint plus tard avec une voix douce et les pattes blanches..." },
  { img: "assets/images/6.png", text: "Trompés, les chevreaux ouvrirent la porte, et le loup entra !" },
  { img: "assets/images/7.png", text: "Un à un, il chercha les chevreaux cachés derrière les meubles..." },
  { img: "assets/images/8.png", text: "Mais le plus petit s’était réfugié dans l’horloge et échappa au danger." },
  { img: "assets/images/9.png", text: "Quand la maman revint, le dernier chevreau lui raconta tout en pleurant." },
  { img: "assets/images/10.png", text: "Elles partirent retrouver le loup, endormi sous un arbre, le ventre gonflé." },
  { img: "assets/images/11.png", text: "La maman ouvrit le ventre du loup, et les chevreaux sortirent sains et saufs !" },
  { img: "assets/images/12.png", text: "Elles remplirent son ventre de pierres et le recousirent." },
  { img: "assets/images/13.png", text: "Au réveil, le loup voulut boire au puits..." },
  { img: "assets/images/14.png", text: "Mais les pierres l’attirèrent vers le fond, et il tomba dedans !" },
  { img: "assets/images/15.png", text: "Les chevreaux dansèrent de joie autour du puits !" },
  { img: "assets/images/16.png", text: "Depuis ce jour, ils vécurent heureux et prudents." },
  { img: "assets/images/17.png", text: "Fin du conte." },
  { img: "assets/images/18.png", text: "Merci d’avoir lu ! (écran de fin)" },
  { img: "assets/images/19.png", text: "" },
  { img: "assets/images/20.png", text: "" }
];

let current = 0;

const imageEl = document.getElementById("scene-image");
const textEl = document.getElementById("scene-text");
const progressEl = document.getElementById("progress");
const music = document.getElementById("bg-music");
const musicBtn = document.getElementById("musicBtn");

function updateScene() {
  const scene = scenes[current];
  imageEl.src = scene.img;
  textEl.textContent = scene.text;
  const progress = ((current + 1) / scenes.length) * 100;
  progressEl.style.width = progress + "%";
}

document.getElementById("nextBtn").addEventListener("click", () => {
  if (current < scenes.length - 1) {
    current++;
    updateScene();
  }
});

document.getElementById("prevBtn").addEventListener("click", () => {
  if (current > 0) {
    current--;
    updateScene();
  }
});

let playing = false;
musicBtn.addEventListener("click", () => {
  if (!playing) {
    music.play();
    playing = true;
    musicBtn.textContent = "🔈 Stop";
  } else {
    music.pause();
    playing = false;
    musicBtn.textContent = "🔊 Musique";
  }
});

updateScene();