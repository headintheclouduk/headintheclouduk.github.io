document.querySelectorAll("pre").forEach((pre) => {
  const wrapper = document.createElement("div");
  wrapper.className = "code-block-wrapper";

  const container = document.createElement("div");
  container.className = "code-container";

  const stickyWrapper = document.createElement("div");
  stickyWrapper.className = "copy-sticky-wrapper";

  const button = document.createElement("button");
  button.className = "copy-button";
  button.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" 
         width="16" height="16" fill="currentColor" 
         viewBox="0 0 16 16" style="margin-right: 4px;">
      <path d="M10 1.5A1.5 1.5 0 0 1 11.5 3H13a2 2 0 0 1 2 2v9a2 
        2 0 0 1-2 2H6a2 2 0 0 1-2-2V12h1v2a1 1 0 0 0 1 1h7a1 1 
        0 0 0 1-1V5a1 1 0 0 0-1-1h-1.5A1.5 1.5 0 0 1 10 
        2.5V1.5zM4.5 0A1.5 1.5 0 0 0 3 1.5v11A1.5 1.5 0 0 0 
        4.5 14h6a1.5 1.5 0 0 0 1.5-1.5v-11A1.5 1.5 0 0 0 
        10.5 0h-6z"/>
    </svg>
    Copy`;

  pre.parentNode.insertBefore(wrapper, pre);
  wrapper.appendChild(container);
  container.appendChild(stickyWrapper);
  stickyWrapper.appendChild(button);
  container.appendChild(pre);

  button.addEventListener("click", () => {
    const code = pre.querySelector("code");
    if (!code) return;
    navigator.clipboard.writeText(code.innerText).then(() => {
      button.textContent = "✓ Copied!";
      setTimeout(() => {
        button.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" 
               width="16" height="16" fill="currentColor" 
               viewBox="0 0 16 16" style="margin-right: 4px;">
            <path d="M10 1.5A1.5 1.5 0 0 1 11.5 3H13a2 2 0 0 1 2 2v9a2 
              2 0 0 1-2 2H6a2 2 0 0 1-2-2V12h1v2a1 1 0 0 0 1 1h7a1 1 
              0 0 0 1-1V5a1 1 0 0 0-1-1h-1.5A1.5 1.5 0 0 1 10 
              2.5V1.5zM4.5 0A1.5 1.5 0 0 0 3 1.5v11A1.5 1.5 0 0 0 
              4.5 14h6a1.5 1.5 0 0 0 1.5-1.5v-11A1.5 1.5 0 0 0 
              10.5 0h-6z"/>
          </svg>
          Copy`;
      }, 1500);
    });
  });
});
