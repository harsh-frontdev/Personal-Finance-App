import { formatDate } from "./helper.js";
import { updateDetailSidebar } from "./detailSidebar.js";

export default async function updateTransactions(data) {
  if(!data) return;

  // Destroy instance before mutating the DOM
  if (window.transactionDataTable) {
    window.transactionDataTable.destroy();
    window.transactionDataTable = null;
  }

  // Load Transaction
  const transactionDataEl = document.getElementById("transactionData");
  if (!transactionDataEl) return;
  transactionDataEl.innerHTML = "";
  if (data.length > 0) {
    data.forEach((element) => {

      const formattedDate = formatDate(element.date);
      
      let amountString, colorCode, amount;
      if (element.amount > 0) {
        colorCode = "text-primary";
        amount = parseFloat(element.amount);
        amountString = `+ ₹${amount}`;
      } else if(element.amount == 0) {
        colorCode = "text-primary";
        amountString = `₹${element.amount}`;
      } else {
        amount = String(element.amount);
        if (amount.startsWith("-")) {
          amount = amount.slice(1);
        }
        colorCode = "text-danger";
        amountString = `- ₹${amount}`;
      }

      transactionDataEl.innerHTML += `
              <tr data-id="${element._id}" class="group hover:bg-slate-50 transition-colors border-b border-border">
              <td class="px-6 py-4 align-middle">
                  <span class="font-medium text-sm text-main block">${formattedDate}</span>
                  <span class="text-xs text-muted mt-1 block">${element.time}</span>
              </td>
              <td class="px-6 py-4 align-middle">
                  <div class="flex items-center gap-4">
                      <div class="min-w-0">
                      <span class="font-bold text-sm text-main block truncate">
                          ${element.description}
                      </span>
                      </div>
                  </div>
              </td>
              <td class="px-6 py-4 align-middle">
                  <span class="inline-block px-2.5 py-1 rounded-full text-[0.65rem] font-bold uppercase tracking-wider bg-[#fefce8] text-[#ca8a04]">
                  ${element.category}
                  </span>
              </td>
              <td class="px-6 py-4 align-middle">
                  <span class="font-semibold text-sm text-main block truncate">
                  ${element.account}
                  </span>
              </td>
              <td class="px-6 py-4 align-middle font-bold text-right text-[1.05rem] ${colorCode}">
                  ${amountString}
              </td>
              </tr>
          `;
    });
  }

  // Initialize simple-datatables safely
  setTimeout(() => {
    const table = document.getElementById("transactionTable");
    if (table) {
      const datatable = new simpleDatatables.DataTable(table, {
        searchable: false,
        perPageSelect: false,
        paging: true,
        fixedHeight: false,
        pagination: true,
        sortable: false,
        labels: {
          info: "Showing {start}-{end} of {rows} transactions",
          noRows: "No transactions found",
        },
      });

      window.transactionDataTable = datatable;
    }
  }, 50);

  updateDetailSidebar(data[0]);

}