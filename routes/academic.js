const express = require('express');
const router = express.Router();
const Academic = require('../models/Academic');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dgmexpa8v',
  api_key: process.env.CLOUDINARY_API_KEY || '577674637224497',
  api_secret: process.env.CLOUDINARY_API_SECRET || '_8Ks_XU3nurQTFUbVA3RxpbcXFE'
});

// Get all publications
router.get('/', async (req, res) => {
  try {
    const publications = await Academic.find().sort({ createdAt: -1 });
    res.json(publications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single publication
router.get('/:id', async (req, res) => {
  try {
    const publication = await Academic.findById(req.params.id);
    if (!publication) {
      return res.status(404).json({ error: 'Publication not found' });
    }
    res.json(publication);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create publication
router.post('/', async (req, res) => {
  try {
    const publication = new Academic(req.body);
    await publication.save();
    res.status(201).json(publication);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update publication
router.put('/:id', async (req, res) => {
  try {
    const publication = await Academic.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!publication) {
      return res.status(404).json({ error: 'Publication not found' });
    }
    res.json(publication);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete publication
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Basic validation - just check it's not empty
    if (!id || id.trim() === '') {
      return res.status(400).json({ error: 'Publication ID is required' });
    }
    
    console.log('Deleting academic publication with ID:', id);
    
    // Try to delete - findByIdAndDelete handles invalid ObjectIds by returning null
    const publication = await Academic.findByIdAndDelete(id.trim());
    
    if (!publication) {
      console.log('Publication not found with ID:', id);
      return res.status(404).json({ error: 'Publication not found' });
    }
    
    console.log('Publication deleted successfully:', publication.title || 'Untitled');
    res.json({ message: 'Publication deleted successfully' });
  } catch (error) {
    console.error('Error deleting academic publication:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      error: error.message || 'Failed to delete publication',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Serve PDF file
router.get('/:id/pdf', async (req, res) => {
  try {
    const publication = await Academic.findById(req.params.id);
    if (!publication) {
      return res.status(404).json({ error: 'Publication not found' });
    }
    
    if (!publication.pdfLink) {
      return res.status(404).json({ error: 'PDF not found for this publication' });
    }

    const download = req.query.download === 'true';
    
    console.log('Fetching PDF from:', publication.pdfLink);
    
    // Try to fetch PDF - handle Cloudinary URLs specially
    let buffer;
    try {
      // If it's a Cloudinary URL, use Admin API to download directly
      if (publication.pdfLink.includes('cloudinary.com')) {
        // Extract public ID from Cloudinary URL
        // URL format: https://res.cloudinary.com/{cloud_name}/raw/upload/v{version}/{public_id}.pdf
        const urlMatch = publication.pdfLink.match(/\/v\d+\/(.+)$/);
        if (urlMatch) {
          const publicId = urlMatch[1].replace(/\.pdf$/, '');
          console.log('Extracted public ID:', publicId);
          
          // Try multiple approaches to fetch the PDF
          console.log('Attempting to fetch PDF with multiple methods...');
          
          const cloudName = process.env.CLOUDINARY_CLOUD_NAME || 'dgmexpa8v';
          const https = require('https');
          
          // Method 1: Try the original URL first (should work if PDF delivery is enabled)
          try {
            console.log('Method 1: Trying original URL...');
            buffer = await new Promise((resolve, reject) => {
              const request = https.get(publication.pdfLink, {
                headers: {
                  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                  'Accept': 'application/pdf, */*',
                },
              }, (response) => {
                if (response.statusCode === 200) {
                  const chunks = [];
                  response.on('data', (chunk) => chunks.push(chunk));
                  response.on('end', () => {
                    console.log('PDF downloaded successfully via original URL');
                    resolve(Buffer.concat(chunks));
                  });
                } else {
                  reject(new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`));
                }
              });
              request.on('error', reject);
              request.setTimeout(10000, () => {
                request.destroy();
                reject(new Error('Request timeout'));
              });
            });
            console.log('Success with original URL!');
          } catch (method1Error) {
            console.log('Method 1 failed:', method1Error.message);
            
            // Method 2: Try generating a fresh public URL without version
            try {
              console.log('Method 2: Trying fresh public URL...');
              const freshUrl = cloudinary.url(publicId, {
                resource_type: 'raw',
                secure: true,
                type: 'upload',
                format: 'pdf'
              });
              console.log('Fresh URL:', freshUrl);
              
              buffer = await new Promise((resolve, reject) => {
                const request = https.get(freshUrl, {
                  headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    'Accept': 'application/pdf, */*',
                  },
                }, (response) => {
                  if (response.statusCode === 200) {
                    const chunks = [];
                    response.on('data', (chunk) => chunks.push(chunk));
                    response.on('end', () => {
                      console.log('PDF downloaded successfully via fresh URL');
                      resolve(Buffer.concat(chunks));
                    });
                  } else {
                    reject(new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`));
                  }
                });
                request.on('error', reject);
                request.setTimeout(10000, () => {
                  request.destroy();
                  reject(new Error('Request timeout'));
                });
              });
              console.log('Success with fresh URL!');
            } catch (method2Error) {
              console.log('Method 2 failed:', method2Error.message);
              
              // Method 3: Try using Admin API with authentication
              console.log('Method 3: Trying Admin API with authentication...');
              const apiKey = process.env.CLOUDINARY_API_KEY || '577674637224497';
              const apiSecret = process.env.CLOUDINARY_API_SECRET || '_8Ks_XU3nurQTFUbVA3RxpbcXFE';
              
              const timestamp = Math.floor(Date.now() / 1000);
              const paramsToSign = {
                public_id: publicId,
                resource_type: 'raw',
                timestamp: timestamp
              };
              
              const signature = cloudinary.utils.api_sign_request(paramsToSign, apiSecret);
              
              // Try Admin API resource endpoint to get file info, then construct download URL
              const adminResourceUrl = `https://api.cloudinary.com/v1_1/${cloudName}/resources/raw/upload/${publicId}?api_key=${apiKey}&timestamp=${timestamp}&signature=${signature}`;
              
              try {
                const resourceResponse = await new Promise((resolve, reject) => {
                  const request = https.get(adminResourceUrl, {
                    headers: {
                      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    },
                  }, (response) => {
                    let data = '';
                    response.on('data', (chunk) => data += chunk);
                    response.on('end', () => {
                      if (response.statusCode === 200) {
                        resolve(JSON.parse(data));
                      } else {
                        reject(new Error(`Admin API failed: ${response.statusCode}`));
                      }
                    });
                  });
                  request.on('error', reject);
                });
                
                // Use the secure_url from the resource response
                const secureUrl = resourceResponse.secure_url || resourceResponse.url;
                console.log('Got secure URL from Admin API:', secureUrl);
                
                buffer = await new Promise((resolve, reject) => {
                  const request = https.get(secureUrl, {
                    headers: {
                      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                      'Accept': 'application/pdf, */*',
                    },
                  }, (response) => {
                    if (response.statusCode === 200) {
                      const chunks = [];
                      response.on('data', (chunk) => chunks.push(chunk));
                      response.on('end', () => {
                        console.log('PDF downloaded successfully via Admin API secure URL');
                        resolve(Buffer.concat(chunks));
                      });
                    } else {
                      reject(new Error(`Failed to fetch from secure URL: ${response.statusCode}`));
                    }
                  });
                  request.on('error', reject);
                });
              } catch (method3Error) {
                console.error('All methods failed:', method3Error);
                throw new Error(`All download methods failed. Last error: ${method3Error.message}. Please verify PDF delivery is enabled in Cloudinary Settings > Security.`);
              }
            }
          }
        } else {
          throw new Error('Could not extract public ID from Cloudinary URL');
        }
      } else {
        // For non-Cloudinary URLs, use regular HTTP fetch
        const https = require('https');
        const http = require('http');
        const parsedUrl = new URL(publication.pdfLink);
        const client = parsedUrl.protocol === 'https:' ? https : http;
        
        buffer = await new Promise((resolve, reject) => {
          const request = client.get(publication.pdfLink, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            },
          }, (response) => {
            if (response.statusCode !== 200) {
              reject(new Error(`Failed to fetch PDF: ${response.statusCode} ${response.statusMessage}`));
              return;
            }
            const chunks = [];
            response.on('data', (chunk) => chunks.push(chunk));
            response.on('end', () => {
              resolve(Buffer.concat(chunks));
            });
          });
          request.on('error', reject);
        });
      }
    } catch (fetchError) {
      console.error('Error fetching PDF:', fetchError);
      return res.status(500).json({ 
        error: `Failed to fetch PDF: ${fetchError.message}`,
        url: publication.pdfLink
      });
    }
    
    if (!buffer || buffer.length === 0) {
      return res.status(500).json({ error: 'PDF file is empty' });
    }

    // Set appropriate headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Length', buffer.length);
    
    if (download) {
      const filename = `${publication.title.replace(/[^a-z0-9]/gi, '_')}.pdf`;
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    } else {
      res.setHeader('Content-Disposition', 'inline');
      res.setHeader('Cache-Control', 'public, max-age=3600');
    }

    // Send the PDF
    res.send(buffer);
  } catch (error) {
    console.error('Error serving PDF:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to serve PDF',
      details: error.stack
    });
  }
});

module.exports = router;

