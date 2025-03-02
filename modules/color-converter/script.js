const inputs = {
  hex: document.getElementById("hex-input"),
  red: document.getElementById("hex-red"),
  green: document.getElementById("hex-green"),
  blue: document.getElementById("hex-blue"),
  hsvHue: document.getElementById("hsv-hue"),
  hsvSaturation: document.getElementById("hsv-saturation"),
  hsvValue: document.getElementById("hsv-value"),
  hslHue: document.getElementById("hsl-hue"),
  hslSaturation: document.getElementById("hsl-saturation"),
  hslLightness: document.getElementById("hsl-lightness"),
  cyan: document.getElementById("cmyk-cyan"),
  magenta: document.getElementById("cmyk-magenta"),
  yellow: document.getElementById("cmyk-yellow"),
  key: document.getElementById("cmyk-key"),
};

const buttons = {
  convertHex: document.getElementById("convert-hex"),
  convertRgb: document.getElementById("convert-rgb"),
  convertHsv: document.getElementById("convert-hsv"),
  convertHsl: document.getElementById("convert-hsl"),
  convertCmyk: document.getElementById("convert-cmyk"),
  clearHex: document.getElementById("clear-hex"),
  clearRgb: document.getElementById("clear-rgb"),
  clearHsv: document.getElementById("clear-hsv"),
  clearHsl: document.getElementById("clear-hsl"),
  clearCmyk: document.getElementById("clear-cmyk"),
  copyHex: document.getElementById("copy-hex"),
  copyRgb: document.getElementById("copy-rgb"),
  copyHsv: document.getElementById("copy-hsv"),
  copyHsl: document.getElementById("copy-hsl"),
  copyCmyk: document.getElementById("copy-cmyk"),
};

const colorDisplay = document.getElementById("color");

const hexToRgb = (hex) => ({
  r: parseInt(hex.slice(1, 3), 16),
  g: parseInt(hex.slice(3, 5), 16),
  b: parseInt(hex.slice(5, 7), 16),
});

const rgbToHex = (r, g, b) =>
  `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;

const rgbToHsv = (r, g, b) => {
  (r /= 255), (g /= 255), (b /= 255);
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h,
    s = max === 0 ? 0 : (max - min) / max;
  if (max === min) h = 0;
  else {
    switch (max) {
      case r:
        h = (g - b) / (max - min) + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / (max - min) + 2;
        break;
      case b:
        h = (r - g) / (max - min) + 4;
        break;
    }
    h /= 6;
  }
  return { h: h * 360, s: s * 100, v: max * 100 };
};

const hsvToRgb = (h, s, v) => {
  (h /= 360), (s /= 100), (v /= 100);
  const i = Math.floor(h * 6),
    f = h * 6 - i,
    p = v * (1 - s),
    q = v * (1 - f * s),
    t = v * (1 - (1 - f) * s);
  let r, g, b;
  switch (i % 6) {
    case 0:
      (r = v), (g = t), (b = p);
      break;
    case 1:
      (r = q), (g = v), (b = p);
      break;
    case 2:
      (r = p), (g = v), (b = t);
      break;
    case 3:
      (r = p), (g = q), (b = v);
      break;
    case 4:
      (r = t), (g = p), (b = v);
      break;
    case 5:
      (r = v), (g = p), (b = q);
      break;
  }
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
};

const rgbToHsl = (r, g, b) => {
  (r /= 255), (g /= 255), (b /= 255);
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h,
    s,
    l = (max + min) / 2;
  if (max === min) h = s = 0;
  else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
};

const hslToRgb = (h, s, l) => {
  (h /= 360), (s /= 100), (l /= 100);
  if (s === 0) return { r: l * 255, g: l * 255, b: l * 255 };
  const hue2rgb = (p, q, t) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  return {
    r: Math.round(hue2rgb(p, q, h + 1 / 3) * 255),
    g: Math.round(hue2rgb(p, q, h) * 255),
    b: Math.round(hue2rgb(p, q, h - 1 / 3) * 255),
  };
};

const rgbToCmyk = (r, g, b) => {
  const k = Math.min(1 - r / 255, 1 - g / 255, 1 - b / 255);
  const c = (1 - r / 255 - k) / (1 - k) || 0;
  const m = (1 - g / 255 - k) / (1 - k) || 0;
  const y = (1 - b / 255 - k) / (1 - k) || 0;
  return { c: c * 100, m: m * 100, y: y * 100, k: k * 100 };
};

const cmykToRgb = (c, m, y, k) => ({
  r: Math.round(255 * (1 - c / 100) * (1 - k / 100)),
  g: Math.round(255 * (1 - m / 100) * (1 - k / 100)),
  b: Math.round(255 * (1 - y / 100) * (1 - k / 100)),
});

const updateColorDisplay = (r, g, b) => {
  colorDisplay.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
};

const updateAllFields = (r, g, b) => {
  const hsv = rgbToHsv(r, g, b);
  const hsl = rgbToHsl(r, g, b);
  const cmyk = rgbToCmyk(r, g, b);

  inputs.red.value = r;
  inputs.green.value = g;
  inputs.blue.value = b;
  inputs.hsvHue.value = Math.round(hsv.h);
  inputs.hsvSaturation.value = Math.round(hsv.s);
  inputs.hsvValue.value = Math.round(hsv.v);
  inputs.hslHue.value = Math.round(hsl.h);
  inputs.hslSaturation.value = Math.round(hsl.s);
  inputs.hslLightness.value = Math.round(hsl.l);
  inputs.cyan.value = Math.round(cmyk.c);
  inputs.magenta.value = Math.round(cmyk.m);
  inputs.yellow.value = Math.round(cmyk.y);
  inputs.key.value = Math.round(cmyk.k);
  inputs.hex.value = rgbToHex(r, g, b);

  updateColorDisplay(r, g, b);
};

const clearFields = (fields) => fields.forEach((field) => (field.value = ""));

buttons.convertHex.addEventListener("click", () => {
  let hex = inputs.hex.value;
  if (hex.length === 3)
    hex = `#${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`;
  else if (hex.length === 4)
    hex = `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
  else if (!hex.startsWith("#")) hex = `#${hex}`;
  if (/^#([A-Fa-f0-9]{6})$/.test(hex))
    updateAllFields(...Object.values(hexToRgb(hex)));
  else toast("Invalid HEX color format!", 3, "error", 500);
});

buttons.convertRgb.addEventListener("click", () => {
  const r = parseFloat(inputs.red.value);
  const g = parseFloat(inputs.green.value);
  const b = parseFloat(inputs.blue.value);
  if ([r, g, b].every((val) => !isNaN(val) && val >= 0 && val <= 255))
    updateAllFields(r, g, b);
  else
    toast(
      "Invalid RGB values! Values must be between 0 and 255.",
      3,
      "error",
      500
    );
});

buttons.convertHsv.addEventListener("click", () => {
  const h = parseFloat(inputs.hsvHue.value);
  const s = parseFloat(inputs.hsvSaturation.value);
  const v = parseFloat(inputs.hsvValue.value);
  if ([h, s, v].every((val) => !isNaN(val)))
    updateAllFields(...Object.values(hsvToRgb(h, s, v)));
  else toast("Invalid HSV values!", 3, "error", 500);
});

buttons.convertHsl.addEventListener("click", () => {
  const h = parseFloat(inputs.hslHue.value);
  const s = parseFloat(inputs.hslSaturation.value);
  const l = parseFloat(inputs.hslLightness.value);
  if ([h, s, l].every((val) => !isNaN(val)))
    updateAllFields(...Object.values(hslToRgb(h, s, l)));
  else toast("Invalid HSL values!", 3, "error", 500);
});

buttons.convertCmyk.addEventListener("click", () => {
  const c = parseFloat(inputs.cyan.value);
  const m = parseFloat(inputs.magenta.value);
  const y = parseFloat(inputs.yellow.value);
  const k = parseFloat(inputs.key.value);
  if ([c, m, y, k].every((val) => !isNaN(val)))
    updateAllFields(...Object.values(cmykToRgb(c, m, y, k)));
  else toast("Invalid CMYK values!", 3, "error", 500);
});

buttons.clearHex.addEventListener("click", () => clearFields([inputs.hex]));
buttons.clearRgb.addEventListener("click", () =>
  clearFields([inputs.red, inputs.green, inputs.blue])
);
buttons.clearHsv.addEventListener("click", () =>
  clearFields([inputs.hsvHue, inputs.hsvSaturation, inputs.hsvValue])
);
buttons.clearHsl.addEventListener("click", () =>
  clearFields([inputs.hslHue, inputs.hslSaturation, inputs.hslLightness])
);
buttons.clearCmyk.addEventListener("click", () =>
  clearFields([inputs.cyan, inputs.magenta, inputs.yellow, inputs.key])
);

buttons.copyHex.addEventListener("click", () =>
  copyTextToClipboard(inputs.hex.value || "#000000")
);
buttons.copyRgb.addEventListener("click", () =>
  copyTextToClipboard(
    `rgb(${inputs.red.value || 0}, ${inputs.green.value || 0}, ${
      inputs.blue.value || 0
    })`
  )
);
buttons.copyHsv.addEventListener("click", () =>
  copyTextToClipboard(
    `hsv(${inputs.hsvHue.value || 0}, ${inputs.hsvSaturation.value || 0}%, ${
      inputs.hsvValue.value || 0
    }%)`
  )
);
buttons.copyHsl.addEventListener("click", () =>
  copyTextToClipboard(
    `hsl(${inputs.hslHue.value || 0}, ${inputs.hslSaturation.value || 0}%, ${
      inputs.hslLightness.value || 0
    }%)`
  )
);
buttons.copyCmyk.addEventListener("click", () =>
  copyTextToClipboard(
    `cmyk(${inputs.cyan.value || 0}, ${inputs.magenta.value || 0}, ${
      inputs.yellow.value || 0
    }, ${inputs.key.value || 0})`
  )
);
