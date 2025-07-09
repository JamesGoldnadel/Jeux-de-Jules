let imageBank = [], currentCorrect = 0;

async function init() {
  const resp = await fetch('images.json');
  const imageList = await resp.json();
  imageBank = imageList.map(name => ({
    word: name.split('.')[0].toUpperCase(),
    url: `images/${name}`
  }));
  nextQuestion();
}

function nextQuestion() {
  document.getElementById('result').textContent = '';
  if (imageBank.length < 3) {
    document.getElementById('word').textContent = "Ajoute au moins 3 images dans /images.json !";
    return;
  }

  const idxs = [];
  while (idxs.length < 3) {
    const idx = Math.floor(Math.random() * imageBank.length);
    if (!idxs.includes(idx)) idxs.push(idx);
  }

  currentCorrect = Math.floor(Math.random() * 3);
  document.getElementById('word').textContent = imageBank[idxs[currentCorrect]].word;
  idxs.forEach((i, j) => {
    document.getElementById('img' + j).src = imageBank[i].url;
  });
}

function checkAnswer(s) {
  const r = document.getElementById('result');
  if (s === currentCorrect) {
    r.textContent = '✅ Bravo !';
    r.style.color = 'green';
  } else {
    r.textContent = '❌ Essaie encore...';
    r.style.color = 'red';
  }
}

init();
