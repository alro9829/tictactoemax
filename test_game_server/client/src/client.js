const log = (text) => {
  const parent = document.querySelector('#events');
  const el = document.createElement('li');
  el.innerHTML = text;

  parent.appendChild(el);
  parent.scrollTop = parent.scrollHeight;
};

const onChatSubmitted = (sock) => (e) => { //pass sock so it can connect server side
  e.preventDefault();

  const input = document.querySelector('#chat');
  const text = input.value;
  input.value = '';

  sock.emit('message',text); // sock emit to send text to server
};

const getBoard = (canvas, numCells = 20) => { //using ctx in a function to create rectangles so we don't have to pass ctx everytime
  const ctx = canvas.getContext('2d');
  const cellSize = Math.floor(canvas.width/numCells);
  const fillCell = (x,y,color) => {
    ctx.fillStyle = color;
    ctx.fillRect(x*cellSize,y*cellSize,cellSize,cellSize);
  };
  const drawGrid = () => {
    ctx.strokeStyle = '#333';
    ctx.beginPath();

    for (let i = 0; i < numCells + 1; i++){
      ctx.moveTo(i*cellSize, 0);
      ctx.lineTo(i*cellSize,cellSize*numCells);
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(cellSize*numCells , i*cellSize);
    }
    ctx.stroke();
  };

  const clear = () => {
    ctx.clearRect(0,0,canvas.width,canvas.height);
  };

  const renderBoard = (board = []) => {
    board.forEach((row, y ) => {
      row.forEach((color, x) => {
        color && fillCell(x, y, color);
      });
    });

  }

  const reset = (board) => {
    clear();
    drawGrid();
    renderBoard(board)
  };

  const getCellCoordinates = (x,y) => {
    return {
      x: Math.floor(x/cellSize),
      y: Math.floor(y/cellSize)
    };
  };
  return {fillCell, reset, getCellCoordinates};
};

const getClickCoordinates = (element, ev) => { // function to get coordinates of user pointer
  const { top, left } = element.getBoundingClientRect();
  const { clientX, clientY } = ev;
  return {
    x: clientX - left,
    y: clientY - top
  };
};


//
// const setPosition => (e) {
//   pos.x = e.clientX;
//   pos.y = e.clientY;
// };
//
// const draw => (e) {
//   if (e.buttons !== 1) return;
//
//   ctx.beginPath(); // begin
//
//   ctx.lineWidth = 5;
//   ctx.lineCap = 'round';
//   ctx.strokeStyle = '#c0392b';
//
//   ctx.moveTo(pos.x, pos.y); // from
//   setPosition(e);
//   ctx.lineTo(pos.x, pos.y); // to
//
//   ctx.stroke(); // draw it!
// };

(() => {
  // sock.on('user-connected', name => {
  //   sock.emit('message','User connected');
  // });
  const canvas = document.querySelector('canvas');
  const {fillCell , reset , getCellCoordinates} = getBoard(canvas);
  const sock = io();

  const onClick = (e) => {
    const { x,y } = getClickCoordinates(canvas, e);
    sock.emit('turn', getCellCoordinates(x,y));
  };

  sock.on('board', reset);
  sock.on('message', log);
  sock.on('turn',({x,y , color}) => fillCell(x, y ,color));

  document
    .querySelector('#chat-form')
    .addEventListener('submit', onChatSubmitted(sock));

  canvas.addEventListener('click',onClick);
  const name = prompt('What is your name?');
  sock.emit('new-user', name);
  // canvas.addEventListener('mousedown', onmousedown);
  // canvas.addEventListener('mouseup', onmouseup);
  // canvas.addEventListener('mouseout', onmouseup);

  // canvas.addEventListener('mousemove', draw);
  // canvas.addEventListener('mousedown', setPosition);
  // canvas.addEventListener('mouseenter', setPosition);
})();
