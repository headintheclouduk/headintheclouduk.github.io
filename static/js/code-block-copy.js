<script>
document.querySelectorAll("pre").forEach((block) => {
  const button = document.createElement("button");
    button.innerText = "Copy";
    button.className = "copy-button";
    block.appendChild(button);

  button.addEventListener("click", () => {
    const code = block.querySelector("code");
    navigator.clipboard.writeText(code.innerText).then(() => {
        button.innerText = "Copied!";
      setTimeout(() => (button.innerText = "Copy"), 2000);
    });
  });
});
</script>
