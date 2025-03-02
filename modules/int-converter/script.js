const DECIMAL_INPUT = document.getElementById("dec-input");
const HEX_INPUT = document.getElementById("hex-input");
const BINARY_INPUT = document.getElementById("bin-input");
const OCTAL_INPUT = document.getElementById("oct-input");

const BINARY_FORMAT = document.getElementById("format-bin");
const HEX_FORMAT = document.getElementById("format-hex");

const DECIMAL_CONVERT_BUTTON = document.getElementById("convert-dec");
const HEX_CONVERT_BUTTON = document.getElementById("convert-hex");
const BINARY_CONVERT_BUTTON = document.getElementById("convert-bin");
const OCTAL_CONVERT_BUTTON = document.getElementById("convert-oct");

const DECIMAL_COPY_BUTTON = document.getElementById("copy-dec");
const HEX_COPY_BUTTON = document.getElementById("copy-hex");
const BINARY_COPY_BUTTON = document.getElementById("copy-bin");
const OCTAL_COPY_BUTTON = document.getElementById("copy-oct");

const DECIMAL_CLEAR_BUTTON = document.getElementById("clear-dec");
const HEX_CLEAR_BUTTON = document.getElementById("clear-hex");
const BINARY_CLEAR_BUTTON = document.getElementById("clear-bin");
const OCTAL_CLEAR_BUTTON = document.getElementById("clear-oct");

copyButtonRegister([
  [DECIMAL_COPY_BUTTON, DECIMAL_INPUT],
  [HEX_COPY_BUTTON, HEX_INPUT],
  [BINARY_COPY_BUTTON, BINARY_INPUT],
  [OCTAL_COPY_BUTTON, OCTAL_INPUT],
]);

clearButtonRegister([
  [DECIMAL_CLEAR_BUTTON, DECIMAL_INPUT, "0"],
  [HEX_CLEAR_BUTTON, HEX_INPUT, "0x0"],
  [BINARY_CLEAR_BUTTON, BINARY_INPUT, "0"],
  [OCTAL_CLEAR_BUTTON, OCTAL_INPUT, "0"],
]);

function binaryFormat() {
  if (BINARY_FORMAT.checked) {
    if (/^0+$/.test(BINARY_INPUT.value)) {
      BINARY_INPUT.value = "0000";
    } else {
      BINARY_INPUT.value = BINARY_INPUT.value.replace(/^0+/, "");
    }
    if (BINARY_INPUT.value) {
      BINARY_INPUT.value = BINARY_INPUT.value
        .padStart(Math.ceil(BINARY_INPUT.value.length / 4) * 4, "0")
        .match(/.{1,4}/g)
        .join(" ");
    }
  } else {
    if (/^0+$/.test(BINARY_INPUT.value)) {
      BINARY_INPUT.value = "0";
    } else {
      BINARY_INPUT.value = BINARY_INPUT.value
        .replace(/ /g, "")
        .replace(/^0+/g, "");
    }
  }
}

function hexFormat() {
  if (!HEX_FORMAT.checked) {
    if (HEX_INPUT.value.startsWith("0x"))
      HEX_INPUT.value = HEX_INPUT.value.slice(2);
  } else {
    if (!HEX_INPUT.value.startsWith("0x"))
      HEX_INPUT.value = "0x" + HEX_INPUT.value;
  }
}

DECIMAL_CONVERT_BUTTON.addEventListener("click", function () {
  if (!/^\d+$/.test(DECIMAL_INPUT.value))
    return toast("Invalid input!", 3, "circle-x");
  const dec = parseInt(DECIMAL_INPUT.value, 10);
  HEX_INPUT.value = "0x" + dec.toString(16).toUpperCase();
  BINARY_INPUT.value = dec.toString(2);
  OCTAL_INPUT.value = dec.toString(8);
  binaryFormat();
  hexFormat();
});

HEX_CONVERT_BUTTON.addEventListener("click", function () {
  let hex = HEX_INPUT.value;
  if (hex.startsWith("0x")) {
    hex = hex.slice(2);
  }
  if (!/^[0-9A-Fa-f]+$/.test(hex))
    return toast("Invalid input!", 3, "circle-x");
  DECIMAL_INPUT.value = parseInt(hex, 16);
  BINARY_INPUT.value = parseInt(hex, 16).toString(2);
  OCTAL_INPUT.value = parseInt(hex, 16).toString(8);
  binaryFormat();
  hexFormat();
});

HEX_FORMAT.addEventListener("change", function () {
  hexFormat();
});

BINARY_CONVERT_BUTTON.addEventListener("click", function () {
  if (!/^[0-1]+$/.test(BINARY_INPUT.value))
    return toast("Invalid input!", 3, "circle-x");
  const bin = BINARY_INPUT.value.replace(/ /g, "");
  DECIMAL_INPUT.value = parseInt(bin, 2);
  HEX_INPUT.value = parseInt(bin, 2).toString(16).toUpperCase();
  OCTAL_INPUT.value = parseInt(bin, 2).toString(8);
  binaryFormat();
  hexFormat();
});

BINARY_FORMAT.addEventListener("change", function () {
  binaryFormat();
});

OCTAL_CONVERT_BUTTON.addEventListener("click", function () {
  if (!/^[0-7]+$/.test(OCTAL_INPUT.value))
    return toast("Invalid input!", 3, "circle-x");
  const oct = OCTAL_INPUT.value;
  DECIMAL_INPUT.value = parseInt(oct, 8);
  HEX_INPUT.value = parseInt(oct, 8).toString(16).toUpperCase();
  BINARY_INPUT.value = parseInt(oct, 8).toString(2);
  binaryFormat();
  hexFormat();
});
