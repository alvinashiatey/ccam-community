function generateRandomEmoji() {
  const emojis = ["👻", "👽", "🤖", "👾", "🤡", "👹", "👺", "🤠", "🤥", "🤓"];
  return emojis[Math.floor(Math.random() * emojis.length)];
}

function scrollNotesToBottom() {
  const notes = document.querySelector("#notes");
  notes.scrollTop = notes.scrollHeight;
}

function handleForm(socket, displayName) {
  let form = document.querySelector("form");
  function handleSubmit () {
    let input = document.querySelector("#note_content");
    let message = input.value;
    const data = {
      id:  Math.random().toString(16).slice(2),
      body: message,
      author: displayName,
      timestamp: new Date().toLocaleString(),
    }
    socket.emit("addPost", data);
    addNote(data)
    input.value = "";
    }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    handleSubmit();
  });
//  on enter key press
    form.addEventListener("keypress", (e) => {
    if (e.keyCode === 13) {
      handleSubmit();
    }});
}

function addNote(note) {
  let noteList = document.querySelector(".notes_wrapper");
  let div = document.createElement("div");
  div.classList.add("note");
  div.innerHTML = `
    <div class="note_header">
        <div class="note-author">${note.author}</div>
        <div class="timestamp">     
             <p>${note.timestamp}</p>
        </div>
    </div>
        <div class="note-body">${note.body}</div>
    `;
  noteList.appendChild(div);
  scrollNotesToBottom();
}
function setupSocket(){
  scrollNotesToBottom();
  const socket = io();
  let displayName = localStorage.getItem("displayName");

  if (!displayName) {
    displayName = prompt("Enter a display name") || generateRandomEmoji();
    localStorage.setItem("displayName", displayName);
  }

  handleForm(socket, displayName);
  socket.on("addPost", addNote);
}

window.onload = setupSocket;



