export const formatDate = (date) =>  {
  // Format Date
  const newdate = new Date(date);
  const formattedDate = newdate.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  return formattedDate;
}

export const formatCurrency = (amount) => {
  let newamount = String(amount);
  if (newamount.startsWith("-")) {
    newamount = newamount.slice(1);
    newamount = `- ₹${newamount}`;
  } else if (newamount == "0") {
    newamount = `₹${newamount}`;
  } else {
    newamount = `+ ₹${newamount}`;
  }
  return newamount
};
