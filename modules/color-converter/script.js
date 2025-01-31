const HEX_INPUT = document.getElementById("hex-input");
const HEX_RED_INPUT = document.getElementById("hex-red");
const HEX_GREEN_INPUT = document.getElementById("hex-green");
const HEX_BLUE_INPUT = document.getElementById("hex-blue");
const HSV_HUE_INPUT = document.getElementById("hsv-hue");
const HSV_SATURATION_INPUT = document.getElementById("hsv-saturation");
const HSV_VALUE_INPUT = document.getElementById("hsv-value");
const HSL_HUE_INPUT = document.getElementById("hsl-hue");
const HSL_SATURATION_INPUT = document.getElementById("hsl-saturation");
const HSL_LIGHTNESS_INPUT = document.getElementById("hsl-lightness");
const CMYK_CYAN_INPUT = document.getElementById("cmyk-cyan");
const CMYK_MAGENTA_INPUT = document.getElementById("cmyk-magenta");
const CMYK_YELLOW_INPUT = document.getElementById("cmyk-yellow");
const CMYK_KEY_INPUT = document.getElementById("cmyk-key");

const COLOR = document.getElementById("color");

const CONVERT_HEX = document.getElementById("convert-hex");
const CONVERT_RGB = document.getElementById("convert-rgb");
const CONVERT_HSV = document.getElementById("convert-hsv");
const CONVERT_HSL = document.getElementById("convert-hsl");
const CONVERT_CMYK = document.getElementById("convert-cmyk");
const CLEAR = document.getElementById("clear");

// Helper functions for color conversion
function hexToRgb(hex) {
  let r = parseInt(hex.slice(1, 3), 16);
  let g = parseInt(hex.slice(3, 5), 16);
  let b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

function rgbToHex(r, g, b) {
  return (
    "#" +
    ((1 << 24) + (Math.round(r) << 16) + (Math.round(g) << 8) + Math.round(b))
      .toString(16)
      .slice(1)
  );
}

function rgbToHsv(r, g, b) {
  (r /= 255), (g /= 255), (b /= 255);
  let max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h,
    s,
    v = max;

  let d = max - min;
  s = max === 0 ? 0 : d / max;

  if (max === min) {
    h = 0; // achromatic
  } else {
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

  return { h: h * 360, s: s * 100, v: v * 100 };
}

function hsvToRgb(h, s, v) {
  (h /= 360), (s /= 100), (v /= 100);
  let r, g, b;

  let i = Math.floor(h * 6);
  let f = h * 6 - i;
  let p = v * (1 - s);
  let q = v * (1 - f * s);
  let t = v * (1 - (1 - f) * s);

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
}

function rgbToHsl(r, g, b) {
  (r /= 255), (g /= 255), (b /= 255);
  let max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h,
    s,
    l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    let d = max - min;
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

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function hslToRgb(h, s, l) {
  (h /= 360), (s /= 100), (l /= 100);
  let r, g, b;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    let p = 2 * l - q;
    r = Math.round(hue2rgb(p, q, h + 1 / 3) * 255);
    g = Math.round(hue2rgb(p, q, h) * 255);
    b = Math.round(hue2rgb(p, q, h - 1 / 3) * 255);
  }

  return { r, g, b };
}

function rgbToCmyk(r, g, b) {
  let c = 1 - r / 255;
  let m = 1 - g / 255;
  let y = 1 - b / 255;
  let k = Math.min(c, m, y);

  c = (c - k) / (1 - k) || 0;
  m = (m - k) / (1 - k) || 0;
  y = (y - k) / (1 - k) || 0;

  return {
    c: Math.round(c * 100),
    m: Math.round(m * 100),
    y: Math.round(y * 100),
    k: Math.round(k * 100),
  };
}

function cmykToRgb(c, m, y, k) {
  (c /= 100), (m /= 100), (y /= 100), (k /= 100);
  let r = Math.round(255 * (1 - c) * (1 - k));
  let g = Math.round(255 * (1 - m) * (1 - k));
  let b = Math.round(255 * (1 - y) * (1 - k));
  return { r, g, b };
}

function updateColorDisplay(r, g, b) {
  COLOR.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
}

function updateAllFields(r, g, b) {
  // Update RGB fields
  HEX_RED_INPUT.value = r;
  HEX_GREEN_INPUT.value = g;
  HEX_BLUE_INPUT.value = b;

  // Update HSV fields
  let hsv = rgbToHsv(r, g, b);
  HSV_HUE_INPUT.value = Math.round(hsv.h);
  HSV_SATURATION_INPUT.value = Math.round(hsv.s);
  HSV_VALUE_INPUT.value = Math.round(hsv.v);

  // Update HSL fields
  let hsl = rgbToHsl(r, g, b);
  HSL_HUE_INPUT.value = Math.round(hsl.h);
  HSL_SATURATION_INPUT.value = Math.round(hsl.s);
  HSL_LIGHTNESS_INPUT.value = Math.round(hsl.l);

  // Update CMYK fields
  let cmyk = rgbToCmyk(r, g, b);
  CMYK_CYAN_INPUT.value = Math.round(cmyk.c);
  CMYK_MAGENTA_INPUT.value = Math.round(cmyk.m);
  CMYK_YELLOW_INPUT.value = Math.round(cmyk.y);
  CMYK_KEY_INPUT.value = Math.round(cmyk.k);

  // Update HEX field
  HEX_INPUT.value = rgbToHex(r, g, b);

  // Update color display
  updateColorDisplay(r, g, b);
}

function clearAllFields() {
  updateAllFields(0, 0, 0);
}

// Event listeners
CONVERT_HEX.addEventListener("click", () => {
  let hex = HEX_INPUT.value;
  if (!hex.startsWith("#")) {
    hex = `#${hex}`;
  }
  if (/^#([A-Fa-f0-9]{6})$/.test(hex)) {
    let { r, g, b } = hexToRgb(hex);
    updateAllFields(r, g, b);
  } else {
    alert("Invalid HEX color format!");
  }
});

CONVERT_RGB.addEventListener("click", () => {
  let r = parseFloat(HEX_RED_INPUT.value);
  let g = parseFloat(HEX_GREEN_INPUT.value);
  let b = parseFloat(HEX_BLUE_INPUT.value);

  if (
    !isNaN(r) &&
    !isNaN(g) &&
    !isNaN(b) &&
    r >= 0 &&
    r <= 255 &&
    g >= 0 &&
    g <= 255 &&
    b >= 0 &&
    b <= 255
  ) {
    updateAllFields(r, g, b);
  } else {
    alert("Invalid RGB values! Values must be between 0 and 255.");
  }
});

CONVERT_HSV.addEventListener("click", () => {
  let h = parseFloat(HSV_HUE_INPUT.value);
  let s = parseFloat(HSV_SATURATION_INPUT.value);
  let v = parseFloat(HSV_VALUE_INPUT.value);
  if (!isNaN(h) && !isNaN(s) && !isNaN(v)) {
    let { r, g, b } = hsvToRgb(h, s, v);
    updateAllFields(r, g, b);
  } else {
    alert("Invalid HSV values!");
  }
});

CONVERT_HSL.addEventListener("click", () => {
  let h = parseFloat(HSL_HUE_INPUT.value);
  let s = parseFloat(HSL_SATURATION_INPUT.value);
  let l = parseFloat(HSL_LIGHTNESS_INPUT.value);
  if (!isNaN(h) && !isNaN(s) && !isNaN(l)) {
    let { r, g, b } = hslToRgb(h, s, l);
    updateAllFields(r, g, b);
  } else {
    alert("Invalid HSL values!");
  }
});

CONVERT_CMYK.addEventListener("click", () => {
  let c = parseFloat(CMYK_CYAN_INPUT.value);
  let m = parseFloat(CMYK_MAGENTA_INPUT.value);
  let y = parseFloat(CMYK_YELLOW_INPUT.value);
  let k = parseFloat(CMYK_KEY_INPUT.value);
  if (!isNaN(c) && !isNaN(m) && !isNaN(y) && !isNaN(k)) {
    let { r, g, b } = cmykToRgb(c, m, y, k);
    updateAllFields(r, g, b);
  } else {
    alert("Invalid CMYK values!");
  }
});

CLEAR.addEventListener("click", () => {
  clearAllFields();
});
