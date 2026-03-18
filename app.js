const STORAGE_KEY = "memo-app-items";

const form = document.querySelector("#memo-form");
const input = document.querySelector("#memo-input");
const memoList = document.querySelector("#memo-list");
const memoCount = document.querySelector("#memo-count");
const clearCompletedButton = document.querySelector("#clear-completed");
const template = document.querySelector("#memo-item-template");

let memos = loadMemos();

function loadMemos() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveMemos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(memos));
}

function updateCount() {
  memoCount.textContent = `총 ${memos.length}개`;
}

function render() {
  memoList.innerHTML = "";

  memos.forEach((memo) => {
    const item = template.content.firstElementChild.cloneNode(true);
    const checkbox = item.querySelector(".toggle");
    const content = item.querySelector(".memo-content");
    const deleteButton = item.querySelector(".delete");

    checkbox.checked = memo.completed;
    content.textContent = memo.content;

    if (memo.completed) {
      item.classList.add("completed");
    }

    checkbox.addEventListener("change", () => {
      memo.completed = checkbox.checked;
      saveMemos();
      render();
    });

    deleteButton.addEventListener("click", () => {
      memos = memos.filter((item) => item.id !== memo.id);
      saveMemos();
      render();
    });

    memoList.append(item);
  });

  updateCount();
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const content = input.value.trim();
  if (!content) {
    return;
  }

  memos.unshift({
    id: crypto.randomUUID(),
    content,
    completed: false,
  });

  saveMemos();
  input.value = "";
  input.focus();
  render();
});

clearCompletedButton.addEventListener("click", () => {
  memos = memos.filter((memo) => !memo.completed);
  saveMemos();
  render();
});

render();
