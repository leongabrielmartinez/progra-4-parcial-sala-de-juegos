const fs = require('fs');
const path = require('path');

// Apuntamos a la ruta exacta donde Angular buscará el entorno
const targetPath = path.join(__dirname, './src/environments/environment.ts');

const envConfigFile = `export const environment = {
  production: true,
  githubToken: '${process.env.GITHUB_TOKEN || ''}',
  supabaseUrl: '${process.env.SUPABASE_URL || ''}',
  supabaseKey: '${process.env.SUPABASE_KEY || ''}'
};
`;

fs.mkdirSync(path.dirname(targetPath), { recursive: true });
fs.writeFileSync(targetPath, envConfigFile, 'utf8');

console.log(`¡Archivo de environment generado con éxito!`);