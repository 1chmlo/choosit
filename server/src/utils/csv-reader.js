import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function leerPalabrasProhibidas() {
  try {
    const csvPath = path.join(__dirname, '../data/palabras-prohibidas.csv');
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    
    const lines = csvContent.split('\n');
    const palabras = [];
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line) {
        const values = line.split(',');
        const palabra = {
          palabra: values[0],
          categoria: values[1],
          severidad: values[2],
          descripcion: values[3]
        };
        palabras.push(palabra);
      }
    }
    
    return palabras;
  } catch (error) {
    console.error('Error leyendo CSV de palabras prohibidas:', error);
    return [];
  }
}

export function obtenerListaPalabras() {
  const palabrasData = leerPalabrasProhibidas();
  return palabrasData.map(item => item.palabra);
}

export function obtenerPalabrasPorCategoria(categoria) {
  const palabrasData = leerPalabrasProhibidas();
  return palabrasData
    .filter(item => item.categoria === categoria)
    .map(item => item.palabra);
}