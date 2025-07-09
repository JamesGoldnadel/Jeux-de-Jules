let imageBank = [], currentCorrect = 0;

// Récupération des sons
const sonBonne = new Audio('sons/good-chime.mp3');
const sonMauvaise = new Audio('sons/error-buzzer.mp3');

async function init() {
  try {
    const resp = await fetch('images.json');
    const imageList = await resp.json();

    imageBank = imageList.map(name => ({
      word: name.split('.')[0].toUpperCase(),
      url: `images/${name}`
    }));

    nextQuestion();
  } catch (err) {
    console.error("Erreur loading images.json:", err);
    document.getElementById('word').textContent = "Erreur de chargement";
  }
}

function nextQuestion() {
  const result = document.getElementById('result');
  result.textContent = '';

  // Supprime les effets visuels de la précédente réponse
  for (let i = 0; i < 3; i++) {
    document.getElementById('img' + i).classList.remove("correct", "incorrect");
  }

  if (imageBank.length < 3) {
    document.getElementById('word').textContent = "Ajoute au moins 3 images dans /images + images.json !";
    return;
  }

  const indexes = [];
  while (indexes.length < 3) {
    let idx = Math.floor(Math.random() * imageBank.length);
    if (!indexes.includes(idx)) indexes.push(idx);
  }

  currentCorrect = Math.floor(Math.random() * 3);
  document.getElementById('word').textContent = imageBank[indexes[currentCorrect]].word;

  indexes.forEach((i, j) => {
    document.getElementById('img' + j).src = imageBank[i].url;
  });
}

function checkAnswer(selected) {
  const result = document.getElementById('result');
  const clickedImg = document.getElementById('img' + selected);

  // Réinitialise les effets des autres images
  for (let i = 0; i < 3; i++) {
    document.getElementById('img' + i).classList.remove("correct", "incorrect");
  }

  if (selected === currentCorrect) {
    result.textContent = '🎉 Bravo Jules !';
    result.style.color = '#2ecc71';
    clickedImg.classList.add("correct");

    sonBonne.currentTime = 0;
    sonBonne.play();

    document.body.classList.add("flash-green");
    setTimeout(() => document.body.classList.remove("flash-green"), 600);
  } else {
    result.textContent = '❌ Non, essaie encore !';
    result.style.color = '#e74c3c';
    clickedImg.classList.add("incorrect");

    sonMauvaise.currentTime = 0;
    sonMauvaise.play();

    document.body.classList.add("flash-red");
    setTimeout(() => document.body.classList.remove("flash-red"), 600);
  }
}

init();
