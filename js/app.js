import data from "./data.js";
import updateTransactions from "./utils/transaction.js"
import initModal from "./utils/modal.js";

document.addEventListener('DOMContentLoaded', () => {
    initModal('addTransactionModal', 'btnOpenAddTransaction', 'btnCloseAddTransaction');
});

let existingTrans = [];
function loadTransactions() {
    existingTrans = JSON.parse(localStorage.getItem('myTransactions')) || [];
    updateTransactions(existingTrans);
}
loadTransactions();

// Add Transactions
function addTransaction(e){
    e.preventDefault();
    existingTrans = JSON.parse(localStorage.getItem('myTransactions')) || [];
    const formData = new FormData(addTrasactionForm);
    existingTrans = [new Object({
        id : crypto.randomUUID(),
        timestamp : Date.now(),
        date : formData.get('date-time'),
        time : new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}),
        description: formData.get('desc'),
        category: formData.get('category'),
        account: formData.get('account'),
        amount: parseFloat(formData.get('price'))
    }), ...existingTrans];

    localStorage.setItem('myTransactions', JSON.stringify(existingTrans));
    addTrasactionForm.reset();
    updateTransactions(existingTrans);
    loadDetailView();
}
const addTrasactionForm = document.querySelector('#addTrasactionForm');
addTrasactionForm.addEventListener('submit', addTransaction)

// Load Details Transaction View
function loadDetailView(){
    const detailDescEl = document.querySelector('#detail-desc');
    const detailDateEl = document.querySelector('#detail-date');
    const detailTimeEl = document.querySelector('#detail-time');
    const detailCategoryEl = document.querySelector('#detail-category');
    const detailAccountEl = document.querySelector('#detail-account');
    const detailAmountEl = document.querySelector('#detail-amount');

    existingTrans = JSON.parse(localStorage.getItem('myTransactions')) || [];

    const date = new Date(existingTrans[0].date);
    const formattedDate = date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
    
    detailDescEl.textContent = existingTrans[0].description;
    detailDateEl.textContent = formattedDate;
    detailTimeEl.textContent = existingTrans[0].time;
    detailCategoryEl.textContent = existingTrans[0].category;
    detailAccountEl.textContent = existingTrans[0].account;
    detailAmountEl.textContent = `₹${existingTrans[0].amount}`;


}
loadDetailView();