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
  // Text input code ------------------------------------------------------------

  document
    .querySelectorAll(
      "input[type='text'], input[type='email'], input[type='url']"
    )
    .forEach(function (input) {
      // Disabled handler
      disabledHandler(input, input);
      if (input.getAttribute("rendered")) return;
      input.setAttribute("rendered", true);

      if (input.getAttribute("wisp-for")) {
        const FOR_BUTTON = document.getElementById(
          input.getAttribute("wisp-for")
        );
        input.addEventListener("keyup", (e) => {
          if (e.key === "Enter") {
            FOR_BUTTON.click();
          }
        });
      }
    });

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
    const fileName = document.createElement("span");

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

    fileInput.addEventListener("change", function () {
      if (this.value) {
        let fileNameParts = this.value.split("\\");
        fileName.innerHTML = fileNameParts[fileNameParts.length - 1];
      } else {
        fileName.innerHTML = "No file selected";
      }
    });

    if (fileInput.value) {
      let fileNameParts = fileInput.value.split("\\");
      fileName.innerHTML = fileNameParts[fileNameParts.length - 1];
    } else {
      fileName.innerHTML = "No file selected.";
    }

    fileName.classList.add("file-input-filename");

    fileInputDiv.classList.add("file-input");

    parent.insertBefore(fileInputDiv, fileInput);
    fileInputDiv.append(
      icon,
      nameSpan,
      acceptSpan.innerHTML ? acceptSpan : "",
      sepSpan,
      fileName,
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

      const inputDescriptor = Object.getOwnPropertyDescriptor(
        Object.getPrototypeOf(rangeInput),
        "value"
      );

      Object.defineProperty(rangeInput, "value", {
        set: function (newValue) {
          const oldValue = this.value;
          inputDescriptor.set.call(this, newValue);
          updateBackgroundWidth();
          rangeInputValue.value = newValue;

          if (oldValue !== newValue) {
            rangeInput.dispatchEvent(new Event("input"));
          }
        },
        get: function () {
          return inputDescriptor.get.call(this);
        },
        configurable: true,
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

      const inputDescriptor = Object.getOwnPropertyDescriptor(
        Object.getPrototypeOf(checkbox),
        "checked"
      );

      Object.defineProperty(checkbox, "checked", {
        set: function (newValue) {
          const oldValue = this.checked;
          inputDescriptor.set.call(this, newValue);

          if (oldValue !== newValue) {
            checkbox.dispatchEvent(new Event("change"));
            pseudoCheckbox.classList.toggle("checked", newValue);
          }
        },
        get: function () {
          return inputDescriptor.get.call(this);
        },
        configurable: true,
      });

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

    const inputDescriptor = Object.getOwnPropertyDescriptor(
      Object.getPrototypeOf(radio),
      "checked"
    );

    Object.defineProperty(radio, "checked", {
      set: function (newValue) {
        const oldValue = this.checked;
        inputDescriptor.set.call(this, newValue);

        if (oldValue !== newValue) {
          radio.dispatchEvent(new Event("change"));
          pseudoRadio.classList.toggle("checked", newValue);
        }
      },
      get: function () {
        return inputDescriptor.get.call(this);
      },
      configurable: true,
    });

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

  document.querySelectorAll(".collapsible").forEach(function (collapsible) {
    if (collapsible.getAttribute("rendered")) return;

    const header = document.createElement("div");
    const headerIcon = document.createElement("i");
    const headerLabel = document.createElement("span");
    const headerLine = document.createElement("hr");

    headerIcon.setAttribute("data-lucide", "chevron-down");
    header.appendChild(headerIcon);

    headerLabel.innerHTML = collapsible.getAttribute("label");
    headerLabel.classList.add("collapsible-label");
    header.appendChild(headerLabel);

    header.appendChild(headerLine);

    header.classList.add("collapsible-header");
    if (!collapsible.getAttribute("open")) header.classList.add("collapsed");
    header.tabIndex = 0;

    header.onclick = function () {
      collapsible.classList.toggle("collapsed");
      header.classList.toggle("collapsed");
    };

    header.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        collapsible.classList.toggle("collapsed");
        header.classList.toggle("collapsed");
      }
    });

    if (!collapsible.getAttribute("open"))
      collapsible.classList.add("collapsed");

    collapsible.parentNode.insertBefore(header, collapsible);
    collapsible.setAttribute("rendered", true);
  });

  // Size to content code -----------------------------------------------------

  document.querySelectorAll("textarea.size-to-content").forEach((element) => {
    const computedStyle = getComputedStyle(element);
    const paddingY =
      parseFloat(computedStyle.paddingTop) +
      parseFloat(computedStyle.paddingBottom);

    const updateSize = () => {
      element.style.height = "auto";
      const scrollHeight = element.scrollHeight;
      const newHeight = Math.max(scrollHeight - paddingY, 0);
      element.style.height = `${newHeight}px`;
    };

    element.addEventListener("input", updateSize);

    const originalDescriptor = Object.getOwnPropertyDescriptor(
      HTMLTextAreaElement.prototype,
      "value"
    );
    Object.defineProperty(element, "value", {
      set: function (value) {
        originalDescriptor.set.call(this, value);
        this.dispatchEvent(new Event("input", { bubbles: true }));
      },
      get: function () {
        return originalDescriptor.get.call(this);
      },
      configurable: true,
    });

    updateSize();
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

// Toast code ---------------------------------------------------------------

function toast(message, type = 0, icon, time = 5000) {
  var toastContainer = document.getElementById("toast-container");
  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.id = "toast-container";
    document.body.appendChild(toastContainer);
    toastContainer = document.getElementById("toast-container");
  }

  var toast = document.createElement("div");
  toast.classList.add("toast");
  switch (type) {
    case 0:
      break;
    case 1:
      toast.classList.add("success");
      break;
    case 2:
      toast.classList.add("warning");
      break;
    case 3:
      toast.classList.add("error");
      break;
    default:
      console.error("Invalid toast type: " + type);
      break;
  }

  toast.innerHTML = message;
  toastContainer.appendChild(toast);

  if (icon) {
    const toastIcon = document.createElement("i");
    toastIcon.setAttribute("data-lucide", icon);
    toast.insertBefore(toastIcon, toast.firstChild);
    lucide.createIcons();
  }

  setTimeout(function () {
    toast.style.animation = "fade-out 0.25s";
    toast.style.animationFillMode = "forwards";
    setTimeout(function () {
      toastContainer.removeChild(toast);
      if (toastContainer.children.length === 0) {
        toastContainer.remove();
      }
    }, 250);
  }, time);
}

// Check on load and on resize if the page is in mobile mode ---------------------

function isMobile() {
  return window.matchMedia("(max-aspect-ratio: 3/4), (max-width: 700px)")
    .matches;
}

function onResize() {
  if (isMobile()) {
    document.body.classList.add("is-mobile");
  } else {
    document.body.classList.remove("is-mobile");
  }
}

// Clipboard functions ----------------------------------------------------------

const copyTextToClipboard = (text) => {
  navigator.clipboard.writeText(text);
  toast(`${text} copied to clipboard!`, 0, "copy", 500);
};

const copyButtonRegister = (buttons) => {
  buttons.forEach((button) => {
    button[0].addEventListener("click", () => {
      copyTextToClipboard(button[1].value);
    });
  });
};

const getClipboardText = async () => {
  try {
    const text = await navigator.clipboard.readText();
    return text;
  } catch (err) {
    toast("Failed to read clipboard!", 3, "alert-triangle", 500);
    return "";
  }
};

const pasteButtonRegister = (buttons) => {
  buttons.forEach((button) => {
    button[0].addEventListener("click", async () => {
      const text = await getClipboardText();
      button[1].value = text;
    });
  });
};

const saveTextToFile = (text, filename) => {
  const blob = new Blob([text], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename + ".txt";
  a.click();
  URL.revokeObjectURL(url);
};

const saveButtonRegister = (buttons) => {
  buttons.forEach((button) => {
    button[0].addEventListener("click", () => {
      saveTextToFile(button[1].value, button[2]);
    });
  });
};

const clearButtonRegister = (buttons) => {
  buttons.forEach((button) => {
    button[0].addEventListener("click", () => {
      button[1].value = button[2] || "";
    });
  });
};

// Render all lucide icons --------------------------------------------

window.addEventListener("load", function () {
  document.body.style.transition = "opacity 0.2s ease-in-out";
  document.body.style.opacity = 1;
  onResize();
  renderInputs();
  lucide.createIcons();
});

window.addEventListener("resize", onResize);
