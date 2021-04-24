const DIRECTIONS = ['north', 'east', 'south', 'west'];
const MOVES = ['shoot', 'move'];

const randomMove = () => {
  return Math.random() > 0.33 ? 'move' : DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
};

const isVisible = (originalPosition = [], finalPosition = [], direction = []) => {
  switch (direction) {
    case DIRECTIONS[0]:
      return originalPosition[1] === finalPosition[1] && originalPosition[0] > finalPosition[0];
    case DIRECTIONS[1]:
      return originalPosition[0] === finalPosition[0] && originalPosition[1] < finalPosition[1];
    case DIRECTIONS[2]:
      return originalPosition[1] === finalPosition[1] && originalPosition[0] < finalPosition[0];
    case DIRECTIONS[3]:
      return originalPosition[0] === finalPosition[0] && originalPosition[1] > finalPosition[1];
    default:
      break;
  }
};

const canKill = (currentPlayerState = {}, enemiesStates = []) => {
  return enemiesStates.some(enemyObject => {
    return enemyObject.isAlive &&
      isVisible(currentPlayerState.position, enemyObject.position, currentPlayerState.direction);
  });
};

const canDie = (playerPos, enemies) => {
  return enemies.some(enemy => {
    return enemy.isAlive && isVisible(enemy.position. playerPos, enemy.direction);
  });
};

const getAmmo = (player, gameEnv) => {
  let ammo = gameEnv.ammoPosition;
  let closest = 2*gameEnv.gridSize
  let ammoPos = [];

  for (let i = 0; i < ammo.length; i++) {
    let ds = Math.abs(ammo[i][0] - player.position[0]) + Math.abs(ammo[i][1] - player.position[1]);
    if (ds <= closest) {
      closest = ds;
      ammoPos = ammo[i];
    };
  };
  return ammoPos;
};

const getDir = (selfPos, endPos, playerState, enemies) => {
  let dy = selfPos[0] - endPos[0];
  let dx = selfPos[1] - endPos[1];
  let op = (dy>0 ? "N" : dy<0 ? "S" : "") + (dx>0 ? "W" : dx<0? "E" : "");
  let nxtPos = playerState.position;

  switch (op[0]) {
    case "N":
      op = "north";
      nxtPos[0] -= 1;
      break
    case "S":
      op = "south";
      nxtPos[0] += 1;
      break
    case "E":
      op = "east";
      nxtPos[1] += 1;
      break
    case "W":
      op = "west";
      nxtPos[1] -= 1;
      break
      default:
      break
  };

  if(op===""){return randomMove();};

  let prst = canDie(playerState.position, enemies);
  let ftr = canDie(nxtPos, enemies);

  return (prst ? "move" : op === playerState.direction ? (ftr ? "" : "move") : op);
};

const player = {
  info: {
    name: "Jean",
    style: 1,
  },
  ai: (playerState, enemiesState, gameEnvironment) => {
    let b = getAmmo(playerState, gameEnvironment);
    let c = getDir(playerState.position, b, playerState, enemiesState);

    return canKill(playerState, enemiesState) && playerState.ammo > 0 ? "shoot" : c;
  }
};

module.exports = player;