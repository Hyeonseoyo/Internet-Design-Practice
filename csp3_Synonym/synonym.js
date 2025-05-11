"use strict";

// Merriam-Webster Thesaurus API 키와 기본 URL
const API_KEY = CONFIG.API_KEY;
const BASE_URL =
  "https://www.dictionaryapi.com/api/v3/references/thesaurus/json/";

// DOM 요소 가져오기
const questionElem = document.getElementById("question");
const choicesElem = document.getElementById("choices");
const feedbackElem = document.getElementById("feedback");
const nextButton = document.getElementById("next-button");

// 타이머 관련 변수
let timerInterval = null;
let timeLeft = 10;
let isAnswered = false;

// 현재 정답 단어
let currentAnswer = "";

// 문제 출제를 위한 단어 목록
const fallbackWords = [
  "happy",
  "strong",
  "fast",
  "big",
  "smart",
  "cold",
  "bright",
  "quiet",
  "brave",
  "angry",
  "small",
  "loud",
  "clean",
  "dirty",
  "rich",
  "poor",
  "easy",
  "hard",
  "friendly",
  "lazy",
  "honest",
  "mean",
  "calm",
  "funny",
  "sad",
  "tired",
  "warm",
  "weak",
  "young",
  "old",
  "sharp",
  "slow",
  "early",
  "late",
  "busy",
  "proud",
  "kind",
  "rough",
  "smooth",
  "dry",
];

// "다음 문제" 버튼 클릭 시 새로운 문제 출제
nextButton.addEventListener("click", () => {
  feedbackElem.textContent = "";
  getNewQuestion();
});

// 새로운 문제 출제 함수
function getNewQuestion() {
  clearInterval(timerInterval);
  timeLeft = 10;
  isAnswered = false;
  feedbackElem.textContent = "";

  const randomWord =
    fallbackWords[Math.floor(Math.random() * fallbackWords.length)];
  const url = `${BASE_URL}${randomWord}?key=${API_KEY}`;

  fetch(url)
    .then(checkStatus)
    .then((resp) => resp.json())
    .then((data) => {
      const synonyms = extractSynonyms(data, randomWord);
      if (synonyms.length < 1) throw new Error("No synonyms available");

      // 동의어 중 하나를 정답으로 랜덤 선택
      currentAnswer = synonyms[Math.floor(Math.random() * synonyms.length)];

      // 정답을 제외한 오답 2개 선택
      const wrongChoices = [];
      while (wrongChoices.length < 2) {
        const word = getRandomWrongWord([currentAnswer, ...wrongChoices]);
        if (!wrongChoices.includes(word)) {
          wrongChoices.push(word);
        }
      }

      // 정답과 오답 섞기
      const options = shuffleArray([currentAnswer, ...wrongChoices]);
      displayQuestion(randomWord, options);
      startTimer();
    })
    .catch(handleError);
}

// fetch 응답 상태 확인 함수
function checkStatus(response) {
  if (!response.ok) {
    throw new Error(`HTTP Error ${response.status}`);
  }
  return response;
}

// 에러 발생 시 출력 처리 함수
function handleError(error) {
  questionElem.textContent = "문제를 불러오는 중 오류가 발생했습니다.";
  choicesElem.innerHTML = "";
  feedbackElem.textContent = `⚠️ ${error.message}`;
}

// API 응답에서 동의어 목록 추출
function extractSynonyms(apiData, word) {
  const firstEntry = apiData[0];
  if (!firstEntry || !firstEntry.meta || !firstEntry.meta.syns) return [];

  // 배열 안의 배열로 되어 있으므로 평탄화 처리
  const allSyns = firstEntry.meta.syns.flat();

  // 출제 단어와 같은 단어는 제외
  return allSyns.filter((s) => s.toLowerCase() !== word.toLowerCase());
}

// 오답으로 쓸 무작위 단어 선택 함수
function getRandomWrongWord(correctWords) {
  let word;
  do {
    word = fallbackWords[Math.floor(Math.random() * fallbackWords.length)];
  } while (correctWords.includes(word));
  return word;
}

// 문제와 보기 표시 함수
function displayQuestion(word, options) {
  questionElem.textContent = `📝 "${word}"의 유의어를 고르세요.`;
  choicesElem.innerHTML = "";

  options.forEach((option) => {
    const li = document.createElement("li");
    li.textContent = option;

    li.addEventListener("click", () => {
      if (isAnswered) return;

      clearInterval(timerInterval);
      isAnswered = true;

      const allChoices = document.querySelectorAll("#choices li");

      // 모든 보기 비활성화 + 정답 or 오답 표시
      allChoices.forEach((item) => {
        item.classList.add("disabled");

        if (item.textContent === currentAnswer) {
          item.classList.add("correct");
        } else {
          item.classList.add("wrong");
        }
      });

      // 사용자가 클릭한 항목 강조
      li.classList.add("selected");

      // 정답 여부 피드백
      if (option === currentAnswer) {
        feedbackElem.textContent = "✅ 정답입니다!";
      } else {
        feedbackElem.textContent = "❌ 틀렸습니다!";
      }
    });

    choicesElem.appendChild(li);
  });
}

// 배열을 무작위로 섞는 함수
function shuffleArray(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

// 제한 시간 타이머 시작 함수
function startTimer() {
  timeLeft = 10;
  isAnswered = false;

  const bar = document.getElementById("timer-bar");
  bar.style.width = "100%";

  clearInterval(timerInterval); // 기존 타이머 제거(중복 방지)

  timerInterval = setInterval(() => {
    timeLeft -= 0.1;
    const percent = (timeLeft / 10) * 100;
    bar.style.width = `${percent}%`;

    // 사용자가 이미 정답을 골랐다면 타이머 종료만
    if (isAnswered) {
      clearInterval(timerInterval);
      return;
    }

    // 시간이 다 되면 타임아웃 처리
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      handleTimeout();
    }
  }, 100);
}

// 시간 초과 처리 함수
function handleTimeout() {
  isAnswered = true;
  feedbackElem.textContent = "⏰ Time out!";

  const allChoices = document.querySelectorAll("#choices li");
  allChoices.forEach((item) => {
    item.classList.add("disabled");

    if (item.textContent === currentAnswer) {
      item.classList.add("correct");
    }
  });
}

// 첫 문제 자동 시작
window.addEventListener("load", getNewQuestion);
