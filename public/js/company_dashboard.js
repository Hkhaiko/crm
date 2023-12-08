document.addEventListener("DOMContentLoaded", () => {
  const addCompanyButton = document.getElementById("addCompanyBoutton");
  const addCompanyModal = document.getElementById("addCompanyModal");

  const closeModal = document.getElementById("closeModal");
  const table = document.querySelector("table");
  const searchInput = document.querySelector("#searchInput");

  // Search Input
  searchInput.addEventListener("input", (e) => {
    const searchTerm = e.target.value;
    const filteredRows = table.querySelectorAll(".table-row");

    filteredRows.forEach((row) => {
      const rowData = row.cells;
      const fullName = rowData[1].textContent;

      if (fullName.toLowerCase().includes(searchTerm.toLowerCase())) {
        row.style.display = "table-row";
      } else {
        row.style.display = "none";
      }
    });
  });

  //Add contact Popup
  addCompanyButton.addEventListener("click", () => {
    console.log("tessq");
    addCompanyModal.style.display = "block";
  });

  closeModal.addEventListener("click", () => {
    addCompanyModal.style.display = "none";
  });

  window.addEventListener("click", (event) => {
    if (event.target === addCompanyModal) {
      addCompanyModal.style.display = "none";
    }
  });
});
