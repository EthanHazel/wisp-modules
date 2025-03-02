const TEXT_INPUT = document.getElementById("text-input");
const BASE64_OUTPUT = document.getElementById("base64-output");
const BASE64_INPUT = document.getElementById("base64-input");
const TEXT_OUTPUT = document.getElementById("text-output");
const IMAGE_INPUT = document.getElementById("image-input");
const BASE64_IMAGE_OUTPUT = document.getElementById("base64-image-output");
const BASE64_IMAGE_INPUT = document.getElementById("base64-image-input");
const IMAGE_OUTPUT = document.getElementById("image-output");
const COPY_BUTTON = document.getElementById("copy-button");
const PASTE_BUTTON = document.getElementById("paste-button");
const CLEAR_BUTTON = document.getElementById("clear-button");
const SAVE_BUTTON = document.getElementById("save-button");

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

TEXT_INPUT.addEventListener("input", function () {
  const text = this.value;
  const base64 = btoa(text);
  BASE64_OUTPUT.value = base64;
});

BASE64_INPUT.addEventListener("input", function () {
  const base64 = this.value;
  const text = atob(base64);
  TEXT_OUTPUT.value = text;
});

IMAGE_INPUT.addEventListener("change", function () {
  const file = this.files[0];
  const reader = new FileReader();
  reader.onload = function () {
    const base64 = reader.result.split(",")[1];
    BASE64_IMAGE_OUTPUT.value = base64;
  };
  reader.readAsDataURL(file);
});

BASE64_IMAGE_INPUT.addEventListener("input", function () {
  const base64 = this.value;
  const image = IMAGE_OUTPUT;
  image.src = "data:image/png;base64," + base64;
});

COPY_BUTTON.addEventListener("click", function () {
  const mode = getCurrentMode();
  const textToCopy = (() => {
    switch (mode) {
      case "textToBase64":
        return BASE64_OUTPUT.value;
      case "base64ToText":
        return TEXT_OUTPUT.value;
      case "imageToBase64":
        return BASE64_IMAGE_OUTPUT.value;
      case "base64ToImage": {
        const image = IMAGE_OUTPUT;
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
  copyTextToClipboard(textToCopy, false);
});

PASTE_BUTTON.addEventListener("click", async function () {
  const text = await getClipboardText();
  const mode = getCurrentMode();
  if (mode === "textToBase64") {
    TEXT_INPUT.value = text;
    BASE64_OUTPUT.value = btoa(text);
  } else if (mode === "base64ToText") {
    BASE64_INPUT.value = text;
    TEXT_OUTPUT.value = atob(text);
  } else if (mode === "base64ToImage") {
    BASE64_IMAGE_INPUT.value = text;
    const base64 = text;
    const image = IMAGE_OUTPUT;
    image.src = "data:image/png;base64," + base64;
  } else if (mode === "imageToBase64") {
    toast("Images cannot be pasted, please upload instead", 3, "ban", 2000);
  }
});

CLEAR_BUTTON.addEventListener("click", function () {
  const mode = getCurrentMode();
  if (mode === "textToBase64") {
    TEXT_INPUT.value = "";
    BASE64_OUTPUT.value = "";
  } else if (mode === "base64ToText") {
    BASE64_INPUT.value = "";
    TEXT_OUTPUT.value = "";
  } else if (mode === "imageToBase64") {
    IMAGE_INPUT.value = "";
    BASE64_IMAGE_OUTPUT.value = "";
  } else if (mode === "base64ToImage") {
    BASE64_IMAGE_INPUT.value = "";
    IMAGE_OUTPUT.src = "";
  }
});

SAVE_BUTTON.addEventListener("click", function () {
  const mode = getCurrentMode();
  const textToSave =
    mode === "textToBase64"
      ? BASE64_OUTPUT.value
      : mode === "base64ToText"
      ? TEXT_OUTPUT.value
      : mode === "imageToBase64"
      ? BASE64_IMAGE_OUTPUT.value
      : "";

  if (mode === "base64ToImage") {
    const image = IMAGE_OUTPUT;
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

    URL.revokeObjectURL(url);
    return;
  }

  if (mode === "textToBase64" || mode === "base64ToText") {
    saveTextToFile(textToSave, `${mode}`);
    return;
  }
});
