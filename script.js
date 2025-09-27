const availableTables = [
    { number: 1 },
    { number: 2 },
    { number: 3 },
    { number: 4 },
    { number: 5 },
    { number: 6 },
    { number: 7 },
    { number: 8 },
    { number: 9 },
    { number: 10 },
    { number: 11 },
    { number: 12 },
];

const occupiedTables = [];

let reportGenerated = false;

document.addEventListener("DOMContentLoaded", () => {
    renderTables();
    document.getElementById("reserveButton").addEventListener("click", reserveTable);
    document.getElementById("reportButton").addEventListener("click", generateReport);

    document.getElementById("reservationDate").addEventListener("change", renderTables);
    document.getElementById("reservationTime").addEventListener("change", renderTables);
});

// Función para convertir hora 24h a formato 12h AM/PM
function formatTime12h(time24) {
    if (!time24) return "";
    const [hourStr, minute] = time24.split(":");
    let hour = parseInt(hourStr, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12;
    if (hour === 0) hour = 12;
    return `${hour}:${minute} ${ampm}`;
}

function renderTables() {
    const availableTablesDiv = document.getElementById("availableTables");
    const occupiedTablesDiv = document.getElementById("occupiedTables");

    availableTablesDiv.innerHTML = "";
    occupiedTablesDiv.innerHTML = "";

    availableTables.forEach(table => {
        const isReserved = occupiedTables.some(r => r.number === table.number);

        const tableDiv = document.createElement("div");
        tableDiv.className = "table";
        tableDiv.innerHTML = `<img src="gnop.jpg" alt="Mesa ${table.number}"><div class="table-name">Mesa ${table.number}</div>`;

        if (!isReserved) {
            const reserveButton = document.createElement("button");
            reserveButton.className = "button";
            reserveButton.textContent = "Reservar";
            reserveButton.onclick = () => reserveTableByNumber(table.number);
            tableDiv.appendChild(reserveButton);
        } else {
            const occupiedLabel = document.createElement("div");
            occupiedLabel.className = "occupied-label";
            occupiedLabel.textContent = "Ocupada";
            tableDiv.appendChild(occupiedLabel);
        }

        availableTablesDiv.appendChild(tableDiv);
    });

    if (occupiedTables.length > 0) {
        occupiedTables.forEach(table => {
            const tableDiv = document.createElement("div");
            tableDiv.className = "table";

            const formattedTime = formatTime12h(table.time);
            const infoText = reportGenerated
                ? `${table.customer}<br>Fecha: ${table.date}<br>Hora: ${formattedTime}`
                : "Reservada";

            tableDiv.innerHTML = `<img src="descarga.jpg" alt="Mesa ${table.number}">
                <div class="table-name">Mesa ${table.number}</div>
                <div style="font-size:0.8rem; text-align:center; margin-top:5px;">
                    ${infoText}
                </div>`;

            const releaseButton = document.createElement("button");
            releaseButton.className = "button";
            releaseButton.textContent = "Liberar";
            releaseButton.onclick = () => releaseTable(table.number, table.date, table.time);
            tableDiv.appendChild(releaseButton);
            occupiedTablesDiv.appendChild(tableDiv);
        });
    } else {
        occupiedTablesDiv.innerHTML = "<p style='text-align:center;'>No hay reservas actuales.</p>";
    }
}

function reserveTableByNumber(tableNumber) {
    const customerName = document.getElementById("customerName").value.trim();
    const date = document.getElementById("reservationDate").value;
    const time = document.getElementById("reservationTime").value;

    if (!customerName) {
        alert("Por favor, ingresa un nombre válido.");
        return;
    }
    if (!date || !time) {
        alert("Por favor, selecciona fecha y hora para la reserva.");
        return;
    }

    const existingReservation = occupiedTables.find(
        r => r.number === tableNumber && r.date === date && r.time === time
    );
    if (existingReservation) {
        alert("La mesa ya está reservada para esa fecha y hora.");
        return;
    }

    occupiedTables.push({ number: tableNumber, customer: customerName, date, time });
    reportGenerated = false;
    renderTables();

    document.getElementById("customerName").value = "";
    document.getElementById("reservationDate").value = "";
    document.getElementById("reservationTime").value = "";
}

function reserveTable() {
    const customerName = document.getElementById("customerName").value.trim();
    const tableNumber = parseInt(document.getElementById("tableNumber").value);
    const date = document.getElementById("reservationDate").value;
    const time = document.getElementById("reservationTime").value;

    if (!customerName || isNaN(tableNumber) || tableNumber < 1 || tableNumber > availableTables.length) {
        alert("Por favor ingresa un nombre válido y un número de mesa.");
        return;
    }
    if (!date || !time) {
        alert("Por favor, selecciona fecha y hora para la reserva.");
        return;
    }

    const existingReservation = occupiedTables.find(
        r => r.number === tableNumber && r.date === date && r.time === time
    );
    if (existingReservation) {
        alert("La mesa ya está reservada para esa fecha y hora.");
        return;
    }

    occupiedTables.push({ number: tableNumber, customer: customerName, date, time });
    reportGenerated = false;
    renderTables();

    document.getElementById("customerName").value = "";
    document.getElementById("tableNumber").value = "";
    document.getElementById("reservationDate").value = "";
    document.getElementById("reservationTime").value = "";
}

function releaseTable(tableNumber, date, time) {
    const index = occupiedTables.findIndex(
        r => r.number === tableNumber && r.date === date && r.time === time
    );
    if (index !== -1) {
        occupiedTables.splice(index, 1);
        reportGenerated = false;
        renderTables();
    }
}

function generateReport() {
    const reportOutput = document.getElementById("reportOutput");
    reportOutput.textContent = "Reporte de Reservas Actuales:\n\n";

    if (occupiedTables.length === 0) {
        reportOutput.textContent += "No hay reservas actuales.";
        return;
    }

    occupiedTables.forEach(table => {
        const formattedTime = formatTime12h(table.time);
        reportOutput.textContent += `Mesa ${table.number} - Reservada por: ${table.customer} - Fecha: ${table.date} - Hora: ${formattedTime}\n`;
    });

    reportGenerated = true;
    renderTables();
}







