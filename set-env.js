const fs = require('fs');
const path = require('path');

// AHORA APUNTAMOS AL ARCHIVO PRINCIPAL QUE LEERÁ EL BUILD
const targetPath = path.join(__dirname, './src/environments/environment.ts');

// Contenido del archivo usando la variable de entorno del sistema
const envConfigFile = `export const environment = {
  production: true,
  githubToken: '${process.env.GITHUB_TOKEN || ''}'
};
`;

// Crear el directorio si no existe y escribir el archivo
fs.mkdirSync(path.dirname(targetPath), { recursive: true });
fs.writeFileSync(targetPath, envConfigFile, 'utf8');

console.log(`¡Archivo de environment generado con éxito en ${targetPath}!`);