const { spawn } = require('child_process');
const path = require('path');
const ffmpegPath = require('ffmpeg-static');

if (process.argv.length < 4) {
    console.error('Usage: node scripts/transcode.js <input.mp4> <output-base>');
    process.exit(2);
}

const input = process.argv[2];
const outBase = process.argv[3];

function run(args) {
    return new Promise((resolve, reject) => {
        const cp = spawn(ffmpegPath, args, { stdio: 'inherit' });
        cp.on('close', (code) => {
            if (code === 0) resolve(); else reject(new Error('ffmpeg exit ' + code));
        });
    });
}

(async () => {
    try {
        console.log('Creating 480p MP4...');
        await run(['-y', '-i', input, '-c:v', 'libx264', '-preset', 'fast', '-b:v', '800k', '-vf', 'scale=-2:480', '-c:a', 'aac', '-b:a', '128k', `${outBase}-480.mp4`]);

        console.log('Creating 720p MP4...');
        await run(['-y', '-i', input, '-c:v', 'libx264', '-preset', 'fast', '-b:v', '2500k', '-vf', 'scale=-2:720', '-c:a', 'aac', '-b:a', '128k', `${outBase}-720.mp4`]);

        console.log('Creating WebM (480)...');
        await run(['-y', '-i', input, '-c:v', 'libvpx-vp9', '-b:v', '800k', '-vf', 'scale=-2:480', '-c:a', 'libopus', '-b:a', '96k', `${outBase}-480.webm`]);

        console.log('Creating WebM (720)...');
        await run(['-y', '-i', input, '-c:v', 'libvpx-vp9', '-b:v', '2500k', '-vf', 'scale=-2:720', '-c:a', 'libopus', '-b:a', '128k', `${outBase}-720.webm`]);

        console.log('Creating HLS master playlist...');
        await run(['-y', '-i', input,
            '-map', '0:v:0', '-map', '0:a:0', '-c:v', 'libx264', '-b:v:0', '800k', '-s:v:0', '640x360',
            '-c:a', 'aac', '-b:a', '96k', '-f', 'hls', '-hls_time', '6', '-hls_playlist_type', 'vod', `${outBase}-360.m3u8`]);

        console.log('All done.');
    } catch (e) {
        console.error('Error:', e);
        process.exit(1);
    }
})();
