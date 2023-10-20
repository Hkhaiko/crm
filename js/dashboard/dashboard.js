document.addEventListener('DOMContentLoaded', () => {
    const tableRows = document.querySelectorAll('.table-row');
    const popup = document.getElementById('popup');
    const popupContent = document.getElementById('popup-content');
    const closeModalUser = document.getElementById('closeModalUser');

    closeModal.addEventListener('click', () => {
      popup.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
      if (event.target === popup) {
        popup.style.display = 'none';
      }
    });


    tableRows.forEach((row) => {
        row.addEventListener('click', () => {
            const rowData = row.cells;
            const certificationCode = rowData[0].textContent;
            const fullName = rowData[1].textContent;
            const company = rowData[2].textContent;
            const position = rowData[3].textContent;
            const email = rowData[4].textContent;
            const telephone = rowData[5].textContent;
            const date = rowData[6].textContent;
            const title = rowData[7].textContent;
            const futureTopics = rowData[8].textContent;

            popupContent.innerHTML = `
                <h2>${fullName}</h2>
                <p>Certification Code: ${certificationCode}</p>
                <p>Company: ${company}</p>
                <p>Position: ${position}</p>
                <p>Email: ${email}</p>
                <p>Telephone: ${telephone}</p>
                <p>Date: ${date}</p>
                <p>Title: ${title}</p>
                <p>Future Topics: ${futureTopics}</p>
            `;
            popup.style.display = 'block';
        });
    });

 // Code JavaScript pour gérer l'ouverture et la fermeture de la boîte de dialogue
 const addClientBoutton = document.getElementById('addClientBoutton');
 const addClientModal = document.getElementById('addClientmodal');
 const closeModal = document.getElementById('closeModal');

 addClientBoutton.addEventListener('click', () => {
   addClientModal.style.display = 'block';
 });

 closeModal.addEventListener('click', () => {
   addClientModal.style.display = 'none';
 });

 // Fermer la boîte de dialogue lorsque l'utilisateur clique en dehors de la boîte
 window.addEventListener('click', (event) => {
   if (event.target === addClientModal) {
     addClientModal.style.display = 'none';
   }
 });


});

   