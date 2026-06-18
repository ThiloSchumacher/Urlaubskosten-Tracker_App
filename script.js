const STORAGE_KEY = 'urlaub_expenses';
let expenses = [];

// Beim Start laden
function loadExpenses() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        try {
            expenses = JSON.parse(stored);
        } catch (e) {
            expenses = [];
        }
    }
    renderExpenses();
}

// Speichern
function saveExpenses() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
}

// Formular auslesen und neue Ausgabe hinzufügen
function addExpense() {
    const nameInput = document.getElementById('expenseName');
    const amountInput = document.getElementById('expenseAmount');

    const name = nameInput.value.trim();
    const amount = parseFloat(amountInput.value);

    if (!name) {
        alert('Bitte einen Namen eingeben.');
        return;
    }
    if (isNaN(amount) || amount <= 0) {
        alert('Bitte einen gültigen Betrag eingeben.');
        return;
    }

    const expense = {
        id: Date.now(),
        name: name,
        amount: Math.round(amount * 100) / 100, // Auf 2 Dezimalstellen runden
        date: new Date().toISOString()
    };

    expenses.unshift(expense); // Neueste oben einfügen
    saveExpenses();
    renderExpenses();

    // Formular leeren
    nameInput.value = '';
    amountInput.value = '';
    nameInput.focus();
}

// Ausgabe löschen
function deleteExpense(id) {
    expenses = expenses.filter(e => e.id !== id);
    saveExpenses();
    renderExpenses();
}

// Betrag formatieren
function formatAmount(amount) {
    return amount.toFixed(2).replace('.', ',') + ' €';
}

// Datum formatieren
function formatDate(isoString) {
    const d = new Date(isoString);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${day}.${month}.${year}, ${hours}:${minutes}`;
}

// Liste neu rendern
function renderExpenses() {
    const list = document.getElementById('expenseList');
    const emptyState = document.getElementById('emptyState');

    // Gesamtbetrag berechnen
    const total = expenses.reduce((sum, e) => sum + e.amount, 0);
    const half = total / 2;

    // Zusammenfassung aktualisieren
    document.getElementById('totalAmount').textContent = formatAmount(total);
    document.getElementById('halfAmount').textContent = formatAmount(half);

    // Vorhandene Einträge löschen (außer emptyState)
    list.querySelectorAll('.expense-item').forEach(el => el.remove());

    if (expenses.length === 0) {
        emptyState.style.display = '';
        return;
    }

    emptyState.style.display = 'none';

    expenses.forEach(expense => {
        const item = document.createElement('div');
        item.className = 'expense-item';
        item.innerHTML = `
            <div class="expense-info">
                <div class="expense-name">${escapeHtml(expense.name)}</div>
                <div class="expense-date">${formatDate(expense.date)}</div>
            </div>
            <div class="expense-amount">${formatAmount(expense.amount)}</div>
            <button class="delete-btn" onclick="deleteExpense(${expense.id})" title="Löschen">🗑️</button>
        `;
        list.appendChild(item);
    });
}

// Einfacher XSS-Schutz
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Enter-Taste im Formular abfangen
document.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && (e.target.id === 'expenseName' || e.target.id === 'expenseAmount')) {
        e.preventDefault();
        addExpense();
    }
});

// App starten
loadExpenses();
