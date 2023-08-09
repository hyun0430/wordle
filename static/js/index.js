// const 정답 = "APPLE";

let attempts = 0;
let index = 0;
let timer;

function appStart() {
  const nextLine = () => {
    attempts += 1;
    index = 0;
    if (attempts === 6) return gameover();
  };

  const displayGameover = () => {
    const div = document.createElement("div");
    div.innerText = "게임이 종료됐습니다.";
    div.style =
      "display: flex; justify-content:center; align-items:center; position:absolute; top:20vh; left:42vw; background-color:white; width:200px; height:100px;";
    document.body.appendChild(div);
  };

  const gameover = () => {
    window.removeEventListener("keydown", handleKeydown);
    displayGameover();
    clearInterval(timer);
  };

  const handleEnterKey = async () => {
    let 맞은_갯수 = 0;
    // 서버에서 정답을 받아오는 코드
    // fetch() 자바스크립트에서 서버로 요청을 보낼 때 사용하는 함수
    // await 서버에 요청한 값이 올 떄까지 기다리는 코드
    const 응답 = await fetch("/answer");
    const 정답 = await 응답.json();

    for (let i = 0; i < 5; i++) {
      const block = document.querySelector(
        `.board-block[data-index='${attempts}${i}']`
      );
      const keyBlock = document.querySelectorAll(".key-block");

      const 입력한_글자 = block.innerText;
      const 정답_글자 = 정답[i];
      if (입력한_글자 === 정답_글자) {
        맞은_갯수 += 1;
        block.style.background = "#6AAA64";
        for (let i = 0; i < keyBlock.length; i++) {
          if (keyBlock[i].innerText === 정답_글자) {
            keyBlock[i].style.background = "#6AAA64";
            console.log(keyBlock[i].style.background);
          }
        }
      } else if (정답.includes(입력한_글자)) {
        block.style.background = "#C9B458";
        for (let i = 0; i < keyBlock.length; i++) {
          if (
            keyBlock[i].innerText === 입력한_글자 &&
            keyBlock[i].style.background != "rgb(106, 170, 100)"
          ) {
            console.log(keyBlock[i].style.background);
            keyBlock[i].style.background = "#C9B458";
          }
        }
      } else {
        block.style.background = "#787C7E";
        for (let i = 0; i < keyBlock.length; i++) {
          if (keyBlock[i].innerText === 입력한_글자)
            keyBlock[i].style.background = "#787C7E";
        }
      }
      block.style.color = "white";
    }

    if (맞은_갯수 === 5) gameover();
    else nextLine();
  };

  const handleBackspace = () => {
    if (index > 0) {
      const preBlock = document.querySelector(
        `.board-block[data-index='${attempts}${index - 1}']`
      );
      preBlock.innerText = "";
    }
    if (index !== 0) index -= 1;
  };

  const handleKeydown = (event) => {
    const key = event.key.toUpperCase();
    const keyCode = event.keyCode;
    const thisBlock = document.querySelector(
      `.board-block[data-index='${attempts}${index}']`
    );

    if (event.key === "Backspace") handleBackspace(thisBlock);
    else if (index === 5) {
      if (event.key === "Enter") handleEnterKey();
      else return;
    } else if (65 <= keyCode && keyCode <= 90) {
      thisBlock.innerText = key;
      index++;
    }
  };

  const startTimer = () => {
    const 시작_시간 = new Date();

    function setTime() {
      const 현재_시간 = new Date();
      const 흐른_시간 = new Date(현재_시간 - 시작_시간);
      const 분 = 흐른_시간.getMinutes().toString().padStart(2, "0");
      const 초 = 흐른_시간.getSeconds().toString().padStart(2, "0");
      const timeDiv = document.querySelector("#timer");
      timeDiv.innerText = `${분}:${초}`;
    }

    // 주기성
    timer = setInterval(setTime, 1000);
  };

  startTimer();
  window.addEventListener("keydown", handleKeydown);
}

appStart();
