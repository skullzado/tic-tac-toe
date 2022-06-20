const Game = () => {
  let board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
  ];
  let turn = 1;

  const init = () => {
    const { renderBoard } = GameBoard();
    renderBoard(board);
  };

  const resetHandler = () => {
    const { renderBoard, removeChildren } = GameBoard();
    const boardContainer = document.querySelector('.board__container');
    if (boardContainer.children > 1) {
      removeChildren(boardContainer);
    }
    board = [...Array(3)].map(() => Array(3).fill(''));
    turn = 0;
    renderBoard(board);
  };

  const showResetButton = () => {
    const resetContainer = document.createElement('div');
    const btnReset = document.createElement('button');
    const gameContainer = document.querySelector('.game__container');
    resetContainer.classList.add('reset__container');
    btnReset.classList.add('reset__btn');
    btnReset.innerHTML = `PLAY AGAIN`;
    btnReset.addEventListener('click', resetHandler);
    resetContainer.appendChild(btnReset);

    let buttons = gameContainer
      .querySelector('.board__container')
      .querySelectorAll('button');
    buttons.forEach((button) => {
      button.disabled = true;
    });

    gameContainer.appendChild(resetContainer);
  };

  const showResult = (token) => {
    const resultContainer = document.createElement('div');
    const resultText = document.createElement('h2');
    resultContainer.classList.add('result__container');
    resultText.classList.add('result__text');

    if (token) {
      resultText.textContent = `Player "${token.toUpperCase()}" Wins!`;
    } else {
      resultText.textContent = "It's a Draw";
    }
    resultContainer.appendChild(resultText);
    document.querySelector('.game__container').appendChild(resultContainer);
  };

  const clickHandler = (event) => {
    let rowIdx = Number(event.target.parentNode.dataset['key']);
    let itemIdx = Number(event.target.dataset['key']);
    board[rowIdx][itemIdx] = assignToken(turn);
    event.target.textContent = assignToken(turn);
    event.target.disabled = true;
    let { token, result } = checkPattern(board);
    if (turn > 8 || result === true) {
      showResult(token);
      showResetButton();
    }

    turn++;
  };

  const assignToken = (turn) => {
    let token;
    if (turn % 2 === 0) {
      token = 'o';
    } else {
      token = 'x';
    }
    return token;
  };

  const checkResult = (obj) => {
    for (const prop in obj) {
      if (obj[prop] === 'xxx') {
        return { token: 'x', result: true };
      } else if (obj[prop] === 'ooo') {
        return { token: 'o', result: true };
      }
    }
    return { token: 'null', result: false };
  };

  const checkPattern = () => {
    let horizontal = checkHorizontal(board);
    let vertical = checkVertical(board);
    let diagonal = checkDiagonal(board);

    if (checkResult(horizontal).result) {
      return checkResult(horizontal);
    } else if (checkResult(vertical).result) {
      return checkResult(vertical);
    } else if (checkResult(diagonal).result) {
      return checkResult(diagonal);
    }

    return { token: null, result: false };
  };

  const checkHorizontal = (arr) => {
    let patternObj = {};
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr[i].length; j++) {
        if (patternObj[i] === undefined) {
          patternObj[i] = '';
        }
        patternObj[i] += arr[i][j];
      }
    }
    return patternObj;
  };

  const checkVertical = (arr) => {
    let patternObj = {};
    let columnToCheck = 0;
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length; j++) {
        if (patternObj[i] === undefined) {
          patternObj[i] = '';
        }
        patternObj[i] += arr[j][columnToCheck];
      }
      columnToCheck++;
    }
    return patternObj;
  };

  const checkDiagonal = (arr) => {
    let patternObj = {
      backSlash: `${arr[0][0]}${arr[1][1]}${arr[2][2]}`,
      forwardSlash: `${arr[0][2]}${arr[1][1]}${arr[2][0]}`,
    };

    return patternObj;
  };

  return { init, clickHandler };
};

const GameBoard = () => {
  const { clickHandler } = Game();

  const removeChildren = (parent) => {
    while (parent.firstChild) {
      parent.removeChild(parent.lastChild);
    }
  };

  const renderBoard = (arr) => {
    const gameContainer = document.querySelector('.game__container');
    const boardContainer = document.createElement('div');

    if (gameContainer.children.length > 1) {
      removeChildren(gameContainer);
    }

    return arr.map((row, rowIdx) => {
      const boardRow = document.createElement('div');
      boardContainer.classList.add('board__container');
      boardRow.classList.add('board__row');
      boardRow.dataset.key = rowIdx;
      row.map((item, itemIdx) => {
        const boardItem = document.createElement('button');
        boardItem.classList.add('board__item');
        boardItem.textContent = item;
        boardItem.dataset.key = itemIdx;
        boardItem.addEventListener('click', (event) => clickHandler(event));
        boardRow.appendChild(boardItem);
      });
      boardContainer.appendChild(boardRow);
      gameContainer.appendChild(boardContainer);
    });
  };

  return { renderBoard, removeChildren };
};

(function () {
  const { init } = Game();
  init();
})();
