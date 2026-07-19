async function addQuote() {
  const quote = document.getElementById("quote").value.trim();

  if (!quote) {
    document.getElementById("status").innerText = "Please enter a quote.";
    return;
  }

  const res = await fetch("/add-quote", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ quote }),
  });

  const data = await res.json();

  document.getElementById("status").innerText = data.message;
}

async function generate() {
  const quote = document.getElementById("quote").value.trim();

  if (!quote) {
    alert("Enter a quote");
    return;
  }

  const response = await fetch("/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      quote,
    }),
  });

  if (!response.ok) {
    alert("Generation failed");
    return;
  }

  const data = await response.json();

  console.log(data.imageUrl);

  document.getElementById("status").innerText = "Uploaded successfully!";

  document.getElementById("quote").value = "";
}
  