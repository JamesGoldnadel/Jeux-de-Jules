// Fichier : script.js
let imageBank = [], currentCorrect = 0;

async function init() {
  try {
    const resp = await fetch('images.json');
    const imageList = await resp.json();

    imageBank = imageList.map(name => ({
      word: name.split('.').slice(0, -1).join('.').toUpperCase(),
      url: `images/${name}`
    }));

    console.log("Images détectées :", imageBank);
    nextQuestion();
  } catch (err) {
    console.error("Impossible de charger images.json :", err);
    document.getElementById('word').textContent = "Erreur de chargement du fichier images.json";
  }
}

function nextQuestion() {
  document.getElementById('result').textContent = '';
  if (imageBank.length < 3) {
    document.getElementById('word').textContent = "Ajoute au moins 3 images dans /images + images.json !";
    return;
  }
  const idxs = [];
  while (idxs.length < 3) {
    let idx = Math.floor(Math.random() * imageBank.length);
    if (!idxs.includes(idx)) idxs.push(idx);
  }
  currentCorrect = Math.floor(Math.random() * 3);
  document.getElementById('word').textContent = imageBank[idxs[currentCorrect]].word;
  idxs.forEach((i, j) => {
    document.getElementById('img'+j).src = imageBank[i].url;
  });
}

function checkAnswer(sel) {
  const r = document.getElementById('result');
  if (sel === currentCorrect) {
    r.textContent = '✅ Bravo !';
    r.style.color = 'green';
  } else {
    r.textContent = '❌ Essaie encore...';
    r.style.color = 'red';
  }
}

init();
