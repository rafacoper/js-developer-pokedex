const POKEMON_LIST = document.getElementById("pokemonList");
const LOAD_MORE_BUTTON = document.getElementById("loadMoreButton");
const MODAL = document.getElementById("modal");

const MAX_RECORDS = 151;
const LIMIT = 10;
let offset = 0;
let currentModal = null;

const pokemonApi = new PokemonAPI();

function createPokeModal(pokemon) {
  const modalId = `modal-${pokemon.number}`;
  const modalContent = `
    <div id="${modalId}" class="modal-content hidden">
      <span class="close">&times;</span>
      <h2>${pokemon.name}</h2>
      <p>Weight: ${pokemon.weight}</p>
      <p>Height: ${pokemon.height}</p>
      <img src="${pokemon.photo}" alt="${pokemon.name}">
    </div>
  `;
  MODAL.innerHTML = modalContent;

  const modalElement = document.getElementById(modalId);
  const closeModalButton = modalElement.querySelector(".close");

  modalElement.addEventListener("click", function (event) {
    if (event.target === modalElement || event.target === closeModalButton) {
      closeModal();
    }
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && currentModal) {
      closeModal();
    }
  });
}

function openModal(pokemon) {
  createPokeModal(pokemon);
  currentModal = document.querySelector(".modal-content");
  currentModal.classList.remove("hidden");
}

function closeModal() {
  if (currentModal) {
    currentModal.classList.add("hidden");
    currentModal = null;
  }
}

function appendPokemonToDOM(pokemon) {
  const li = document.createElement("li");
  li.className = `pokemon ${pokemon.type}`
  li.id = pokemon.number;
  li.innerHTML = `
    <span class="number">#${pokemon.number}</span>
    <span class="name">${pokemon.name}</span>
    <div class="detail">
      <ol class="types">${pokemon.types.map(type => `<li class="type ${type}">${type}</li>`).join("")}</ol>
      <img src="${pokemon.photo}" alt="${pokemon.name}">
    </div>
  `;
  
  li.addEventListener('click', function() {
    openModal(pokemon);
  });

  POKEMON_LIST.appendChild(li);
}

function loadPokemonItems(offset, limit) {
  pokemonApi
    .getPokemons(offset, limit)
    .then((pokemons = []) => {
      pokemons.forEach(appendPokemonToDOM);
    })
    .catch((error) => {
      console.error("Error loading Pokemon items:", error.message);
    });
}

loadPokemonItems(offset, LIMIT);

LOAD_MORE_BUTTON.addEventListener("click", () => {
  offset += LIMIT;
  const qtdRecordsWithNextPage = offset + LIMIT;

  if (qtdRecordsWithNextPage >= MAX_RECORDS) {
    const newLimit = MAX_RECORDS - offset;
    loadPokemonItems(offset, newLimit);
    LOAD_MORE_BUTTON.parentElement.removeChild(LOAD_MORE_BUTTON);
  } else {
    loadPokemonItems(offset, LIMIT);
  }
});
