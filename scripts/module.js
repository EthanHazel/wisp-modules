// Disabled handler -----------------------------------------------------------

const disabledHandler = (input, container) => {
  const observer = new MutationObserver(function (mutationsList) {
    for (let mutation of mutationsList) {
      if (
        mutation.type === "attributes" &&
        mutation.attributeName === "disabled"
      ) {
        if (input.disabled) {
          container.classList.add("disabled");
        } else {
          container.classList.remove("disabled");
        }
      }
    }
  });

  observer.observe(input, { attributes: true });
  if (input.disabled) {
    container.classList.add("disabled");
  }
};

// Check input validity -------------------------------------------------------

let prevVal = "";
document.querySelectorAll("input[pattern]").forEach((input) => {
  input.addEventListener("input", function () {
    if (!this.checkValidity()) {
      const match = this.value.match(/\d+/g);
      if (match) {
        this.value = match.join("");
      } else {
        this.value = "";
      }
    }
  });
});

// Force number inputs to be numbers only ---------------------------------------

document
  .querySelectorAll("input[type='number'], input[type='tel']")
  .forEach((input) => {
    input.addEventListener("input", function () {
      const val = parseFloat(this.value);
      if (this.value === "") {
        prevVal = "";
      } else if (isNaN(val)) {
        this.value = prevVal;
      } else {
        prevVal = this.value;
      }
    });
  });

// Input rendering -----------------------------------------------------------

async function renderInputs() {
  // Button Icon code ----------------------------------------------------------

  document
    .querySelectorAll(
      "button, input[type='button'], input[type='submit'], input[type='reset']"
    )
    .forEach(function (buttonIcon) {
      // Disabled handler
      disabledHandler(buttonIcon, buttonIcon);
      if (buttonIcon.getAttribute("rendered")) return;
      // Check if they have an icon attribute
      if (buttonIcon.getAttribute("icon")) {
        // Put the text into a span with classname icon-button-text
        if (buttonIcon.innerHTML) {
          var buttonText = document.createElement("span");
          buttonText.classList.add("icon-button-text");
          buttonText.innerHTML = buttonIcon.innerHTML;
          buttonIcon.innerHTML = "";
          buttonIcon.appendChild(buttonText);
        } else {
          buttonIcon.classList.add("textless");
        }
        // Create the icon
        var icon = document.createElement("i");
        icon.setAttribute("data-lucide", buttonIcon.getAttribute("icon"));
        buttonIcon.insertBefore(icon, buttonIcon.firstChild);
        buttonIcon.removeAttribute("icon");
        buttonIcon.classList.add("icon-button");
      }
      buttonIcon.setAttribute("rendered", true);
    });

  // File input code -----------------------------------------------------------

  document.querySelectorAll("input[type='file']").forEach(function (fileInput) {
    const parent = fileInput.parentNode;
    const fileInputDiv = document.createElement("div");
    const icon = document.createElement("i");
    const nameSpan = document.createElement("span");
    const acceptSpan = document.createElement("span");
    const sepSpan = document.createElement("span");

    // Disabled handler
    disabledHandler(fileInput, fileInputDiv);
    if (fileInput.getAttribute("rendered")) return;

    var name = fileInput.getAttribute("label") || "Upload File";

    icon.setAttribute(
      "data-lucide",
      fileInput.getAttribute("icon") || "file-input"
    ),
      fileInput.removeAttribute("icon");

    nameSpan.innerHTML = name;
    nameSpan.classList.add("file-input-name");

    if (fileInput.getAttribute("accept")) {
      acceptSpan.innerHTML = " (" + fileInput.getAttribute("accept") + ")";
      acceptSpan.classList.add("file-input-accept");
    }

    sepSpan.classList.add("file-input-separator");

    fileInputDiv.classList.add("file-input");

    parent.insertBefore(fileInputDiv, fileInput);
    fileInputDiv.append(
      icon,
      nameSpan,
      acceptSpan.innerHTML ? acceptSpan : "",
      sepSpan,
      fileInput
    );
    fileInputDiv.onclick = () => fileInput.click();

    fileInput.setAttribute("rendered", true);
  });

  // Color input code ----------------------------------------------------------

  document
    .querySelectorAll("input[type='color']")
    .forEach(function (colorInput) {
      const parent = colorInput.parentNode;
      const colorInputDiv = document.createElement("div");
      const colorSpan = document.createElement("span");
      const nameSpan = document.createElement("span");
      const valueSpan = document.createElement("span");

      // Disabled handler
      disabledHandler(colorInput, colorInputDiv);
      if (colorInput.getAttribute("rendered")) return;

      var name = colorInput.getAttribute("label") || "Color";

      nameSpan.innerHTML = name;
      nameSpan.classList.add("color-input-name");

      colorSpan.style.backgroundColor = colorInput.value;
      colorSpan.classList.add("color-input-color");

      valueSpan.innerHTML = colorInput.value;
      valueSpan.classList.add("color-input-value");

      colorInput.addEventListener("input", function () {
        colorSpan.style.backgroundColor = colorInput.value;
        valueSpan.innerHTML = colorInput.value;
      });

      colorInputDiv.classList.add("color-input");

      parent.insertBefore(colorInputDiv, colorInput);
      colorInputDiv.append(colorSpan, nameSpan, valueSpan, colorInput);
      colorInputDiv.onclick = () => colorInput.click();

      colorInput.setAttribute("rendered", true);
    });

  // Range input code ----------------------------------------------------------

  document
    .querySelectorAll("input[type='range']")
    .forEach(function (rangeInput) {
      const parent = rangeInput.parentNode;

      const rangeInputContainer = document.createElement("div");

      const rangeInputDiv = document.createElement("div");
      const rangeBackground = document.createElement("span");

      const rangeInputValue = document.createElement("input");

      const rangeMin = rangeInput.getAttribute("min") || "0";
      const rangeMax = rangeInput.getAttribute("max") || "100";

      // Disabled handler
      disabledHandler(rangeInput, rangeInputContainer);
      if (rangeInput.getAttribute("rendered")) return;

      rangeInputValue.type = "number";
      rangeInputValue.min = rangeMin;
      rangeInputValue.max = rangeMax;

      rangeInputValue.value = rangeInput.value;
      rangeInputValue.classList.add("range-input-value");

      rangeInputContainer.classList.add("range-container");

      const updateBackgroundWidth = () => {
        const rangePercent =
          ((rangeInput.value - rangeMin) / (rangeMax - rangeMin)) * 100;
        rangeBackground.style.width =
          "calc(" + rangePercent + "% - " + (rangePercent / 100) * 4 + "px)";
      };

      rangeBackground.classList.add("range-input-color");

      rangeInputDiv.classList.add("range-input");

      rangeInput.addEventListener("input", function () {
        updateBackgroundWidth();
        rangeInputValue.value = rangeInput.value;
      });

      rangeInputValue.addEventListener("input", function () {
        const value = Math.min(
          Math.max(rangeInputValue.value, rangeMin),
          rangeMax
        );
        rangeInput.value = value;
        rangeInputValue.value = value;
        updateBackgroundWidth();
      });

      rangeInputContainer.append(rangeInputValue, rangeInputDiv);

      parent.insertBefore(rangeInputContainer, rangeInput);
      rangeInputDiv.append(rangeBackground, rangeInput);

      updateBackgroundWidth();

      rangeInput.setAttribute("rendered", true);
    });

  // Checkbox code ----------------------------------------------------------

  document
    .querySelectorAll("input[type='checkbox']")
    .forEach(function (checkbox) {
      const parent = checkbox.parentNode;
      const checkboxDiv = document.createElement("div");
      const nameLabel = document.createElement("label");
      const pseudoCheckbox = document.createElement("span");
      const checkIcon = document.createElement("i");

      // Disabled handler
      disabledHandler(checkbox, checkboxDiv);
      if (checkbox.getAttribute("rendered")) return;

      if (checkbox.getAttribute("icon")) {
        checkIcon.setAttribute("data-lucide", checkbox.getAttribute("icon"));
        checkbox.removeAttribute("icon");
        pseudoCheckbox.classList.add("icon-checkbox");
      } else {
        checkIcon.setAttribute("data-lucide", "check");
      }

      pseudoCheckbox.classList.add("checkbox");
      if (checkbox.checked) pseudoCheckbox.classList.add("checked");

      pseudoCheckbox.append(checkIcon);

      var name = checkbox.getAttribute("label") || "Checkbox";

      nameLabel.innerHTML = name;
      if (!checkbox.id) {
        checkbox.id = "checkbox-" + Math.floor(Math.random() * 1000);
        console.warn(
          'Warning: Checkbox "' +
            name +
            '" has no ID. Given ID: ' +
            checkbox.id +
            " instead as a fallback. Please consider adding an ID."
        );
      }
      nameLabel.classList.add("checkbox-name");

      checkboxDiv.classList.add("checkbox-container");

      checkbox.addEventListener("change", function () {
        pseudoCheckbox.classList.toggle("checked");
      });

      checkboxDiv.addEventListener("click", function () {
        checkbox.click();
      });

      parent.insertBefore(checkboxDiv, checkbox);
      checkboxDiv.append(pseudoCheckbox, checkbox, nameLabel);

      checkbox.setAttribute("rendered", true);
    });

  // Radio input code ----------------------------------------------------------

  document.querySelectorAll("input[type='radio']").forEach(function (radio) {
    const parent = radio.parentNode;
    const radioDiv = document.createElement("div");
    const nameLabel = document.createElement("label");
    const pseudoRadio = document.createElement("span");
    const circleIcon = document.createElement("div");

    // Disabled handler
    disabledHandler(radio, radioDiv);
    if (radio.getAttribute("rendered")) return;

    pseudoRadio.classList.add("radio");
    if (radio.checked) pseudoRadio.classList.add("checked");

    pseudoRadio.append(circleIcon);

    var name = radio.getAttribute("label") || "Radio";

    nameLabel.innerHTML = name;
    nameLabel.classList.add("radio-name");

    radioDiv.classList.add("radio-container");

    radio.addEventListener("change", function () {
      const radios = parent.querySelectorAll(
        'input[name="' + radio.name + '"]'
      );
      radios.forEach(function (r) {
        const pseudoR = r.parentNode.querySelector(".radio");
        pseudoR.classList.remove("checked");
      });
      pseudoRadio.classList.add("checked");
    });

    radioDiv.addEventListener("click", function () {
      radio.click();
    });

    parent.insertBefore(radioDiv, radio);
    radioDiv.append(pseudoRadio, radio, nameLabel);

    radio.setAttribute("rendered", true);
  });

  // Tab container code -------------------------------------------------------

  var containerNames = [];
  document.querySelectorAll(".tab-con").forEach(function (tabContainer) {
    if (tabContainer.getAttribute("rendered")) return;

    var containerName = tabContainer.getAttribute("label");

    if (!containerName) {
      console.error("Error: tab-con is missing a 'label' attribute.");
      return;
    }

    if (containerNames.includes(containerName)) {
      console.error(
        "Error: multiple tab-cons have the same title: '" + containerName + "'"
      );
      return;
    }

    containerNames.push(containerName);

    var radios = document.createElement("div");
    radios.classList.add("radios");
    tabContainer.insertBefore(radios, tabContainer.firstChild);

    var tabs = tabContainer.querySelectorAll(".tab-view");
    tabs.forEach(function (tab, index) {
      var title = tab.getAttribute("label");

      if (!title) {
        console.error("Error: tab-view is missing a 'label' attribute.");
        return;
      }

      // elements
      var tabButton = document.createElement("div");
      tabButton.classList.add("tab-button");

      var button = document.createElement("input");
      button.setAttribute("type", "radio");
      button.setAttribute("name", containerName);
      button.setAttribute("id", title + "-" + containerName);
      button.setAttribute("tabindex", index);
      button.setAttribute("value", title);

      var label = document.createElement("label");
      label.setAttribute("tabindex", "0");
      label.innerHTML = title;
      label.setAttribute("for", title + "-" + containerName);

      tabButton.appendChild(button);
      tabButton.appendChild(label);
      radios.appendChild(tabButton);

      if (index === 0) {
        button.checked = true;
        tab.classList.remove("unfocused");
      } else {
        tab.classList.add("unfocused");
      }

      button.addEventListener("change", function () {
        tabs.forEach(function (t, i) {
          if (i === index) {
            t.classList.remove("unfocused");
          } else {
            t.classList.add("unfocused");
          }
        });
      });

      label.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
          button.click();
        }
      });

      tab.removeAttribute("title");
    });
  });

  // Dropdown code -----------------------------------------------------

  document.querySelectorAll("select").forEach(function (dropdown) {
    // Disabled handler
    disabledHandler(dropdown, dropdown);
    if (dropdown.getAttribute("rendered")) return;
    if (dropdown.getAttribute("placeholder")) {
      var placeholder = document.createElement("option");
      placeholder.setAttribute("disabled", true);
      placeholder.setAttribute("selected", true);
      placeholder.setAttribute("hidden", true);
      placeholder.innerHTML = dropdown.getAttribute("placeholder");
      dropdown.insertBefore(placeholder, dropdown.firstChild);
    }

    dropdown.setAttribute("rendered", true);
  });

  // Text input code --------------------------------------------------

  document
    .querySelectorAll(
      "input[type='text'], input[type='date'], input[type='time'], input[type='datetime-local'], input[type='email'], input[type='number'], input[type='password'], input[type='search'], input[type='tel'], input[type='url'], input[type='week'], input[type='month'], input[type='datetime']"
    )
    .forEach(function (input) {
      disabledHandler(input, input);
    });

  document
    .querySelectorAll(
      "input[type='date'], input[type='time'], input[type='datetime-local'], input[type='week'], input[type='month']"
    )
    .forEach(function (input) {
      if (input.getAttribute("rendered")) return;
      var iOSInput = document.createElement("div");
      iOSInput.classList.add("iOS-input");
      iOSInput.onclick = function () {
        input.focus();
      };
      input.parentNode.insertBefore(iOSInput, input);
      iOSInput.appendChild(input);
      input.setAttribute("rendered", true);
    });

  return;
}

function getCurrentTabName(containerName) {
  var tab = document.querySelector(
    'input[name="' + containerName + '"]:checked'
  );
  return tab ? tab.value : null;
}

function getCurrentTabIndex(containerName) {
  var tab = document.querySelector(
    'input[name="' + containerName + '"]:checked'
  );
  return tab ? tab.tabIndex : null;
}

function getAllTabNames(containerName) {
  var tabs = document.querySelectorAll('input[name="' + containerName + '"]');
  return Array.from(tabs).map(function (tab) {
    return tab.value;
  });
}

function openTab(containerName, tabName) {
  focusTab(containerName, tabName);
  document.getElementById(tabName + "-" + containerName).click();
}

// Render all lucide icons --------------------------------------------

window.addEventListener("load", function () {
  document.body.style.transition = "opacity 0.2s ease-in-out";
  document.body.style.opacity = 1;
  const renderInputsPromise = renderInputs();
  const createIconsPromise = lucide.createIcons();
  Promise.all([renderInputsPromise, createIconsPromise]).then(function () {
    // Do nothing
  });
});
