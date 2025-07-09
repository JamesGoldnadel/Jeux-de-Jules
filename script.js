let imageBank = [], currentCorrect=0;

async function init() {
  const resp = await fetch('.');
  const text = await resp.text();
  const imgNames = [...text.matchAll(/href="images\/([^"]+\.(?:png|jpe?g|gif))"/g)]
    .map(m => m[1]);
  imageBank = imgNames.map(name => ({
    word: name.split('.').slice(0,-1).join('.').toUpperCase(),
    url: `images/${name}`
  }));
  nextQuestion();
}

function nextQuestion() {
  document.getElementById('result').textContent = '';
  if (imageBank.length < 3) {
    document.getElementById('word').textContent = "Ajoute au moins 3 images dans /images !";
    return;
  }
  const idxs = [];
  while (idxs.length < 3) {
    let idx = Math.floor(Math.random()*imageBank.length);
    if (!idxs.includes(idx)) idxs.push(idx);
  }
  currentCorrect = Math.floor(Math.random()*3);
  document.getElementById('word').textContent = imageBank[idxs[currentCorrect]].word;
  idxs.forEach((i,j)=>document.getElementById('img'+j).src=imageBank[i].url);
}

function checkAnswer(s) {
  const r = document.getElementById('result');
  if (s===currentCorrect) {
    r.textContent='✅ Bravo !'; r.style.color='green';
  } else {
    r.textContent='❌ Essaie encore...'; r.style.color='red';
  }
}

init();
