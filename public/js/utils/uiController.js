export const setModalMode = (mode) => {
    const btn = document.querySelector('#addTransactionBtn');

    if (mode === 'edit') {
        btn.textContent = "Update Transaction";
    } else {
        btn.textContent = "Add Transaction";
    }
}