let serviceList = [];
let kitchenList = [];

function addWorker(role) {
  const list = role === "service" ? serviceList : kitchenList;
  const container = document.getElementById(`${role}-list`);

  const row = document.createElement("div");
  row.className = "worker-row";

  const nameInput = document.createElement("input");
  nameInput.placeholder = "Name";
  nameInput.type = "text";

  const hoursInput = document.createElement("input");
  hoursInput.placeholder = "Stunden";
  hoursInput.type = "number";

  const removeBtn = document.createElement("button");
  removeBtn.textContent = "🗑";
  removeBtn.style.backgroundColor = "#ef4444";
  removeBtn.onclick = () => {
    container.removeChild(row);
    list.splice(list.indexOf(worker), 1);
  };

  const worker = { nameInput, hoursInput };
  list.push(worker);

  row.appendChild(nameInput);
  row.appendChild(hoursInput);
  row.appendChild(removeBtn);
  container.appendChild(row);
}

function calculate() {
  const resultBox = document.getElementById("result");
  const total = parseFloat(document.getElementById("total").value);
  if (isNaN(total)) {
    resultBox.textContent = "❌ Bitte gültiges Trinkgeld eingeben.";
    return;
  }

  const serviceData = serviceList
    .map(w => ({ name: w.nameInput.value, hours: parseFloat(w.hoursInput.value) }))
    .filter(w => w.name && !isNaN(w.hours));

  const kitchenData = kitchenList
    .map(w => ({ name: w.nameInput.value, hours: parseFloat(w.hoursInput.value) }))
    .filter(w => w.name && !isNaN(w.hours));

  const serviceHours = serviceData.reduce((sum, w) => sum + w.hours, 0);
  const kitchenHours = kitchenData.reduce((sum, w) => sum + w.hours, 0);

  if (serviceHours + kitchenHours === 0) {
    resultBox.textContent = "❌ Keine gültigen Stunden eingegeben.";
    return;
  }

  const servicePool = total * 0.8;
  const kitchenPool = total * 0.2;

  let output = "";

  serviceData.forEach(w => {
    const cut = (w.hours / serviceHours) * servicePool;
    output += `👤 ${w.name} (Service): ${cut.toFixed(2)} €\n`;
  });

  kitchenData.forEach(w => {
    const cut = (w.hours / kitchenHours) * kitchenPool;
    output += `👨‍🍳 ${w.name} (Küche): ${cut.toFixed(2)} €\n`;
  });

  const totalService = serviceData.reduce((sum, w) => sum + (w.hours / serviceHours) * servicePool, 0);
  const totalKitchen = kitchenData.reduce((sum, w) => sum + (w.hours / kitchenHours) * kitchenPool, 0);

  output += `\n🟢 Service gesamt: ${totalService.toFixed(2)} €\n`;
  output += `🔵 Küche gesamt: ${totalKitchen.toFixed(2)} €`;

  resultBox.textContent = output;
}
