// Player class: Handles player data
class Player {
  constructor(initiative, char, name, turn) {
    this.initiative = initiative;
    this.char = char;
    this.name = name;
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
    //UI.orderPlayers(players);
    return players;
  }

  static addPlayer(player) {
    const players = Store.getPlayers();
    players.push(player);
    //UI.orderPlayers(players);
    localStorage.setItem("players", JSON.stringify(players));
  }

  static removePlayer(initiative, char) {
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
    UI.orderPlayers(players);
    players.forEach(player => UI.addPlayerToList(player));
  }

  // Add a new player to the list
  static addPlayerToList(player) {
    const list = document.querySelector("#player-list");
    const row = document.createElement("tr");

    row.innerHTML = `
    <td>${player.initiative}</td>
    <td>${player.char}</td>
    <td>${player.name}</td>
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

  // Trying to order player on the table
  static orderPlayers(players) {
    players.sort(function(a, b) {
      return b.initiative - a.initiative;
    });
  }

  static refresh() {
    location.reload();
  }
}

//Event listener for displaying players on page load
document.addEventListener("DOMContentLoaded", e => UI.displayPlayers());

//Event listener for player inclusion
document.addEventListener("submit", e => {
  e.preventDefault();
  const initiative = document.querySelector("#rolled_initiative").value;
  const char = document.querySelector("#char_name").value;
  const name = document.querySelector("#player_name").value;
  const turn = 1;

  if (name == "" || char == "" || initiative == "") {
    alert("Please fill in all fields.");
  } else {
    const player = new Player(initiative, char, name, turn);

    // Add Player to store
    Store.addPlayer(player);

    // Add player to UI
    UI.addPlayerToList(player);

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
    // Passing INITIATIVE to the function
    e.target.parentElement.previousElementSibling.previousElementSibling
      .previousElementSibling.previousElementSibling.textContent,

    // Passing CHAR NAME to the function
    e.target.parentElement.previousElementSibling.previousElementSibling
      .previousElementSibling.textContent
  );
});

// Event listener for complete RESET of the battle
document.querySelector("#btn-reset").addEventListener("click", e => {
  Store.reset();
  UI.refresh();
});
