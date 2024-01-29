document.addEventListener("DOMContentLoaded", function () {
  const editButtons = document.querySelectorAll(".js-edit");
  const saveButtons = document.querySelectorAll(".js-save");
  const addExperienceButton = document.getElementById("add-experience");
  const modalContent = document.querySelector(".experience-modal");
  const pdfPanel = document.getElementById("pdf-panel");
  const closeModalFormation = document.getElementById("close-formation-modal");
  const closeModalExperience = document.getElementById(
    "close-modal-experience"
  );
  const addExperienceModal = document.getElementById("add-experience-modal");
  const popup = document.getElementById("popup");
  const experienceBox = document.querySelector(".experience-box");
  const formationBox = document.querySelector(".formation-box");

  const hasNoExperienceText = document.getElementById("has-no-experience-text");
  const experienceTitle = document.getElementById("experience-title");
  const formationTitle = document.getElementById("no-formation-title");

  const hasNoFormationText = document.getElementById("has-no-formation-text");

  const jobTitleElementExperience = document.getElementById(
    "job-title-experience"
  );

  const titleElementFormation = document.getElementById("formation-title");
  const trainerName = document.getElementById("trainer-name");

  const experienceContainer = document.querySelector(".experience-container");
  const editForm = document.querySelector(".container");
  const addformationButton = document.getElementById("add-formation-button");
  const experienceButton = document.getElementById("experience-button");
  const formationContainer = document.querySelector(".formation-container");
  const addFormationModal = document.getElementById("add-formation-modal");
  const addFormation = document.getElementById("add-formation");

  const downLoadButton = document.getElementById("pdf-download-button");

  const popupInformation = document.getElementById("popup-information");
  const popupNoFormation = document.getElementById("popup-no-formation");
  const popupNoCertificat = document.getElementById(
    "popup-no-certificat-upload"
  );
  const popupDownload = document.getElementById("popup-certificat-download");

  const pdfResult = document.getElementById("pdf-result");

  const importCertificateButton = document.getElementById(
    "import-pdf-certificate-button"
  );

  const participantInfo = document.querySelector(".profile-info-container");

  // EXPERIENCE SHOW/HIDE text experience
  if (participantInfo) {
    if (jobTitleElementExperience) {
      const isEmpty = jobTitleElementExperience.innerText;
      if (!isEmpty || isEmpty === null) {
        experienceBox.style.display = "none";
      }
    } else {
      hasNoExperienceText.style.display = "block";
      experienceTitle.style.display = "block";
    }
  }

  // FORMATION SHOW/HIDE text formation
  if (participantInfo === null) {
    if (titleElementFormation) {
      const isEmptyFormation = titleElementFormation.innerText;
      if (!isEmptyFormation || isEmptyFormation === null) {
        formationBox.style.display = "none";
      }
    } else {
      hasNoFormationText.style.display = "block";
      formationTitle.style.display = "block";
    }
  }

  //Add element formation
  if (addformationButton) {
    addformationButton.addEventListener("click", () => {
      addFormationModal.style.display = "block";
    });
  }

  //experience
  if (addExperienceButton) {
    addExperienceButton.addEventListener("click", () => {
      addExperienceModal.style.display = "block";
    });
  }

  editButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const form = this.closest("form");
      form.classList.remove("is-readonly");
      form.classList.add("is-editing");
      form
        .querySelectorAll("input, textarea")
        .forEach((input) => input.removeAttribute("disabled"));
    });
  });

  saveButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const form = this.closest("form");
      form.classList.remove("is-editing");
      form.classList.add("is-readonly");
      form
        .querySelectorAll("input, textarea")
        .forEach((input) => input.setAttribute("disabled", "disabled"));
    });
  });

  //Close modal
  closeModalFormation.addEventListener("click", () => {
    addFormationModal.style.display = "none";
  });

  closeModalExperience.addEventListener("click", () => {
    addExperienceModal.style.display = "none";
  });

  let fileFilled = false;

  if (importCertificateButton) {
    importCertificateButton.addEventListener("click", function (event) {
      event.preventDefault(); // Empêche le comportement par défaut du formulaire

      console.log("testddq");

      if (trainerName != null) {
        // Récupérez le formulaire et créez un objet FormData
        let formData = new FormData(
          document.getElementById("importe-cetificate-pdf")
        );
        for (const [key, value] of formData.entries()) {
          console.log(`${key}: ${value}`);
        }

        for (const value of formData.values()) {
          if (value instanceof File) {
            if (value.size > 0) {
              fileFilled = true;
            }
          }
        }

        fetch("/import-certificate-pdf", {
          method: "POST",
          body: formData,
        })
          .then(() => {
            if (fileFilled) {
              popupInformation.style.display = "block";
              setTimeout(() => {
                popupInformation.style.display = "none";
                window.location.reload();
              }, 1500);
            }
          })
          .catch((error) => {
            // La requête a échoué, affichez un message d'erreur si nécessaire
            console.error(
              "There has been a problem with your fetch operation:",
              error
            );
          });
      } else {
        popupNoFormation.style.display = "block";
        setTimeout(() => {
          popupNoFormation.style.display = "none";
        }, 2500);
      }
    });
  }

  if (downLoadButton) {
    downLoadButton.addEventListener("click", (event) => {
      console.log(pdfResult);
      if (pdfResult === null) {
        popupNoCertificat.style.display = "block";
        setTimeout(() => {
          popupNoCertificat.style.display = "none";
        }, 3000);
      } else {
        popupDownload.style.display = "block";
        setTimeout(() => {
          popupDownload.style.display = "none";
        }, 3000);
      }
    });
  }
});
