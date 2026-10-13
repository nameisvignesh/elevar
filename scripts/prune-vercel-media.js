const { readdir, rm } = require('node:fs/promises');
const { resolve } = require('node:path');

const videoFiles = [
  'family-friend.mp4',
  'final-out-tiles.mp4',
  'nanotiles.mp4',
  'reel-6-out.mp4',
  'final-out.mp4',
];

async function pruneVercelMedia() {
  if (process.env.VERCEL !== '1') return;

  const exportDir = resolve(process.cwd(), 'out');
  const exportedFiles = new Set(await readdir(exportDir));
  const mediaFiles = videoFiles.filter((file) => exportedFiles.has(file));

  await Promise.all(mediaFiles.map((file) => rm(resolve(exportDir, file))));
  console.log(`Vercel export: excluded ${mediaFiles.length} hosted portfolio videos.`);
}

pruneVercelMedia().catch((error) => {
  console.error('Unable to prepare the Vercel static export:', error);
  process.exitCode = 1;
});
