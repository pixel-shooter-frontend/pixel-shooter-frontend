/* global game: false */

console.log("hello world");
let socket = new WebSocket("ws://localhost:8080");
socket.onopen = () => {
  console.log("[socket] connected");
  send({type: "hello", data: {}});
};

let tickCounter = 0;
let players = [];//eslint-disable-line no-unused-vars
let bullets = [];//eslint-disable-line no-unused-vars

let myId = null;//eslint-disable-line no-unused-vars


socket.onmessage = (e) => {
  try{
    JSON.parse(e.data).forEach(data => {
      try{
        switch(data.type){
        case "map":
          console.log("got map", data.data);
          game(data.data);
          break;
        case "playerinfo":
          console.log("info about me", data.data);
          myId = data.data.id;
          break;
        case "tick":
          players = data.data.players;
          bullets = data.data.bullets;
          if(tickCounter % 120 === 0){
            console.log("Players are", players);
          }
          tickCounter ++;
          break;
        default:
          throw new Error("Unknown WS protocol type", data.type);
        }
      }catch(err){
        console.error("Unexpected error in message processing", err);
      }
    });
  }catch(err){
    console.error("Unexpected error in JSON parsing", err);
  }
};

const send = (...data) => {
  socket.send(JSON.stringify(data));
};

onkeydown = e => {
  if(["w", "a", "s", "d"].includes(e.key)){
    send({type: "keyDown", data: e.key});
  }
};
onkeyup = e => {
  if(["w", "a", "s", "d"].includes(e.key)){
    send({type: "keyUp", data: e.key});
  }
};
onkeypress = e => {
  if(e.key === "q"){
    send({type: "keyPress", data: e.key});
  }
};
