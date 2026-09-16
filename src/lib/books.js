import fs from 'fs';
import path from 'path';

const catalogPath = path.join(process.cwd(), 'data', 'livros.json');

export function readBooks() {
  if (!fs.existsSync(catalogPath)) return [];
  return JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
}

export function writeBooks(books) {
  fs.writeFileSync(catalogPath, JSON.stringify(books, null, 2));
}

export function bookFilePath(filename) {
  return path.join(process.cwd(), 'public', 'livros', filename);
}
