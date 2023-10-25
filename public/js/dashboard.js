document.addEventListener('DOMContentLoaded', () => {
    const tableRows = document.querySelectorAll('.table-row');
    const popup = document.getElementById('popup');
    const popupContent = document.getElementById('popup-content');
    const closeModalUser = document.getElementById('closeModalUser');
    const addClientButton = document.getElementById('addClientBoutton');
    const addClientModal = document.getElementById('addClientmodal');
    const closeModal = document.getElementById('closeModal');
    const table = document.querySelector('table');
    const searchInput = document.querySelector('#searchInput');
    const importExcelButton = document.querySelector('#importExcel');


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

    //Close Popup
    closeModalUser.addEventListener('click', () => {
      popup.style.display = 'none';
    });
  
    window.addEventListener('click', (event) => {
      if (event.target === popup) {
        popup.style.display = 'none';
      }
    });
  
    // tableRows.forEach((row) => {
    //   row.addEventListener('click', () => {
    //     const rowData = row.cells;
    //     const certificationCode = rowData[0].textContent;
    //     const fullName = rowData[1].textContent;
    //     const company = rowData[2].textContent;
    //     const position = rowData[3].textContent;
    //     const email = rowData[4].textContent;
    //     const telephone = rowData[5].textContent;
    //     const date = rowData[6].textContent;
    //     const title = rowData[7].textContent;
    //     const futureTopics = rowData[8].textContent;
  
    //     popupContent.innerHTML = `
    //       <h2>${fullName}</h2>
    //       <p>Certification Code: ${certificationCode}</p>
    //       <p>Company: ${company}</p>
    //       <p>Position: ${position}</p>
    //       <p>Email: ${email}</p>
    //       <p>Telephone: ${telephone}</p>
    //       <p>Date: ${date}</p>
    //       <p>Title: ${title}</p>
    //       <p>Future Topics: ${futureTopics}</p>
    //     `;
    //     popup.style.display = 'block';
    //   });
    // });
  
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