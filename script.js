let currentListId = null;
let currentListName = '';

async function loadLists() {
  const res = await fetch('api.php?action=get_lists');
  const lists = await res.json();
  const listContainer = document.getElementById('listContainer');
  listContainer.innerHTML = '';
  lists.forEach(list => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span>${list.name}</span>
      <button onclick="openList(${list.id}, '${list.name}')">Buka</button>
    `;
    listContainer.appendChild(li);
  });
}

async function createList() {
  const name = document.getElementById('listInput').value.trim();
  if (!name) return alert('Nama list tidak boleh kosong!');
  await fetch('api.php?action=create_list', {
    method: 'POST',
    body: new URLSearchParams({ name })
  });
  document.getElementById('listInput').value = '';
  loadLists();
}

function openList(id, name) {
  currentListId = id;
  currentListName = name;
  document.getElementById('activeListName').innerText = name;
  document.getElementById('taskHeader').style.display = 'block';
  document.getElementById('taskContainer').innerHTML = `
    <button onclick="openModal()">+ Tambah Tugas</button>
  `;
  loadTasks();
}

async function loadTasks() {
  const res = await fetch('api.php?action=get_tasks&list_id=' + currentListId);
  const tasks = await res.json();
  const container = document.getElementById('taskContainer');
  container.innerHTML = `
    <button onclick="openModal()">+ Tambah Tugas</button>
  `;
  tasks.forEach(task => {
    const li = document.createElement('li');
    li.className = task.status === 'done' ? 'done' : '';
    li.innerHTML = `
      <span>${task.name}</span>
      <div>
        <button onclick="editTask(${task.id}, '${task.name}')">✏️</button>
        <button onclick="toggleTask(${task.id}, '${task.status}')">✔️</button>
        <button onclick="deleteTask(${task.id})">🗑️</button>
      </div>
    `;
    container.appendChild(li);
  });
}

// === Modal Function ===
function openModal() {
  document.getElementById('taskModal').style.display = 'block';
}

function closeModal() {
  document.getElementById('taskModal').style.display = 'none';
}

// === CRUD TASK ===
async function createTask() {
  const name = document.getElementById('taskInput').value.trim();
  if (!name) return alert('Nama tugas tidak boleh kosong!');
  await fetch('api.php?action=create_task', {
    method: 'POST',
    body: new URLSearchParams({ name, list_id: currentListId })
  });
  document.getElementById('taskInput').value = '';
  closeModal();
  loadTasks();
}

async function toggleTask(id, status) {
  const newStatus = status === 'done' ? 'pending' : 'done';
  await fetch('api.php?action=update_task', {
    method: 'POST',
    body: new URLSearchParams({ id, status: newStatus })
  });
  loadTasks();
}

// === 🆕 EDIT TASK ===
async function editTask(id, oldName) {
  const newName = prompt('Edit nama tugas:', oldName);
  if (!newName || newName.trim() === '') return;
  
  await fetch('api.php?action=edit_task', {
    method: 'POST',
    body: new URLSearchParams({ id, name: newName })
  });
  
  loadTasks();
}

async function deleteTask(id) {
  await fetch('api.php?action=delete_task', {
    method: 'POST',
    body: new URLSearchParams({ id })
  });
  loadTasks();
}

window.onclick = function(event) {
  const modal = document.getElementById('taskModal');
  if (event.target == modal) {
    closeModal();
  }
}

loadLists();
