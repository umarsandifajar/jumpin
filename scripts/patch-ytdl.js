import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const targetFile = path.resolve(__dirname, '../node_modules/@distube/ytdl-core/dist/solver/index.js');

if (fs.existsSync(targetFile)) {
  let content = fs.readFileSync(targetFile, 'utf8');
  const oldRegexPattern = '/player\\\\?\\/([\\da-f]{8})\\\\?\\//u';
  const newRegexPattern = '/player[^\\w]+([a-f0-9]{8})/i';

  if (content.includes(oldRegexPattern)) {
    content = content.replace(oldRegexPattern, newRegexPattern);
    fs.writeFileSync(targetFile, content, 'utf8');
    console.log('[patch-ytdl] Successfully patched @distube/ytdl-core player version regex.');
  } else if (content.includes(newRegexPattern)) {
    console.log('[patch-ytdl] @distube/ytdl-core is already patched.');
  } else {
    // Fallback: replace any regex on that line
    content = content.replace(
      /const found = .*?exec\(text\)\?\.\[1\];/g,
      'const found = /player[^\\w]+([a-f0-9]{8})/i.exec(text)?.[1] || /player\\?\/([\\da-f]{8})\\?\\//u.exec(text)?.[1];'
    );
    fs.writeFileSync(targetFile, content, 'utf8');
    console.log('[patch-ytdl] Applied fallback patch to @distube/ytdl-core.');
  }
} else {
  console.log('[patch-ytdl] Target file not found, skipping patch.');
}
