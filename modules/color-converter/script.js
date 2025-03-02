const INPUTS = {
  HEX: document.getElementById("hex-input"),
  RED: document.getElementById("hex-red"),
  GREEN: document.getElementById("hex-green"),
  BLUE: document.getElementById("hex-blue"),
  HSV_HUE: document.getElementById("hsv-hue"),
  HSV_SAT: document.getElementById("hsv-saturation"),
  HSV_VAL: document.getElementById("hsv-value"),
  HSL_HUE: document.getElementById("hsl-hue"),
  HSL_SAT: document.getElementById("hsl-saturation"),
  HSL_LIGHT: document.getElementById("hsl-lightness"),
  CYAN: document.getElementById("cmyk-cyan"),
  MAGENTA: document.getElementById("cmyk-magenta"),
  YELLOW: document.getElementById("cmyk-yellow"),
  KEY: document.getElementById("cmyk-key"),
};

const BUTTONS = {
  CONVERT_HEX: document.getElementById("convert-hex"),
  CONVERT_RGB: document.getElementById("convert-rgb"),
  CONVERT_HSV: document.getElementById("convert-hsv"),
  CONVERT_HSL: document.getElementById("convert-hsl"),
  CONVERT_CMYK: document.getElementById("convert-cmyk"),
  CLEAR_HEX: document.getElementById("clear-hex"),
  CLEAR_RGB: document.getElementById("clear-rgb"),
  CLEAR_HSV: document.getElementById("clear-hsv"),
  CLEAR_HSL: document.getElementById("clear-hsl"),
  CLEAR_CMYK: document.getElementById("clear-cmyk"),
  COPY_HEX: document.getElementById("copy-hex"),
  COPY_RGB: document.getElementById("copy-rgb"),
  COPY_HSV: document.getElementById("copy-hsv"),
  COPY_HSL: document.getElementById("copy-hsl"),
  COPY_CMYK: document.getElementById("copy-cmyk"),
};

const COLOR_DISPLAY = document.getElementById("color");

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
  COLOR_DISPLAY.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
};

const updateAllFields = (r, g, b) => {
  const hsv = rgbToHsv(r, g, b);
  const hsl = rgbToHsl(r, g, b);
  const cmyk = rgbToCmyk(r, g, b);

  INPUTS.RED.value = r;
  INPUTS.GREEN.value = g;
  INPUTS.BLUE.value = b;
  INPUTS.HSV_HUE.value = Math.round(hsv.h);
  INPUTS.HSV_SAT.value = Math.round(hsv.s);
  INPUTS.HSV_VAL.value = Math.round(hsv.v);
  INPUTS.HSL_HUE.value = Math.round(hsl.h);
  INPUTS.HSL_SAT.value = Math.round(hsl.s);
  INPUTS.HSL_LIGHT.value = Math.round(hsl.l);
  INPUTS.CYAN.value = Math.round(cmyk.c);
  INPUTS.MAGENTA.value = Math.round(cmyk.m);
  INPUTS.YELLOW.value = Math.round(cmyk.y);
  INPUTS.KEY.value = Math.round(cmyk.k);
  INPUTS.HEX.value = rgbToHex(r, g, b);

  updateColorDisplay(r, g, b);
};

const clearFields = (fields) => fields.forEach((field) => (field.value = ""));

BUTTONS.CONVERT_HEX.addEventListener("click", () => {
  let hex = INPUTS.HEX.value;
  if (hex.length === 3)
    hex = `#${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`;
  else if (hex.length === 4)
    hex = `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
  else if (!hex.startsWith("#")) hex = `#${hex}`;
  if (/^#([A-Fa-f0-9]{6})$/.test(hex))
    updateAllFields(...Object.values(hexToRgb(hex)));
  else toast("Invalid HEX color format!", 3, "error", 500);
});

BUTTONS.CONVERT_RGB.addEventListener("click", () => {
  const r = parseFloat(INPUTS.RED.value);
  const g = parseFloat(INPUTS.GREEN.value);
  const b = parseFloat(INPUTS.BLUE.value);
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

BUTTONS.CONVERT_HSV.addEventListener("click", () => {
  const h = parseFloat(INPUTS.HSV_HUE.value);
  const s = parseFloat(INPUTS.HSV_SAT.value);
  const v = parseFloat(INPUTS.HSV_VAL.value);
  if ([h, s, v].every((val) => !isNaN(val)))
    updateAllFields(...Object.values(hsvToRgb(h, s, v)));
  else toast("Invalid HSV values!", 3, "error", 500);
});

BUTTONS.CONVERT_HSL.addEventListener("click", () => {
  const h = parseFloat(INPUTS.HSL_HUE.value);
  const s = parseFloat(INPUTS.HSL_SAT.value);
  const l = parseFloat(INPUTS.HSL_LIGHT.value);
  if ([h, s, l].every((val) => !isNaN(val)))
    updateAllFields(...Object.values(hslToRgb(h, s, l)));
  else toast("Invalid HSL values!", 3, "error", 500);
});

BUTTONS.CONVERT_CMYK.addEventListener("click", () => {
  const c = parseFloat(INPUTS.CYAN.value);
  const m = parseFloat(INPUTS.MAGENTA.value);
  const y = parseFloat(INPUTS.YELLOW.value);
  const k = parseFloat(INPUTS.KEY.value);
  if ([c, m, y, k].every((val) => !isNaN(val)))
    updateAllFields(...Object.values(cmykToRgb(c, m, y, k)));
  else toast("Invalid CMYK values!", 3, "error", 500);
});

BUTTONS.CLEAR_HEX.addEventListener("click", () => clearFields([INPUTS.HEX]));
BUTTONS.CLEAR_RGB.addEventListener("click", () =>
  clearFields([INPUTS.RED, INPUTS.GREEN, INPUTS.BLUE])
);
BUTTONS.CLEAR_HSV.addEventListener("click", () =>
  clearFields([INPUTS.HSV_HUE, INPUTS.HSV_SAT, INPUTS.HSV_VAL])
);
BUTTONS.CLEAR_HSL.addEventListener("click", () =>
  clearFields([INPUTS.HSL_HUE, INPUTS.HSL_SAT, INPUTS.HSL_LIGHT])
);
BUTTONS.CLEAR_CMYK.addEventListener("click", () =>
  clearFields([INPUTS.CYAN, INPUTS.MAGENTA, INPUTS.YELLOW, INPUTS.KEY])
);

copyButtonRegister([[BUTTONS.COPY_HEX, INPUTS.HEX]]);

BUTTONS.COPY_RGB.addEventListener("click", () =>
  copyTextToClipboard(
    `rgb(${INPUTS.RED.value || 0}, ${INPUTS.GREEN.value || 0}, ${
      INPUTS.BLUE.value || 0
    })`
  )
);
BUTTONS.COPY_HSV.addEventListener("click", () =>
  copyTextToClipboard(
    `hsv(${INPUTS.HSV_HUE.value || 0}, ${INPUTS.HSV_SAT.value || 0}%, ${
      INPUTS.HSV_VAL.value || 0
    }%)`
  )
);
BUTTONS.COPY_HSL.addEventListener("click", () =>
  copyTextToClipboard(
    `hsl(${INPUTS.HSL_HUE.value || 0}, ${INPUTS.HSL_SAT.value || 0}%, ${
      INPUTS.HSL_LIGHT.value || 0
    }%)`
  )
);
BUTTONS.COPY_CMYK.addEventListener("click", () =>
  copyTextToClipboard(
    `cmyk(${INPUTS.CYAN.value || 0}, ${INPUTS.MAGENTA.value || 0}, ${
      INPUTS.YELLOW.value || 0
    }, ${INPUTS.KEY.value || 0})`
  )
);
