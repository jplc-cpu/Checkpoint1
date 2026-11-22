// Alla namn ligger i denna array. HTML-listan skapas från arrayens innehåll.
let names = ["Olle", "Lisa", "Kalle", "Elin", "Johan", "Linda"];

const nameList = document.querySelector("#name-list");
const addForm = document.querySelector("#add-form");
const nameInput = document.querySelector("#name-input");
const resetButton = document.querySelector("#reset-button");
const statusText = document.querySelector("#status");

// null = ingen redigering pågår. Annars är värdet indexet i arrayen.
let editingIndex = null;

function showStatus(message) {
  statusText.textContent = message;
}

// Uppdatera HTML varje gång arrayen har ändrats.
function renderNames() {
  nameList.innerHTML = "";

  if (names.length === 0) {
    const emptyRow = document.createElement("li");
    emptyRow.className = "name-row empty-state";
    emptyRow.textContent = "Listan är tom. Lägg till ett namn!";
    nameList.appendChild(emptyRow);
    return;
  }

  names.forEach(function (name, index) {
    const row = document.createElement("li");
    row.className = "name-row";

    if (editingIndex === index) {
      // Visa ett fält för att ändra ett befintligt namn.
      const editForm = document.createElement("form");
      editForm.className = "edit-form";

      const editInput = document.createElement("input");
      editInput.type = "text";
      editInput.className = "edit-input";
      editInput.value = name;
      editInput.maxLength = 60;
      editInput.required = true;
      editInput.setAttribute("aria-label", "Redigera " + name);

      const saveButton = document.createElement("button");
      saveButton.type = "submit";
      saveButton.className = "small-button";
      saveButton.textContent = "Spara";

      const cancelButton = document.createElement("button");
      cancelButton.type = "button";
      cancelButton.className = "small-button cancel";
      cancelButton.textContent = "Avbryt";

      editForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const newName = editInput.value.trim();

        if (newName === "") {
          showStatus("Skriv ett namn innan du sparar.");
          editInput.focus();
          return;
        }

        names[index] = newName; // Ändra posten i arrayen.
        editingIndex = null;
        renderNames();
        showStatus(name + " ändrades till " + newName + ".");
      });

      cancelButton.addEventListener("click", function () {
        editingIndex = null;
        renderNames();
        showStatus("Redigeringen avbröts.");
      });

      editInput.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
          editingIndex = null;
          renderNames();
          showStatus("Redigeringen avbröts.");
        }
      });

      editForm.append(editInput, saveButton, cancelButton);
      row.appendChild(editForm);
    } else {
      const nameText = document.createElement("span");
      nameText.className = "name-text";
      nameText.textContent = name;

      const actions = document.createElement("div");
      actions.className = "row-actions";

      const editButton = document.createElement("button");
      editButton.type = "button";
      editButton.className = "icon-button edit-button";
      editButton.textContent = "✎";
      editButton.title = "Redigera " + name;
      editButton.setAttribute("aria-label", "Redigera " + name);
      editButton.addEventListener("click", function () {
        editingIndex = index;
        renderNames();
      });

      const removeButton = document.createElement("button");
      removeButton.type = "button";
      removeButton.className = "icon-button remove-button";
      removeButton.title = "Ta bort " + name;
      removeButton.setAttribute("aria-label", "Ta bort " + name);

      const removeSymbol = document.createElement("span");
      removeSymbol.className = "remove-symbol";
      removeSymbol.setAttribute("aria-hidden", "true");
      removeSymbol.textContent = "×";
      removeButton.appendChild(removeSymbol);

      removeButton.addEventListener("click", function () {
        names.splice(index, 1); // Ta bort en post från arrayen.

        // Behåll rätt index om någon annan rad håller på att redigeras.
        if (editingIndex === index) {
          editingIndex = null;
        } else if (editingIndex !== null && editingIndex > index) {
          editingIndex--;
        }

        renderNames();
        showStatus(name + " togs bort.");
      });

      actions.append(editButton, removeButton);
      row.append(nameText, actions);
    }

    nameList.appendChild(row);
  });

  // Sätt markören i fältet när användaren klickar på redigera.
  if (editingIndex !== null) {
    nameList.querySelector(".edit-input").focus();
  }
}

// Lägg till nytt namn via formuläret.
addForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const newName = nameInput.value.trim();

  if (newName === "") {
    showStatus("Skriv ett namn först.");
    nameInput.focus();
    return;
  }

  names.push(newName); // Lägg till i arrayen.
  editingIndex = null;
  renderNames();
  nameInput.value = "";
  nameInput.focus();
  showStatus(newName + " lades till.");
});

// Nollställ tömmer hela arrayen.
resetButton.addEventListener("click", function () {
  names = [];
  editingIndex = null;
  renderNames();
  showStatus("Listan har nollställts.");
  nameInput.focus();
});

// Visa de sex startnamnen när sidan laddas.
renderNames();
