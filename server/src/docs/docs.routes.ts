import { Router, Request, Response } from 'express';
import { openApiSpec } from './openapi';

const router = Router();

router.get('/openapi.json', (req: Request, res: Response) => {
  res.json(openApiSpec);
});

router.get('/docs', (req: Request, res: Response) => {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>FloodRoute AI - Enterprise API Documentation</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui.css" />
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%230EA5E9'><path d='M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z'/></svg>">
  <style>
    body {
      margin: 0;
      background: #020617;
      color: #f8fafc;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    .topbar {
      background: #0f172a !important;
      border-bottom: 1px solid rgba(255,255,255,0.1);
      padding: 12px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .topbar a {
      color: #0ea5e9;
      font-weight: 700;
      font-size: 1.2rem;
      text-decoration: none;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .swagger-ui .info .title {
      color: #38bdf8 !important;
    }
    .swagger-ui {
      filter: invert(88%) hue-rotate(180deg);
      padding: 20px;
    }
  </style>
</head>
<body>
  <div class="topbar">
    <a href="/">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="#0EA5E9"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>
      FloodRoute AI Enterprise Gateway
    </a>
    <span style="color: #94a3b8; font-size: 0.875rem;">OpenAPI 3.0.3 Specification</span>
  </div>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-bundle.js"></script>
  <script>
    window.onload = function() {
      SwaggerUIBundle({
        url: '/api/openapi.json',
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIBundle.SwaggerUIStandalonePreset
        ],
        layout: "BaseLayout"
      });
    };
  </script>
</body>
</html>`;
  res.setHeader('Content-Type', 'text/html');
  res.send(html);
});

export default router;
