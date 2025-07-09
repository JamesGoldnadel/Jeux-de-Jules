let imageBank = [], currentCorrect = 0;

async function init() {
  try {
    const resp = await fetch('images.json');
    const imageList = await resp.json();

    imageBank = imageList.map(name => ({
      word: name.split('.')[0].toUpperCase(),
      url: `images/${name}`
    }));

    console.log("Images détectées :", imageBank);
    nextQuestion();
  } catch (err) {
    console.error("Erreur de chargement de images.json :", err);
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
    document.getElementById('img' + j).src = imageBank[i].url;
  });
}

function checkAnswer(selected) {
  const result = document.getElementById('result');

  // Efface les effets précédents
  for (let i = 0; i < 3; i++) {
    const img = document.getElementById('img' + i);
    img.classList.remove("correct", "incorrect");
  }

  const clickedImg = document.getElementById('img' + selected);

  if (selected === currentCorrect) {
    result.textContent = '🎉 Bravo Jules !';
    result.style.color = '#2ecc71';
    clickedImg.classList.add("correct");
  } else {
    result.textContent = '❌ Non, essaie encore !';
    result.style.color = '#e74c3c';
    clickedImg.classList.add("incorrect");
  }
}


init();
