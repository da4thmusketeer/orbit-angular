const fs = require('fs');
const path = require('path');

// Parse .env file if present in project root (zero external dependencies)
const envPath = path.join(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf8');
  envConfig.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...values] = trimmed.split('=');
      if (key && values.length > 0) {
        const val = values.join('=').trim().replace(/^["']|["']$/g, '');
        if (!process.env[key.trim()]) {
          process.env[key.trim()] = val;
        }
      }
    }
  });
}

const envDir = path.join(__dirname, '../src/app/environments');
const targetDevPath = path.join(envDir, 'environments.ts');
const targetProdPath = path.join(envDir, 'environments.production.ts');

const devContent = `export const environment = {
  production: false,
  API_BASE_URL: "${process.env.API_BASE_URL || 'http://localhost:9000'}",
  FRONTEND_BASE_URL: "${process.env.FRONTEND_BASE_URL || 'http://localhost:4200'}",
  GITHUB_CLIENT_ID: "${process.env.GITHUB_CLIENT_ID || 'Ov23lipBrF0ETo5PoPDF'}",
  GITHUB_REDIRECT_URI: "${process.env.GITHUB_REDIRECT_URI || 'http://localhost:4200/auth/github/callback'}",
  GOOGLE_CLIENT_ID: "${process.env.GOOGLE_CLIENT_ID || '36586407341-8jajmmg2ltll44tqdob6v5dp5g743oos.apps.googleusercontent.com'}",
  GOOGLE_REDIRECT_URI: "${process.env.GOOGLE_REDIRECT_URI || 'http://localhost:4200/auth/github/callback'}",
};
`;

const prodContent = `export const environment = {
  production: true,
  API_BASE_URL: "${process.env.PROD_API_BASE_URL || process.env.API_BASE_URL || 'https://api.yourdomain.com'}",
  FRONTEND_BASE_URL: "${process.env.PROD_FRONTEND_BASE_URL || process.env.FRONTEND_BASE_URL || 'https://yourdomain.com'}",
  GITHUB_CLIENT_ID: "${process.env.PROD_GITHUB_CLIENT_ID || process.env.GITHUB_CLIENT_ID || ''}",
  GITHUB_REDIRECT_URI: "${process.env.PROD_GITHUB_REDIRECT_URI || 'https://yourdomain.com/auth/github/callback'}",
  GOOGLE_CLIENT_ID: "${process.env.PROD_GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID || ''}",
  GOOGLE_REDIRECT_URI: "${process.env.PROD_GOOGLE_REDIRECT_URI || 'https://yourdomain.com/auth/github/callback'}",
};
`;

if (!fs.existsSync(envDir)) {
  fs.mkdirSync(envDir, { recursive: true });
}

fs.writeFileSync(targetDevPath, devContent, 'utf8');
console.log(`[set-env] Generated dev environment file at: ${targetDevPath}`);

fs.writeFileSync(targetProdPath, prodContent, 'utf8');
console.log(`[set-env] Generated prod environment file at: ${targetProdPath}`);
