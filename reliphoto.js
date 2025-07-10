let imageBank = [];
let selectedWord = null;
let selectedImage = null;
const sonBonne = document.getElementById('son-bonne');
const sonMauvaise = document.getElementById('son-mauvaise');

async function init() {
  try {
    const resp = await fetch('images.json');
    const imageList = await resp.json();

    imageBank = imageList.map(name => ({
      word: name.split('.')[0].toUpperCase(),
      url: `images/${name}`
    }));

    startReliphoto();
  } catch (err) {
    console.error("Erreur loading images.json:", err);
    document.getElementById('result').textContent = "Erreur de chargement";
  }
}

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function startReliphoto() {
  const wordCol = document.getElementById("wordColumn");
  const imageCol = document.getElementById("imageColumn");
  wordCol.innerHTML = "";
  imageCol.innerHTML = "";

  const indexes = [];
  while (indexes.length < 3 && imageBank.length >= 3) {
    let idx = Math.floor(Math.random() * imageBank.length);
    if (!indexes.includes(idx)) indexes.push(idx);
  }

  const selectedImages = indexes.map(i => imageBank[i]);
  const shuffledImages = shuffle([...selectedImages]);

  selectedImages.forEach(obj => {
    const div = document.createElement("div");
    div.textContent = obj.word;
    div.className = "word-item";
    div.onclick = () => selectWord(div, obj.word);
    wordCol.appendChild(div);
  });

  shuffledImages.forEach(obj => {
    const div = document.createElement("div");
    div.className = "image-item";
    const img = document.createElement("img");
    img.src = obj.url;
    div.appendChild(img);
    div.onclick = () => selectImage(div, obj.word);
    imageCol.appendChild(div);
  });
}

function selectWord(element, word) {
  document.querySelectorAll(".word-item").forEach(el => el.classList.remove("selected"));
  element.classList.add("selected");
  selectedWord = { element, word };
  checkMatch();
}

function selectImage(element, word) {
  document.querySelectorAll(".image-item").forEach(el => el.classList.remove("selected"));
  element.classList.add("selected");
  selectedImage = { element, word };
  checkMatch();
}

function checkMatch() {
  if (selectedWord && selectedImage) {
    const result = document.getElementById("result");
    if (selectedWord.word === selectedImage.word) {
      result.textContent = "🎉 Bravo Jules !";
      result.style.color = "#2ecc71";
      sonBonne.currentTime = 0;
      sonBonne.play();
      selectedWord.element.classList.add("correct");
      selectedImage.element.classList.add("correct");
    } else {
      result.textContent = "❌ Non, essaie encore !";
      result.style.color = "#e74c3c";
      sonMauvaise.currentTime = 0;
      sonMauvaise.play();
      selectedWord.element.classList.add("incorrect");
      selectedImage.element.classList.add("incorrect");
    }

    setTimeout(() => {
      document.querySelectorAll(".selected, .correct, .incorrect").forEach(el => el.classList.remove("selected", "correct", "incorrect"));
      selectedWord = null;
      selectedImage = null;
      result.textContent = "";
    }, 1200);
  }
}

init();
