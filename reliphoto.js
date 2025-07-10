let imageBank = [];
let currentPairs = []; // tableau de paires mot + url
let selectedWord = null;
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

    startNewRound();
  } catch (err) {
    console.error("Erreur loading images.json:", err);
    document.getElementById('error').textContent = "Erreur de chargement";
  }
}

function startNewRound() {
  // Mélange du tableau global
  const shuffled = [...imageBank].sort(() => 0.5 - Math.random());
  currentPairs = shuffled.slice(0, 3); // on garde 3 paires

  // Mélange les images indépendamment des mots
  const shuffledImages = [...currentPairs].sort(() => 0.5 - Math.random());

  // Injecte les mots dans les boutons
  const wordContainer = document.getElementById('words');
  wordContainer.innerHTML = '';
  currentPairs.forEach((pair, index) => {
    const btn = document.createElement('button');
    btn.textContent = pair.word;
    btn.className = 'word-button';
    btn.onclick = () => selectWord(pair.word, btn);
    wordContainer.appendChild(btn);
  });

  // Injecte les images
  const imageContainer = document.getElementById('images');
  imageContainer.innerHTML = '';
  shuffledImages.forEach((pair) => {
    const img = document.createElement('img');
    img.src = pair.url;
    img.className = 'image-item';
    img.onclick = () => checkAnswer(pair.word, img);
    imageContainer.appendChild(img);
  });

  // Réinitialise sélection
  selectedWord = null;
}

function selectWord(word, button) {
  selectedWord = word;

  // Met en surbrillance le mot sélectionné
  const allButtons = document.querySelectorAll('.word-button');
  allButtons.forEach(btn => btn.classList.remove('selected'));
  button.classList.add('selected');
}

function checkAnswer(clickedWord, imageElement) {
  if (!selectedWord) return;

  const result = document.getElementById('result');
  const allButtons = document.querySelectorAll('.word-button');

  if (selectedWord === clickedWord) {
    result.textContent = "🎉 Bravo Jules !";
    result.style.color = '#2ecc71';
    imageElement.classList.add("correct");
    if (sonBonne) { sonBonne.currentTime = 0; sonBonne.play(); }
    document.body.classList.add("flash-green");
    setTimeout(() => document.body.classList.remove("flash-green"), 600);
    setTimeout(() => startNewRound(), 1500);
  } else {
    result.textContent = "❌ Non, essaie encore !";
    result.style.color = '#e74c3c';
    imageElement.classList.add("incorrect");
    if (sonMauvaise) { sonMauvaise.currentTime = 0; sonMauvaise.play(); }
    document.body.classList.add("flash-red");
    setTimeout(() => document.body.classList.remove("flash-red"), 600);
  }

  // Réinitialise
  selectedWord = null;
  allButtons.forEach(btn => btn.classList.remove('selected'));
}

init();
