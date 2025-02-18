document.addEventListener("DOMContentLoaded", async () => {
  const selectBox = document.getElementById("file-select");
  const editorContent = document.getElementById("editor-content");
  const editorForm = document.getElementById("editor-form");
  const saveButton = document.getElementById("save-button");

  // Step 1: Fetch and populate the list of files
  async function populateSelectBox() {
    try {
      // Fetch the list of files
      const response = await fetch("/files");
      const files = await response.json();

      selectBox.innerHTML = "";

      // Add a default option
      const defaultOption = document.createElement("option");
      defaultOption.textContent = "Select a file";
      defaultOption.value = "";
      selectBox.appendChild(defaultOption);

      // Add options dynamically
      files.forEach((file) => {
        let option = document.createElement("option");
        option.textContent = file;
        selectBox.appendChild(option);
      });

      // Add an event listener to load file content when selected
      selectBox.addEventListener("change", async (event) => {
        const selectedFile = event.target.value;
        if (selectedFile) {
          const fileResponse = await fetch(`/${selectedFile}`);
          const content = await fileResponse.text();
          editorContent.textContent = content;
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  editorForm.addEventListener("submit", (e) => {
    e.preventDefault();

    let fileValue = editorContent.textContent;

    let response = fetch({});

    try {
    } catch (error) {}
  });
  populateSelectBox();
});
