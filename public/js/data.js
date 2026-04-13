export const getData = async () => {
  try {
    const response = await fetch("http://127.0.0.1:5000/api/transactions");
    if (!response.ok) {
      throw new Error(`Response Status: ${response.status}`);
    }
    const result = await response.json();
    // console.log(result.data);
    return result;
  } catch (error) {
    console.error(error.message);
  }
};

export const saveData = async (formData) => {
  const response = await fetch("http://127.0.0.1:5000/api/transactions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  const result = await response.json();
  return result;
};