export const getFormData = (formElement) => {
    const formData = new FormData(formElement);
    const type = formData.get("type") || "debit";
    let amount = parseFloat(formData.get("price")) || 0;
    amount = type === "debit" ? -Math.abs(amount) : Math.abs(amount);

    return {
        date: formData.get("date-time"),
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        description: formData.get("desc"),
        category: formData.get("category"),
        account: formData.get("account"),
        amount: amount,
    }
}

export const fillForm = (formElement, data, formattedDate) => {
    formElement.querySelector('#transactionId').value = data._id;
    formElement.querySelector('#transaction_price').value = Math.abs(data.amount);
    formElement.querySelector('#transaction_date').value = formattedDate;
    formElement.querySelector('#transaction_account').value = data.account;
    formElement.querySelector('#transaction_desc').value = data.description;
    formElement.querySelector(`input[value="${data.category}"]`).checked = true;

    const typeVal = data.amount >= 0 ? "credit" : "debit";
    const typeRadio = formElement.querySelector(`input[name="type"][value="${typeVal}"]`);
    if (typeRadio) typeRadio.checked = true;
}