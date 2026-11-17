import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import sharp from 'sharp';

function sharpApiPlugin(): Plugin {
  return {
    name: 'sharp-api-plugin',
    configureServer(server) {
      // Health check endpoint
      server.middlewares.use('/api/sharp/health', (_req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.end(
          JSON.stringify({
            status: 'ok',
            sharpVersion: sharp.versions.sharp,
            vipsVersion: sharp.versions.vips,
            capabilities: ['svg-to-png', 'high-dpi-300', 'jpeg', 'webp', 'filters'],
          })
        );
      });

      // SVG to PNG/JPEG/WebP export endpoint at custom DPI (e.g. 300 DPI for print)
      server.middlewares.use('/api/export-sharp', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end(JSON.stringify({ error: 'Method Not Allowed' }));
          return;
        }

        let body = '';
        req.on('data', (chunk) => {
          body += chunk;
        });

        req.on('end', async () => {
          try {
            const data = JSON.parse(body);
            const {
              svg,
              format = 'png',
              density = 300,
              width,
              height,
              quality = 95,
              sharpen = false,
              brightness = 1.0,
            } = data;

            if (!svg) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Missing svg field in request body' }));
              return;
            }

            const inputBuffer = Buffer.from(svg, 'utf-8');
            let pipeline = sharp(inputBuffer, { density: Number(density) || 300 });

            if (width && height) {
              pipeline = pipeline.resize(Number(width), Number(height), {
                fit: 'contain',
                background: { r: 255, g: 255, b: 255, alpha: 0 },
              });
            }

            if (sharpen) {
              pipeline = pipeline.sharpen();
            }

            if (brightness !== 1.0) {
              pipeline = pipeline.modulate({
                brightness: Number(brightness) || 1.0,
              });
            }

            let outputBuffer: Buffer;
            let mimeType = 'image/png';
            let fileExt = 'png';

            if (format === 'jpeg' || format === 'jpg') {
              outputBuffer = await pipeline.jpeg({ quality: Number(quality) || 90 }).toBuffer();
              mimeType = 'image/jpeg';
              fileExt = 'jpg';
            } else if (format === 'webp') {
              outputBuffer = await pipeline.webp({ quality: Number(quality) || 90 }).toBuffer();
              mimeType = 'image/webp';
              fileExt = 'webp';
            } else {
              outputBuffer = await pipeline.png({ compressionLevel: 8 }).toBuffer();
              mimeType = 'image/png';
              fileExt = 'png';
            }

            res.statusCode = 200;
            res.setHeader('Content-Type', mimeType);
            res.setHeader(
              'Content-Disposition',
              `attachment; filename="darunnajat-madrasah-poster-${density}dpi.${fileExt}"`
            );
            res.end(outputBuffer);
          } catch (err: any) {
            console.error('Sharp processing error:', err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: err.message || 'Image processing failed' }));
          }
        });
      });

      // Process raster image endpoint
      server.middlewares.use('/api/process-image', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end(JSON.stringify({ error: 'Method Not Allowed' }));
          return;
        }

        let body = '';
        req.on('data', (chunk) => {
          body += chunk;
        });

        req.on('end', async () => {
          try {
            const data = JSON.parse(body);
            const { imageBase64, format = 'png', sharpen = false, brightness = 1.0 } = data;

            if (!imageBase64) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Missing imageBase64 field' }));
              return;
            }

            const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');
            const inputBuffer = Buffer.from(cleanBase64, 'base64');

            let pipeline = sharp(inputBuffer);
            if (sharpen) pipeline = pipeline.sharpen();
            if (brightness !== 1.0) {
              pipeline = pipeline.modulate({ brightness: Number(brightness) });
            }

            let outputBuffer: Buffer;
            let mimeType = 'image/png';
            if (format === 'jpeg' || format === 'jpg') {
              outputBuffer = await pipeline.jpeg({ quality: 95 }).toBuffer();
              mimeType = 'image/jpeg';
            } else {
              outputBuffer = await pipeline.png().toBuffer();
              mimeType = 'image/png';
            }

            res.statusCode = 200;
            res.setHeader('Content-Type', mimeType);
            res.end(outputBuffer);
          } catch (err: any) {
            console.error('Sharp process image error:', err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: err.message || 'Raster processing failed' }));
          }
        });
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), sharpApiPlugin()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: true,
  },
  preview: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: true,
  },
  build: {
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/fabric/')) return 'fabric';
          if (id.includes('node_modules/jspdf/')) return 'jspdf';
          if (id.includes('node_modules/@svgdotjs/')) return 'svgjs';
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) return 'react-vendor';
        },
      },
    },
  },
});
