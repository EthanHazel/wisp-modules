function getCurrentMode() {
  const tabIndex = getCurrentTabIndex("Convert");
  if (tabIndex === 0) {
    return "textToBase64";
  } else if (tabIndex === 1) {
    return "base64ToText";
  } else if (tabIndex === 2) {
    return "imageToBase64";
  } else if (tabIndex === 3) {
    return "base64ToImage";
  } else {
    return null;
  }
}

document.getElementById("text-input").addEventListener("input", function () {
  const text = this.value;
  const base64 = btoa(text);
  document.getElementById("base64-output").value = base64;
});

document.getElementById("base64-input").addEventListener("input", function () {
  const base64 = this.value;
  const text = atob(base64);
  document.getElementById("text-output").value = text;
});

document.getElementById("image-input").addEventListener("change", function () {
  const file = this.files[0];
  const reader = new FileReader();
  reader.onload = function () {
    const base64 = reader.result.split(",")[1];
    document.getElementById("base64-image-output").value = base64;
  };
  reader.readAsDataURL(file);
});

document
  .getElementById("base64-image-input")
  .addEventListener("input", function () {
    const base64 = this.value;
    const image = document.getElementById("image-output");
    image.src = "data:image/png;base64," + base64;
  });

document.getElementById("copy-button").addEventListener("click", function () {
  const mode = getCurrentMode();
  const textToCopy = (() => {
    switch (mode) {
      case "textToBase64":
        return document.getElementById("base64-output").value;
      case "base64ToText":
        return document.getElementById("text-output").value;
      case "imageToBase64":
        return document.getElementById("base64-image-output").value;
      case "base64ToImage": {
        const image = document.getElementById("image-output");
        const canvas = document.createElement("canvas");
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(image, 0, 0);
        return canvas.toDataURL();
      }
      default:
        return "";
    }
  })();
  const textArea = document.createElement("textarea");
  textArea.value = textToCopy;
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand("copy");
  textArea.remove();
  toast("Copied to clipboard", 0, "clipboard", 250);
});

document.getElementById("paste-button").addEventListener("click", function () {
  navigator.clipboard
    .readText()
    .then((text) => {
      const mode = getCurrentMode();
      if (mode === "textToBase64") {
        document.getElementById("text-input").value = text;
        document.getElementById("base64-output").value = btoa(text);
      } else if (mode === "base64ToText") {
        document.getElementById("base64-input").value = text;
        document.getElementById("text-output").value = atob(text);
      } else if (mode === "base64ToImage") {
        document.getElementById("base64-image-input").value = text;
        const base64 = text;
        const image = document.getElementById("image-output");
        image.src = "data:image/png;base64," + base64;
      } else if (mode === "imageToBase64") {
        toast("Images cannot be pasted, please upload instead", 3, "ban", 2000);
      }
    })
    .catch((err) => {
      taost("Error: " + err, 3, "ban", 1000);
    });
});

document.getElementById("clear-button").addEventListener("click", function () {
  const mode = getCurrentMode();
  if (mode === "textToBase64") {
    document.getElementById("text-input").value = "";
    document.getElementById("base64-output").value = "";
  } else if (mode === "base64ToText") {
    document.getElementById("base64-input").value = "";
    document.getElementById("text-output").value = "";
  } else if (mode === "imageToBase64") {
    document.getElementById("image-input").value = "";
    document.getElementById("base64-image-output").value = "";
  } else if (mode === "base64ToImage") {
    document.getElementById("base64-image-input").value = "";
    document.getElementById("image-output").src = "";
  }
});

document.getElementById("save-button").addEventListener("click", function () {
  const mode = getCurrentMode();
  const textToSave =
    mode === "textToBase64"
      ? document.getElementById("base64-output").value
      : mode === "base64ToText"
      ? document.getElementById("text-output").value
      : mode === "imageToBase64"
      ? document.getElementById("base64-image-output").value
      : "";

  if (mode === "base64ToImage") {
    const image = document.getElementById("image-output");
    const dataURI = image.src;

    // Convert data URI to Blob
    const byteString = atob(dataURI.split(",")[1]);
    const mimeType = dataURI.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    const blob = new Blob([ab], { type: mimeType });
    const url = URL.createObjectURL(blob);

    // Create download link
    const link = document.createElement("a");
    link.href = url;
    link.download = "image.png";
    link.click();

    URL.revokeObjectURL(url); // Cleanup
    return;
  }

  const blob = new Blob([textToSave], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${mode}.txt`;
  a.click();
  URL.revokeObjectURL(url);
});
