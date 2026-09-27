const STORAGE_KEY = "kakeibo-records";
const form = document.querySelector("form");
const tableBody = document.querySelector("tbody");
const totalOutput = document.querySelector("#total");
const yenFormatter = new Intl.NumberFormat("ja-JP");

let records = loadRecords();

function loadRecords() {
  try {
    const savedRecords = localStorage.getItem(STORAGE_KEY);
    const parsedRecords = savedRecords ? JSON.parse(savedRecords) : [];
    return Array.isArray(parsedRecords) ? parsedRecords : [];
  } catch (error) {
    console.error("家計簿データを読み込めませんでした。", error);
    return [];
  }
}

function renderRecords() {
  tableBody.replaceChildren();

  if (records.length === 0) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.colSpan = 4;
    cell.textContent = "記録はありません";
    row.append(cell);
    tableBody.append(row);
    totalOutput.textContent = "0円";
    return;
  }

  let balance = 0;

  records.forEach((record) => {
    const row = document.createElement("tr");
    const values = [
      record.date,
      record.item,
      record.type === "income" ? "収入" : "支出",
      `${yenFormatter.format(record.amount)}円`,
    ];

    values.forEach((value) => {
      const cell = document.createElement("td");
      cell.textContent = value;
      row.append(cell);
    });

    tableBody.append(row);
    balance += record.type === "income" ? record.amount : -record.amount;
  });

  totalOutput.textContent = `${yenFormatter.format(balance)}円`;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const newRecord = {
    date: formData.get("date"),
    item: formData.get("item").trim(),
    type: formData.get("type"),
    amount: Number(formData.get("amount")),
  };
  const updatedRecords = [...records, newRecord];

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRecords));
    records = updatedRecords;
    renderRecords();
    form.reset();
  } catch (error) {
    console.error("家計簿データを保存できませんでした。", error);
    window.alert("データを保存できませんでした。ブラウザの保存領域を確認してください。");
  }
});

renderRecords();