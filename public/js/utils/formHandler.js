export const getFormData = (formElement) => {
    const formData = new FormData(formElement);
    return {
        date: formData.get("date-time"),
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        description: formData.get("desc"),
        category: formData.get("category"),
        account: formData.get("account"),
        amount: parseFloat(formData.get("price")),
    }
}

export const fillForm = (formElement, data, formattedDate) => {
    formElement.querySelector('#transactionId').value = data._id;
    formElement.querySelector('#transaction_price').value = data.amount;
    formElement.querySelector('#transaction_date').value = formattedDate;
    formElement.querySelector('#transaction_account').value = data.account;
    formElement.querySelector('#transaction_desc').value = data.description;
    formElement.querySelector(`input[value="${data.category}"]`).checked = true;
}