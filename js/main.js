// Player class: Handles player data
class Player {
  constructor(name, char, initiative, turn) {
    this.name = name;
    this.char = char;
    this.initiative = initiative;
    this.turn = turn;
  }
}

// Store class: Handles local storage
class Store {
  static getPlayers() {
    let players;
    if (localStorage.getItem("players") === null) {
      players = [];
    } else {
      players = JSON.parse(localStorage.getItem("players"));
    }
    return players;
  }

  static addPlayer(player) {
    const players = Store.getPlayers();
    players.push(player);
    localStorage.setItem("players", JSON.stringify(players));
  }

  static removePlayer(char, initiative) {
    const players = Store.getPlayers();

    players.forEach((player, index) => {
      if (player.char === char && player.initiative === initiative) {
        players.splice(index, 1);
      }
    });

    localStorage.setItem("players", JSON.stringify(players));
  }

  static reset() {
    localStorage.clear();
  }
}

// UI class: Handles UI changes
class UI {
  // Display players stored locally
  static displayPlayers() {
    const players = Store.getPlayers();

    players.forEach(player => UI.addPlayerToList(player));
  }

  // Add a new player to the list
  static addPlayerToList(player) {
    const list = document.querySelector("#player-list");
    const row = document.createElement("tr");

    row.innerHTML = `
    <td>${player.name}</td>
    <td>${player.char}</td>
    <td>${player.initiative}</td>
    <td>${player.turn}</td>
    <td><a id="btn-remove" class="waves-effect waves-light btn-small red delete" onclick="UI.deletePlayer()">X</a></td>
    `;
    list.appendChild(row);
  }

  // Delete a player from the list
  static deletePlayer(el) {
    if (el.classList.contains("delete")) {
      el.parentElement.parentElement.remove();
    }
  }

  // Clear the field of the form after add a new player
  static cleanForm() {
    document.querySelector("#player_name").value = "";
    document.querySelector("#char_name").value = "";
    document.querySelector("#rolled_initiative").value = "";
  }
}

//Event listener for displaying players on page load
document.addEventListener("DOMContentLoaded", e => UI.displayPlayers());

//Event listener for player inclusion
document.addEventListener("submit", e => {
  e.preventDefault();
  const name = document.querySelector("#player_name").value;
  const char = document.querySelector("#char_name").value;
  const initiative = document.querySelector("#rolled_initiative").value;
  const turn = 1;

  if (name == "" || char == "" || initiative == "") {
    alert("Please fill in all fields.");
  } else {
    const player = new Player(name, char, initiative, turn);

    // Add player to UI
    UI.addPlayerToList(player);

    // Add Player to store
    Store.addPlayer(player);

    // Clear field of the form
    UI.cleanForm();
  }
});

//Event listener for player removal

document.querySelector("#player-list").addEventListener("click", e => {
  // Remove player from UI
  UI.deletePlayer(e.target);

  // Remove player from store
  Store.removePlayer(
    e.target.parentElement.previousElementSibling.previousElementSibling
      .previousElementSibling.textContent,
    e.target.parentElement.previousElementSibling.previousElementSibling
      .textContent
  );
});
