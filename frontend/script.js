// personal-budget-manager/frontend/script.js

const API_URL = 'http://127.0.0.1:5000'; // Adres Twojego backendu Flask

// Elementy DOM
const balanceSpan = document.getElementById('current-balance');
const transactionForm = document.getElementById('transaction-form');
const transactionsList = document.getElementById('transactions-list');
const expensesChartCanvas = document.getElementById('expenses-chart');

// Nowe elementy DOM dla formularza edycji
const formTitle = document.getElementById('title');
const formAmount = document.getElementById('amount');
const formCategory = document.getElementById('category');
const formType = document.getElementById('type');
const formDate = document.getElementById('date');
const formSubmitButton = transactionForm.querySelector('button[type="submit"]');

let expensesChart; // Zmienna na instancję Chart.js
let isEditing = false; // Flaga określająca, czy jesteśmy w trybie edycji
let editingTransactionId = null; // Przechowuje ID transakcji, którą edytujemy

// --- Funkcje pomocnicze do komunikacji z API i aktualizacji UI ---

/**
 * Pobiera wszystkie transakcje z backendu.
 * @returns {Array} Lista obiektów transakcji.
 */
async function fetchTransactions() {
    try {
        const response = await fetch(`${API_URL}/transactions`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const transactions = await response.json();
        return transactions;
    } catch (error) {
        console.error("Błąd podczas pobierania transakcji:", error);
        alert("Nie udało się pobrać transakcji. Sprawdź, czy backend działa.");
        return [];
    }
}

/**
 * Pobiera pojedynczą transakcję z backendu.
 * @param {number} id ID transakcji do pobrania.
 * @returns {Object} Obiekt transakcji.
 */
async function fetchTransactionById(id) {
    try {
        const response = await fetch(`${API_URL}/transactions/${id}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const transaction = await response.json();
        return transaction;
    } catch (error) {
        console.error(`Błąd podczas pobierania transakcji o ID ${id}:`, error);
        alert(`Nie udało się pobrać transakcji o ID ${id}.`);
        return null;
    }
}


/**
 * Oblicza całkowite saldo i aktualizuje element DOM.
 * @param {Array} transactions Lista transakcji.
 */
function updateBalance(transactions) {
    const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

    const balance = totalIncome - totalExpense;
    balanceSpan.textContent = `${balance.toFixed(2)} PLN`;
    balanceSpan.style.color = balance >= 0 ? '#27ae60' : '#e74c3c';
}

/**
 * Wyświetla listę transakcji w UI.
 * @param {Array} transactions Lista transakcji do wyświetlenia.
 */
function displayTransactions(transactions) {
    transactionsList.innerHTML = '';
    transactions.sort((a, b) => new Date(b.date) - new Date(a.date));

    if (transactions.length === 0) {
        transactionsList.innerHTML = '<li class="no-transactions">Brak transakcji do wyświetlenia. Dodaj pierwszą!</li>';
        return;
    }

    transactions.forEach(transaction => {
        const li = document.createElement('li');
        li.classList.add('transaction-item', transaction.type);
        li.dataset.id = transaction.id;

        const date = new Date(transaction.date);
        const formattedDate = date.toLocaleDateString('pl-PL', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });

        li.innerHTML = `
            <div class="transaction-details">
                <h3>${transaction.title}</h3>
                <p>Kwota: ${transaction.amount.toFixed(2)} PLN</p>
                <p>Kategoria: ${transaction.category}</p>
                <p>Data: ${formattedDate}</p>
            </div>
            <div class="transaction-actions">
                <button class="edit-btn" data-id="${transaction.id}">Edytuj</button>
                <button class="delete-btn" data-id="${transaction.id}">Usuń</button>
            </div>
        `;
        transactionsList.appendChild(li);
    });
}

/**
 * Rysuje wykres kołowy przedstawiający podział wydatków na kategorie.
 * @param {Array} transactions Lista transakcji.
 */
function drawExpensesChart(transactions) {
    const expenseTransactions = transactions.filter(t => t.type === 'expense');

    const categoryExpenses = expenseTransactions.reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
    }, {});

    const categories = Object.keys(categoryExpenses);
    const amounts = Object.values(categoryExpenses);

    const backgroundColors = categories.map(() => `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.7)`);
    const borderColors = backgroundColors.map(color => color.replace('0.7', '1'));

    if (expensesChart) {
        expensesChart.destroy();
    }

    expensesChart = new Chart(expensesChartCanvas, {
        type: 'pie',
        data: {
            labels: categories,
            datasets: [{
                data: amounts,
                backgroundColor: backgroundColors,
                borderColor: borderColors,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Podział wydatków na kategorie'
                }
            }
        }
    });
}

/**
 * Resetuje formularz do stanu początkowego (tryb dodawania).
 */
function resetForm() {
    transactionForm.reset();
    formCategory.value = ''; // Upewnij się, że kategoria jest zresetowana
    isEditing = false;
    editingTransactionId = null;
    formSubmitButton.textContent = 'Dodaj Transakcję'; // Zmień tekst przycisku
    formSubmitButton.style.backgroundColor = '#3498db'; // Przywróć domyślny kolor
}

/**
 * Główna funkcja inicjalizująca aplikację: pobiera dane, aktualizuje saldo, wyświetla listę i rysuje wykres.
 */
async function initApp() {
    const transactions = await fetchTransactions();
    updateBalance(transactions);
    displayTransactions(transactions);
    drawExpensesChart(transactions);
    resetForm(); // Zawsze resetuj formularz przy inicjalizacji/odświeżeniu
}

// --- Obsługa zdarzeń ---

// Obsługa formularza dodawania/edycji transakcji
transactionForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = formTitle.value.trim();
    const amount = parseFloat(formAmount.value);
    const category = formCategory.value;
    const type = formType.value;
    const dateInput = formDate.value;

    // Walidacja danych na froncie
    if (!title || isNaN(amount) || amount <= 0 || !category || !type || !dateInput) {
        alert('Proszę wypełnić wszystkie pola poprawnie: Tytuł, Kwota (liczba > 0), Kategoria, Typ, Data.');
        return;
    }

    const date = new Date(dateInput);
    const isoDateString = date.toISOString();

    const transactionData = {
        title,
        amount,
        category,
        type,
        date: isoDateString
    };

    try {
        let response;
        if (isEditing) {
            // Tryb edycji: wysyłamy PUT
            response = await fetch(`${API_URL}/transactions/${editingTransactionId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(transactionData),
            });
        } else {
            // Tryb dodawania: wysyłamy POST
            response = await fetch(`${API_URL}/transactions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(transactionData),
            });
        }

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Błąd HTTP! Status: ${response.status}, Wiadomość: ${errorData.message || 'Nieznany błąd'}`);
        }

        initApp(); // Po pomyślnym dodaniu/edycji odśwież dane
        alert(`Transakcja ${isEditing ? 'zaktualizowana' : 'dodana'} pomyślnie!`);

    } catch (error) {
        console.error(`Błąd podczas ${isEditing ? 'aktualizacji' : 'dodawania'} transakcji:`, error);
        alert(`Wystąpił błąd podczas ${isEditing ? 'aktualizacji' : 'dodawania'} transakcji: ${error.message}`);
    }
});

// Obsługa kliknięć na przyciskach w liście transakcji (edycja/usuwanie)
transactionsList.addEventListener('click', async (e) => {
    // Obsługa usuwania transakcji
    if (e.target.classList.contains('delete-btn')) {
        const id = e.target.dataset.id;
        if (confirm('Czy na pewno chcesz usunąć tę transakcję?')) {
            try {
                const response = await fetch(`${API_URL}/transactions/${id}`, {
                    method: 'DELETE',
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(`Błąd HTTP! Status: ${response.status}, Wiadomość: ${errorData.message || 'Nieznany błąd'}`);
                }

                // Animacja usuwania:
                const listItem = e.target.closest('.transaction-item');
                if (listItem) {
                    listItem.classList.add('fade-out');
                    listItem.addEventListener('transitionend', () => {
                        initApp(); // Po zakończeniu animacji odśwież listę
                    });
                }

            } catch (error) {
                console.error("Błąd podczas usuwania transakcji:", error);
                alert(`Wystąpił błąd podczas usuwania transakcji: ${error.message}`);
            }
        }
    }

    // Obsługa edycji transakcji
    if (e.target.classList.contains('edit-btn')) {
        const id = e.target.dataset.id;
        const transactionToEdit = await fetchTransactionById(id);

        if (transactionToEdit) {
            // Ustaw flagę trybu edycji i ID
            isEditing = true;
            editingTransactionId = id;

            // Wypełnij formularz danymi z transakcji
            formTitle.value = transactionToEdit.title;
            formAmount.value = transactionToEdit.amount;
            formCategory.value = transactionToEdit.category;
            formType.value = transactionToEdit.type;

            // Formatowanie daty do input[type="datetime-local"]
            // Flask zwraca datę w formacie ISO z 'Z', input oczekuje 'YYYY-MM-DDTHH:MM'
            const dateObj = new Date(transactionToEdit.date);
            const year = dateObj.getFullYear();
            const month = String(dateObj.getMonth() + 1).padStart(2, '0');
            const day = String(dateObj.getDate()).padStart(2, '0');
            const hours = String(dateObj.getHours()).padStart(2, '0');
            const minutes = String(dateObj.getMinutes()).padStart(2, '0');
            formDate.value = `${year}-${month}-${day}T${hours}:${minutes}`;

            // Zmień tekst i styl przycisku
            formSubmitButton.textContent = 'Zapisz Zmiany';
            formSubmitButton.style.backgroundColor = '#f39c12'; // Kolor edycji

            // Przewiń do formularza, aby użytkownik widział, że może edytować
            formTitle.focus(); // Ustaw focus na pierwszym polu
        }
    }
});

// Inicjalizacja aplikacji po całkowitym załadowaniu DOM
document.addEventListener('DOMContentLoaded', initApp);