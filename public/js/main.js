// FRONT-END (CLIENT) JAVASCRIPT HERE
const update = async function( event ) {
  const response = await fetch("/submit", {
    method: "PATCH",
    body
  })
}
const submit = async function( event ) {
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
  event.preventDefault();

  const form = document.querySelector("#myForm");
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const formData = new FormData(form);
  const json = Object.fromEntries(formData.entries());
  const body = JSON.stringify(json);

  const response = await fetch( "/submit", {
    method:"POST",
    headers: { "Content-Type": "application/json" },
    body
  })

  const newData = await response.json()

  console.log( "All Data:", newData );
  form.reset();
  await loadData();
}

window.onload = function() {
  const button = document.querySelector("button");
  button.onclick = submit;
  loadData();
}

async function loadData() {
  const response = await fetch("/results");
  const data = await response.json();

  const table = document.querySelector('#dataTable');
  table.innerHTML = "";

  const header = document.createElement('tr');
  header.innerHTML = `
                <th>Format</th>
                <th>Title</th>
                <th>Genre</th>
                <th>Rating</th>
                <th>Watched</th>
                <th>Episodes</th>
                <th>Progress</th>
                <th></th>`;
  table.appendChild(header);

  data.forEach((item, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
                  <td contenteditable="true" data-index="${index}" data-field="format">${item.format}</td>
                  <td contenteditable="true" data-index="${index}" data-field="title">${item.title}</td>
                  <td contenteditable="true" data-index="${index}" data-field="genre">${item.genre}</td>
                  <td class="aligned" contenteditable="true" data-index="${index}" data-field="rating">${item.rating}</td>
                  <td class="aligned" contenteditable="true" data-index="${index}" data-field="watched">${item.watched}</td>
                  <td class="aligned" contenteditable="true" data-index="${index}" data-field="episodes">${item.episodes}</td>
                  <td class="aligned">${item.progress}</td>
                  <td><button class="deleteButton">Delete</button></td>`;

    table.appendChild(row);
    row.querySelector(".deleteButton").addEventListener("click", async() => {
      await fetch(`/delete?index=${index}`, {
        method:"DELETE"
      })
      await loadData();
    })
  })
}

document.addEventListener("blur", async (e) => {
  const edit = e.target;
  if (!edit.matches('td[contenteditable="true"]')) {
    return;
  }

  const index = Number(edit.dataset.index);
  const field = edit.dataset.field;
  const newInfo = edit.textContent.trim();
  const body = JSON.stringify({index, field, newInfo});

  await fetch("/update", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body
  })

  await loadData();
}, true)