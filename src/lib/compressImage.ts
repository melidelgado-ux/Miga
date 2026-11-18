const MAX_IMAGE_BYTES = 200 * 1024;
const MAX_SOURCE_BYTES = 25 * 1024 * 1024;
const MAX_DIMENSION = 1280;

function readAsDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () =>
      typeof reader.result === 'string'
        ? resolve(reader.result)
        : reject(new Error('No se pudo leer la fotografía.'));
    reader.onerror = () => reject(new Error('No se pudo leer la fotografía.'));
    reader.readAsDataURL(blob);
  });
}

function canvasToJpeg(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) =>
        blob ? resolve(blob) : reject(new Error('No se pudo preparar la fotografía.')),
      'image/jpeg',
      quality
    );
  });
}

export async function compressRecipeImage(file: File): Promise<string> {
  if (!['image/jpeg', 'image/png', 'image/webp', 'image/avif'].includes(file.type)) {
    throw new Error('Elegí una imagen JPEG, PNG, WebP o AVIF.');
  }
  if (file.size > MAX_SOURCE_BYTES) throw new Error('La imagen original supera 25 MiB. Elegí una más pequeña.');

  const image = new Image();
  const source = await readAsDataUrl(file);
  image.src = source;
  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = () => reject(new Error('No se pudo abrir la fotografía.'));
  });

  const scale = Math.min(1, MAX_DIMENSION / Math.max(image.naturalWidth, image.naturalHeight));
  let width = Math.max(1, Math.round(image.naturalWidth * scale));
  let height = Math.max(1, Math.round(image.naturalHeight * scale));

  for (let resizeAttempt = 0; resizeAttempt < 4; resizeAttempt += 1) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('No se pudo preparar la fotografía.');
    context.fillStyle = '#FFFFFF';
    context.fillRect(0, 0, width, height);
    context.drawImage(image, 0, 0, width, height);

    for (const quality of [0.78, 0.68, 0.58, 0.48]) {
      const blob = await canvasToJpeg(canvas, quality);
      if (blob.size <= MAX_IMAGE_BYTES) return readAsDataUrl(blob);
    }

    width = Math.max(480, Math.round(width * 0.75));
    height = Math.max(480, Math.round(height * 0.75));
  }

  throw new Error('La fotografía supera el tamaño permitido. Elegí una imagen más pequeña.');
}
