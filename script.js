const form = document.getElementById("transaction-form");
const transactionList = document.getElementById("transaction-list");
const totalIncome = document.getElementById("total-income");
const totalExpense = document.getElementById("total-expense");
const netBalance = document.getElementById("net-balance");
const filterCategory = document.getElementById("filter-category");
const chartCanvas = document.getElementById("expense-chart");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

function renderTransactions(filter = "All") {
    transactionList.innerHTML = "";
    let income = 0, expense = 0;
    let categoryTotals = {};

    transactions.forEach((tx, index) => {
        if (filter !== "All" && tx.category !== filter) return;

        const li = document.createElement("li");
        li.classList.add(tx.category === "Income" ? "income" : "expense");
        li.innerHTML = `
      ${tx.date} - ${tx.description} (${tx.category}): ₹${tx.amount}
      <button onclick="deleteTransaction(${index})">❌</button>
    `;
        transactionList.appendChild(li);

        if (tx.category === "Income") {
            income += tx.amount;
        } else {
            expense += tx.amount;
            categoryTotals[tx.category] = (categoryTotals[tx.category] || 0) + tx.amount;
        }
    });

    totalIncome.textContent = income;
    totalExpense.textContent = expense;
    netBalance.textContent = income - expense;

    renderChart(categoryTotals);
}

function renderChart(data) {
    const labels = Object.keys(data);
    const values = Object.values(data);
    if (window.expenseChart) {
        window.expenseChart.destroy();
    }

    window.expenseChart = new Chart(chartCanvas, {
        type: 'pie',
        data: {
            labels,
            datasets: [{
                label: "Expenses by Category",
                data: values,
                backgroundColor: ['#ff6384', '#36a2eb', '#ffce56', '#4bc0c0'],
            }],
        },
    });
}

form.addEventListener("submit", function (e) {
    e.preventDefault();
    const date = document.getElementById("date").value;
    const description = document.getElementById("description").value.trim();
    const amount = parseFloat(document.getElementById("amount").value);
    const category = document.getElementById("category").value;

    if (!date || !description || !amount || !category) {
        alert("Please fill in all fields correctly.");
        return;
    }

    transactions.push({ date, description, amount, category });
    localStorage.setItem("transactions", JSON.stringify(transactions));
    form.reset();
    renderTransactions(filterCategory.value);
});

function deleteTransaction(index) {
    transactions.splice(index, 1);
    localStorage.setItem("transactions", JSON.stringify(transactions));
    renderTransactions(filterCategory.value);
}

filterCategory.addEventListener("change", () => {
    renderTransactions(filterCategory.value);
});

// Initial render
renderTransactions();

