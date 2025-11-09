const textEl = document.getElementById('text');
const sizeEl = document.getElementById('size');
const ecEl = document.getElementById('ec');
const marginEl = document.getElementById('margin');
const fgEl = document.getElementById('fg');
const bgEl = document.getElementById('bg');
const generateBtn = document.getElementById('generate');
const downloadBtn = document.getElementById('download');
//const clearBtn = document.getElementById('clear');
const canvas = document.getElementById('qr-canvas');
const copyBtn = document.getElementById('copy');
const zoomIn = document.getElementById('zoom-in');
const zoomOut = document.getElementById('zoom-out');
const toastContainer = document.getElementById('toast-container');
const previewDiv = document.getElementById("preview-div");

function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  toastContainer.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}

async function generate() {
  const value = textEl.value.trim();
  if (!value) return showToast('Bitte Text oder URL eingeben.');

  const options = {
    errorCorrectionLevel: ecEl.value,
    margin: Number(marginEl.value),
    width: Number(sizeEl.value),
    color: {
      dark: fgEl.value,
      light: bgEl.value
    }
  };

  try {
    await QRCode.toCanvas(canvas, value, options);
    previewDiv.classList.remove("disabled");
  } catch (err) {
    console.error(err);
    showToast('Fehler beim Erzeugen des QR-Codes.');
  }
}

generateBtn.addEventListener('click', generate);

downloadBtn.addEventListener('click', () => {
  const dataUrl = canvas.toDataURL('image/png');
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = 'qr-code.png';
  document.body.appendChild(a);
  a.click();
  a.remove();
});

copyBtn.addEventListener('click', async () => {
  try {
    const dataUrl = canvas.toDataURL('image/png');
    await navigator.clipboard.writeText(dataUrl);
    showToast('Data-URL in Zwischenablage kopiert.');
  } catch (e) {
    showToast('Kopieren nicht möglich. Verwende den Download-Button.');
  }
});

zoomIn.addEventListener('click', () => {
  sizeEl.value = Math.min(2048, Number(sizeEl.value) + 50);
  canvas.width = sizeEl.value;
  canvas.height = sizeEl.value;
  generate();
});

zoomOut.addEventListener('click', () => {
  sizeEl.value = Math.max(64, Number(sizeEl.value) - 50);
  canvas.width = sizeEl.value;
  canvas.height = sizeEl.value;
  generate();
});

//clearBtn.addEventListener('click', () => {
  //textEl.value = '';
  //sizeEl.value = 300;
  //ecEl.value = 'M';
  //marginEl.value = 4;
  //fgEl.value = '#000000';
  //bgEl.value = '#ffffff';
  //canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
  //showToast('Zurückgesetzt.');
//});

//window.addEventListener('load', () => {
//  canvas.width = Number(sizeEl.value);
// canvas.height = Number(sizeEl.value);
//  generate();
//});

textEl.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    generate();
  }
});