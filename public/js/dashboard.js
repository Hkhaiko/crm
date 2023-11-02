document.addEventListener('DOMContentLoaded', () => {
    const addClientButton = document.getElementById('addClientBoutton');
    const addClientModal = document.getElementById('addClientmodal');
    const closeModal = document.getElementById('closeModal');
    const table = document.querySelector('table');
    const searchInput = document.querySelector('#searchInput');


    // Search Input
    searchInput.addEventListener('input', (e) => {
      const searchTerm = e.target.value;
      const filteredRows = table.querySelectorAll('.table-row');

      filteredRows.forEach((row) => {
        const rowData = row.cells;
        const fullName = rowData[1].textContent;

        if (fullName.toLowerCase().includes(searchTerm.toLowerCase())) {
          row.style.display = 'table-row';
        } else {
          row.style.display = 'none';
        }
      });
    });

    //Add Client Popup
    addClientButton.addEventListener('click', () => {
      addClientModal.style.display = 'block';
    });
  
    closeModal.addEventListener('click', () => {
      addClientModal.style.display = 'none';
    });
  
    window.addEventListener('click', (event) => {
      if (event.target === addClientModal) {
        addClientModal.style.display = 'none';
      }
    });

  });