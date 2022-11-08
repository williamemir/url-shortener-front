const form = document.getElementById("form");
const input = document.getElementById("URL");
const linkWrapper = document.getElementById("link-wrapper");
const errorDiv = document.getElementById("error");

const shortenedLink = document.getElementById("short-link");

const handleSubmit = async () => {
  let url = document.getElementById("URL").value;
  let short_id = "AUTO"
  let consume_url = "http://localhost:8000/link"
  const response = await fetch(consume_url, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({ "url": url, "id": short_id }),
  }).then((response) => response.json());

  console.log(response);

  if (response.type == "failure") {
    errorDiv.textContent = `Se presento un error: ${response.message}`;
  }
  if (response.type == "success") {
    linkWrapper.style.opacity = 1;
    linkWrapper.style.scale = 1;
    linkWrapper.style.display = "flex";
    shortenedLink.textContent = response.message;
  }
};

 // Clear input field and error message
const clearFields = () => {
  let url = document.getElementById("URL");
  url.value = '';
  url.addEventListener('focus', () => {
    errorDiv.textContent = '';
  })
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  handleSubmit();
  clearFields();
});