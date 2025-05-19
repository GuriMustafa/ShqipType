const wordContainer = document.querySelector("#wordContainer");
const wpmDisplay = document.querySelector("#wpm");
const accuracyDisplay = document.querySelector("#accuracy");
const timeDisplay = document.querySelector("#time");
const restartBtn = document.querySelector("#restartBtn");

const wordsList = [
  "guri",
  "albania",
  "kosovo",
  "molla",
  "vogel",
  "arkimedi",
  "baba",
  "nene",
  "shtepi",
  "liber",
  "mesues",
  "nxenes",
  "shkolle",
  "fjale",
  "drite",
  "dere",
  "mik",
  "vajze",
  "djale",
  "kafshe",
  "pershendetje",
  "mire",
  "keq",
  "uje",
  "buke",
  "kafe",
  "caj",
  "tavoline",
  "karrige",
  "biciklete",
  "makine",
  "rruge",
  "pune",
  "lule",
  "diell",
  "hene",
  "yll",
  "qiell",
  "uji",
  "pyll",
  "fshat",
  "qytet",
  "banor",
  "femije",
  "grua",
  "burre",
  "vella",
  "motra",
  "familje",
  "gjuhe",
  "leter",
  "laps",
  "stile",
  "test",
  "provim",
  "note",
  "shkence",
  "histori",
  "gjeografi",
  "muzike",
  "art",
  "pikture",
  "kompjuter",
  "internet",
  "laptop",
  "programim",
  "kod",
  "faqe",
  "libra",
  "gazete",
  "revista",
  "shkrim",
  "lexim",
  "shkruar",
  "kulturore",
  "gjuha",
  "tradita",
  "zakon",
  "veshje",
  "kenges",
  "valle",
  "festa",
  "dite",
  "muaj",
  "vit",
  "ora",
  "minute",
  "sekonde",
  "dita",
  "nata",
  "mengjes",
  "drek",
  "dark",
  "shok",
  "shoqe",
  "grup",
  "klase",
  "mjedis",
  "shendet",
  "ushqim",
  "fruta",
  "perime",
  "qep",
  "domate",
  "patate",
  "karrote",
  "lakra",
  "mish",
  "peshk",
  "djath",
  "qumesht",
  "kos",
  "embelsire",
  "torte",
  "akullore",
  "biskote",
  "kek",
  "sheqer",
  "krip",
  "vaj",
  "uthull",
  "miell",
  "brume",
  "buk",
  "pete",
  "byrek",
  "flije",
  "tav",
  "fasule",
  "oriz",
  "supa",
  "gjelle",
  "pjate",
  "lug",
  "thike",
  "pirun",
  "got",
  "shishe",
  "filxhan",
  "banjo",
  "lavaman",
  "dush",
  "shtrat",
  "dhome",
  "kuzhine",
  "ballkon",
  "dritare",
  "llamb",
  "pasqyre",
  "tapet",
  "divan",
  "karrige",
  "komodine",
  "telefon",
  "mesazh",
  "foto",
  "video",
  "muzik",
  "kenge",
  "loje",
  "top",
  "futboll",
  "basketboll",
  "not",
  "vrapim",
  "ushtrime",
  "palester",
  "trajner",
  "ekip",
  "gara",
  "trofe",
  "fitore",
  "humbje",
  "rregull",
  "ligj",
  "kushtetute",
  "shtet",
  "qeveri",
  "president",
  "minister",
  "kryetar",
  "bashki",
  "polici",
  "ushtri",
  "flamur",
  "himn",
  "identitet",
  "kulture",
  "arti",
  "teater",
  "film",
  "aktor",
  "aktore",
];

let randomWords = [];
let currentWordIndex = 0;
let currentLetterIndex = 0;
let correctChars = 0;
let incorrectChars = 0;
let startTime = null;
let timer = null;
let testDuration = 30;
let timeLeft = testDuration;

function initTest() {
  currentWordIndex = 0;
  currentLetterIndex = 0;
  correctChars = 0;
  incorrectChars = 0;
  timeLeft = testDuration;
  timeDisplay.textContent = timeLeft;

  randomWords = getRandomWords(wordsList, 30);

  wordContainer.innerHTML = randomWords
    .map(
      (word, i) =>
        `<span class="word ${i === 0 ? "current" : ""}">${[...word]
          .map((letter) => `<span class="letter">${letter}</span>`)
          .join("")}</span>`
    )
    .join(" ");

  if (!timer) {
    startTime = Date.now();
    timer = setInterval(updateTimer, 1000);
  }
}

function getRandomWords(words, count) {
  let result = [];
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * words.length);
    result.push(words[randomIndex]);
  }
  return result;
}

function updateTimer() {
  timeLeft--;
  timeDisplay.textContent = timeLeft;

  if (timeLeft <= 0) {
    clearInterval(timer);
    timer = null;
    endTest();
  } else {
    updateStats();
  }
}

function updateStats() {
  const elapsedMinutes = (testDuration - timeLeft) / 60;
  const wpm = Math.round(correctChars / 4 / elapsedMinutes) || 0;
  const totalChars = correctChars + incorrectChars;
  const accuracy =
    totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 100;

  wpmDisplay.textContent = wpm;
  accuracyDisplay.textContent = accuracy;
}

function endTest() {
  document.removeEventListener("keydown", handleKeyDown);
  updateStats();
}

function handleKeyDown(event) {
  if (event.key === " ") {
    event.preventDefault();
  }

  if (event.ctrlKey || event.altKey || event.metaKey) {
    return;
  }

  const currentWordSpan = document.querySelector(".word.current");
  const letterSpans = [...currentWordSpan.querySelectorAll(".letter")];
  const currentWord = randomWords[currentWordIndex];

  if (event.key === "Backspace") {
    if (currentLetterIndex > 0) {
      currentLetterIndex--;
      letterSpans[currentLetterIndex].classList.remove("correct", "wrong");
    }
  } else if (event.key === " ") {
    if (currentLetterIndex === currentWord.length) {
      moveToNextWord();
    }
  } else if (event.key.length === 1) {
    if (currentLetterIndex < currentWord.length) {
      const expectedLetter = currentWord[currentLetterIndex];

      if (event.key === expectedLetter) {
        letterSpans[currentLetterIndex].classList.add("correct");
        correctChars++;
      } else {
        letterSpans[currentLetterIndex].classList.add("wrong");
        incorrectChars++;
      }
      currentLetterIndex++;
    } else {
      const extraSpan = document.createElement("span");
      extraSpan.className = "letter extra";
      extraSpan.textContent = event.key;
      currentWordSpan.appendChild(extraSpan);
      incorrectChars++;
    }

    if (currentLetterIndex >= currentWord.length && event.key !== " ") {
      setTimeout(() => {
        if (currentLetterIndex >= currentWord.length) {
          moveToNextWord();
        }
      }, 100);
    }
  }

  updateStats();
}

function moveToNextWord() {
  const currentWordSpan = document.querySelector(".word.current");
  currentWordSpan.classList.remove("current");

  currentWordIndex++;
  currentLetterIndex = 0;

  if (currentWordIndex < randomWords.length) {
    const nextWordSpan = wordContainer.children[currentWordIndex];
    nextWordSpan.classList.add("current");
  } else {
    endTest();
  }
}

initTest();
document.addEventListener("keydown", handleKeyDown);
restartBtn.addEventListener("click", () => {
  clearInterval(timer);
  timer = null;
  initTest();
});
