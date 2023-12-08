document.addEventListener("DOMContentLoaded", function () {
  const editButtons = document.querySelectorAll(".js-edit");
  const saveButtons = document.querySelectorAll(".js-save");
  const addExperience = document.getElementById("add-experience");
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

  const hasNoExperienceText = document.getElementById("hasNoExperienceText");

  const hasNoFormationText = document.getElementById("hasNoFormationText");

  const jobTitleElement = document.getElementById("job-title");

  const experienceContainer = document.querySelector(".experience-container");
  const editForm = document.querySelector(".container");
  const formationButton = document.getElementById("formation-button");
  const experienceButton = document.getElementById("experience-button");
  const formationContainer = document.querySelector(".formation-container");
  const addFormationModal = document.getElementById("add-formation-modal");
  const addFormation = document.getElementById("add-formation");

  const downLoadButton = document.getElementById("pdf-button");

  const popupInformation = document.getElementById("popup-information");
  const importCertificateButton = document.getElementById(
    "import-pdf-certificate-button"
  );

  // Si la box ne contient pas d'expérience, masquez-la
  if (jobTitleElement) {
    const isEmpty = jobTitleElement.innerText;
    if (!isEmpty || isEmpty === null) {
      experienceBox.style.display = "none";
      hasNoExperienceText.style.display = "block";
    }
  } else {
    hasNoExperienceText.style.display = "block";
  }

  if (jobTitleElement) {
    const isEmptyFormation = jobTitleElement.innerText;
    if (!isEmptyFormation || isEmptyFormation === null) {
      formationBox.style.display = "none";
    }
  } else {
    hasNoFormationText.style.display = "block";
  }

  formationButton.addEventListener("click", () => {
    experienceContainer.style.display = "none";
    editForm.style.display = "none";
    formationContainer.style.display = "block";
    pdfPanel.style.display = "block";
  });

  experienceButton.addEventListener("click", () => {
    experienceContainer.style.display = "block";
    editForm.style.display = "block";
    formationContainer.style.display = "none";
    pdfPanel.style.display = "none";
  });

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

  //Formation
  addFormation.addEventListener("click", () => {
    addFormationModal.style.display = "block";
  });

  closeModalFormation.addEventListener("click", () => {
    addFormationModal.style.display = "none";
  });

  //Experience
  addExperience.addEventListener("click", () => {
    addExperienceModal.style.display = "block";
  });

  closeModalExperience.addEventListener("click", () => {
    addExperienceModal.style.display = "none";
  });

  let fileFilled = false;

  importCertificateButton.addEventListener("click", function (event) {
    event.preventDefault(); // Empêche le comportement par défaut du formulaire

    // Récupérez le formulaire et créez un objet FormData
    let formData = new FormData(
      document.getElementById("importe-cetificate-pdf")
    );

    for (const value of formData.values()) {
      if (value instanceof File) {
        if (value.size > 0) {
          fileFilled = true;
        }
        console.log(fileFilled);
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
  });
});
