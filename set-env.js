const fs = require('fs');
const path = require('path');

// Apuntamos al archivo principal que leerá el build
const targetPath = path.join(__dirname, './src/environments/environment.ts');

// Contenido del archivo usando las variables de entorno del sistema (Vercel / Local)
const envConfigFile = `export const environment = {
  production: true,
  githubToken: '${process.env.GITHUB_TOKEN || ''}',
  supabaseUrl: '${process.env.SUPABASE_URL || ''}',
  supabaseKey: '${process.env.SUPABASE_KEY || ''}'
};
`;

// Crear el directorio si no existe y escribir el archivo
fs.mkdirSync(path.dirname(targetPath), { recursive: true });
fs.writeFileSync(targetPath, envConfigFile, 'utf8');

console.log(`¡Archivo de environment generado con éxito en ${targetPath}!`);