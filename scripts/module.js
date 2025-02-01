// Tab container code -------------------------------------------------------

var containerNames = [];
document.querySelectorAll(".tab-con").forEach(function (tabContainer) {
  var containerName = tabContainer.getAttribute("title");

  if (!containerName) {
    console.error("Error: tab-con is missing a 'title' attribute.");
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
    var title = tab.getAttribute("title");

    if (!title) {
      console.error("Error: tab-view is missing a 'title' attribute.");
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

// Button Icon code ----------------------------------------------------------

document
  .querySelectorAll("button, input[type='button'], input[type='submit']")
  .forEach(function (buttonIcon) {
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
  });

// Render all lucide icons --------------------------------------------

lucide.createIcons();
