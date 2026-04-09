export default function updateTransactions(data) {
    // Get Number of Transaction
    const noOfTransaction = document.querySelector('#noOfTransaction');
    noOfTransaction.textContent = data.length;
    
    // Load Transaction
    const transactionDataEl = document.getElementById("transactionData");
    transactionDataEl.innerHTML = "";
    if(data.length > 0){
        data.forEach((element) => {
            transactionDataEl.innerHTML += `
                <div class="grid grid-cols-[1.5fr_2fr_1fr_1fr_1fr] gap-4 items-center px-6 py-4 border-b border-border hover:bg-slate-50 transition-colors">
                <div>
                    <span class="font-medium text-sm text-main block">${element.date}</span>
                    <span class="text-xs text-muted mt-1 block">${element.time}</span>
                </div>
                <div class="flex items-center gap-4">
                    <div class="min-w-0">
                    <span class="font-bold text-sm text-main block truncate">
                        ${element.description}
                    </span>
                    </div>
                </div>
                <div>
                    <span class="inline-block px-2.5 py-1 rounded-full text-[0.65rem] font-bold uppercase tracking-wider bg-[#fefce8] text-[#ca8a04]">
                    ${element.category}
                    </span>
                </div>
                <div>
                    <span class="font-semibold text-sm text-main block truncate">
                    ${element.account}
                    </span>
                </div>
                <div class="font-bold text-right text-[1.05rem] text-[#dc2626]">
                    ₹${element.amount}
                </div>
                </div>
            `;
        });
    } else {
        transactionDataEl.innerHTML += `
            <div class="flex flex-col items-center justify-center p-12 text-center border-t border-border">
                <span class="material-symbols-rounded text-4xl text-border mb-4">filter_list_off</span>
                <div class="font-bold text-main mb-2">No results found for current filters</div>
                <div class="text-sm text-muted max-w-[300px] mb-6 inline-block">Try adjusting your date range or
                removing specific category filters to see more activity.</div>
                <div class="text-sm font-semibold text-primary cursor-pointer hover:underline inline-block">Clear All
                Filters</div>
            </div>
        `;
    }
}


