// Tab container code -------------------------------------------------------

var containerNames = [];
document.querySelectorAll(".tab-container").forEach(function (tabContainer) {
  var containerName = tabContainer.getAttribute("title");

  if (!containerName) {
    console.error("Error: tab-container is missing a 'title' attribute.");
    return;
  }

  if (containerNames.includes(containerName)) {
    console.error(
      "Error: multiple tab-containers have the same title: '" +
        containerName +
        "'"
    );
    return;
  }

  containerNames.push(containerName);

  var radios = document.createElement("div");
  radios.classList.add("radios");
  tabContainer.insertBefore(radios, tabContainer.firstChild);

  var tabs = tabContainer.querySelectorAll(".tab-content");
  tabs.forEach(function (tab, index) {
    var title = tab.getAttribute("title");

    if (!title) {
      console.error("Error: tab-content is missing a 'title' attribute.");
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

// Embed code -------------------------------------------------------

if (window.self !== window.top) {
  if (
    window.location.hostname !== "wisp.tools" &&
    window.location.hostname !== "localhost" &&
    window.location.hostname !== "127.0.0.1"
  ) {
    var footer = document.createElement("div");
    footer.classList.add("footer");
    footer.innerHTML = 'Powered by <a href="https://wisp.tools">wisp</a>';
    document.body.appendChild(footer);
  }
}
