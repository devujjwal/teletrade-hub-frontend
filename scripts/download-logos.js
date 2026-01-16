#!/usr/bin/env node

/**
 * Brand Logo Downloader Script
 * 
 * Downloads brand logos using Google Favicons API (which we know works)
 * and saves them to /public/logos/ directory
 * 
 * Usage: npm run download-logos
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const LOGOS_DIR = path.join(__dirname, '../public/logos');
const DELAY_MS = 300; // Delay between downloads to be respectful

// Brand domain mappings (same as in brand-logo.tsx)
const BRAND_DOMAINS = {
  // Phones & Mobile
  'apple': 'apple.com',
  'apple-inc': 'apple.com',
  'samsung': 'samsung.com',
  'samsung-electronics': 'samsung.com',
  'google': 'google.com',
  'google-pixel': 'google.com',
  'xiaomi': 'mi.com',
  'mi': 'mi.com',
  'redmi': 'mi.com',
  'huawei': 'huawei.com',
  'oneplus': 'oneplus.com',
  'one-plus': 'oneplus.com',
  'oppo': 'oppo.com',
  'vivo': 'vivo.com',
  'nokia': 'nokia.com',
  'motorola': 'motorola.com',
  'moto': 'motorola.com',
  'realme': 'realme.com',
  'poco': 'poco.net',
  'honor': 'honor.com',
  'nothing': 'nothing.tech',
  'nothing-phone': 'nothing.tech',
  'htc': 'htc.com',
  'blackberry': 'blackberry.com',
  'infinix': 'infinixmobility.com',
  'tecno': 'tecno-mobile.com',
  'zte': 'zte.com',
  'tcl': 'tcl.com',
  'alcatel': 'alcatelmobile.com',
  'ulefone': 'ulefone.com',
  
  // Laptops & Computers
  'microsoft': 'microsoft.com',
  'microsoft-surface': 'microsoft.com',
  'surface': 'microsoft.com',
  'lenovo': 'lenovo.com',
  'thinkpad': 'lenovo.com',
  'ideapad': 'lenovo.com',
  'asus': 'asus.com',
  'rog': 'asus.com',
  'acer': 'acer.com',
  'hp': 'hp.com',
  'hewlett-packard': 'hp.com',
  'dell': 'dell.com',
  'msi': 'msi.com',
  'razer': 'razer.com',
  'alienware': 'dell.com',
  'toshiba': 'toshiba.com',
  'fujitsu': 'fujitsu.com',
  'framework': 'frame.work',
  'system76': 'system76.com',
  'lg': 'lg.com',
  'lg-electronics': 'lg.com',
  
  // Gaming Consoles
  'nintendo': 'nintendo.com',
  'nintendo-switch': 'nintendo.com',
  'sony': 'sony.com',
  'playstation': 'playstation.com',
  'ps5': 'playstation.com',
  'ps4': 'playstation.com',
  'xbox': 'xbox.com',
  'xbox-series': 'xbox.com',
  'sega': 'sega.com',
  'atari': 'atari.com',
  'valve': 'valvesoftware.com',
  'steam': 'steampowered.com',
  'steam-deck': 'steampowered.com',
  
  // Headphones & Audio
  'jbl': 'jbl.com',
  'bose': 'bose.com',
  'beats': 'beatsbydre.com',
  'sennheiser': 'sennheiser.com',
  'audio-technica': 'audio-technica.com',
  'akg': 'akg.com',
  'skullcandy': 'skullcandy.com',
  'bang-olufsen': 'bang-olufsen.com',
  'jabra': 'jabra.com',
  'plantronics': 'plantronics.com',
  'poly': 'poly.com',
  'shure': 'shure.com',
  'beyerdynamic': 'beyerdynamic.com',
  'anker': 'anker.com',
  'soundcore': 'soundcore.com',
  
  // Telecom
  'vodafone': 'vodafone.com',
  'callya-vodafone': 'vodafone.com',
  'callya': 'vodafone.com',
  't-mobile': 't-mobile.com',
  'att': 'att.com',
  'at-t': 'att.com',
  'verizon': 'verizon.com',
  'orange': 'orange.com',
  'o2': 'o2.com',
  'three': 'three.co.uk',
  '3': 'three.co.uk',
  'ee': 'ee.co.uk',
  'telekom': 'telekom.com',
  'deutsche-telekom': 'telekom.com',
  'airtel': 'airtel.in',
  'jio': 'jio.com',
  'reliance-jio': 'jio.com',
  'vi': 'myvi.in',
  'vodafone-idea': 'myvi.in',
  'mtn': 'mtn.com',
  'etisalat': 'etisalat.ae',
  'du': 'du.ae',
  'zain': 'zain.com',
  'stc': 'stc.com.sa',
  'saudi-telecom': 'stc.com.sa',
  'ooredoo': 'ooredoo.com',
  'lycamobile': 'lycamobile.com',
  'lyca': 'lycamobile.com',
  'giffgaff': 'giffgaff.com',
  'lebara': 'lebara.com',
  
  // Networking & Tech
  'intel': 'intel.com',
  'amd': 'amd.com',
  'nvidia': 'nvidia.com',
  'cisco': 'cisco.com',
  'tp-link': 'tp-link.com',
  'netgear': 'netgear.com',
  'linksys': 'linksys.com',
  'belkin': 'belkin.com',
  'panasonic': 'panasonic.com',
  'philips': 'philips.com',
  'bosch': 'bosch.com',
  'siemens': 'siemens.com',
};

// Download a file from URL
function downloadFile(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    
    https.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        // Handle redirects
        file.close();
        if (fs.existsSync(filepath)) {
          fs.unlinkSync(filepath);
        }
        return downloadFile(response.headers.location, filepath)
          .then(resolve)
          .catch(reject);
      }
      
      if (response.statusCode !== 200) {
        file.close();
        if (fs.existsSync(filepath)) {
          fs.unlinkSync(filepath);
        }
        reject(new Error(`HTTP ${response.statusCode}`));
        return;
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      file.close();
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }
      reject(err);
    });
  });
}

// Sleep function for rate limiting
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Main download function
async function downloadLogos() {
  // Ensure logos directory exists
  if (!fs.existsSync(LOGOS_DIR)) {
    fs.mkdirSync(LOGOS_DIR, { recursive: true });
    console.log(`✅ Created directory: ${LOGOS_DIR}`);
  }

  const brands = Object.keys(BRAND_DOMAINS);
  const total = brands.length;
  let success = 0;
  let skipped = 0;
  let failed = 0;
  const failedBrands = [];

  console.log(`\n🚀 Starting download of ${total} brand logos from Google Favicons API...\n`);

  for (let i = 0; i < brands.length; i++) {
    const brandSlug = brands[i];
    const domain = BRAND_DOMAINS[brandSlug];
    const filename = `${brandSlug}.png`; // Google Favicons returns PNG
    const filepath = path.join(LOGOS_DIR, filename);
    const url = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;

    // Skip if file already exists
    if (fs.existsSync(filepath)) {
      process.stdout.write(`⏭️  [${i + 1}/${total}] ${brandSlug} (exists) `);
      console.log('✅');
      skipped++;
      continue;
    }

    try {
      process.stdout.write(`📥 [${i + 1}/${total}] ${brandSlug}... `);
      await downloadFile(url, filepath);
      console.log('✅');
      success++;
      
      // Rate limiting - be respectful to servers
      if (i < brands.length - 1) {
        await sleep(DELAY_MS);
      }
    } catch (error) {
      console.log(`❌ ${error.message}`);
      failed++;
      failedBrands.push({ brand: brandSlug, domain, error: error.message });
    }
  }

  // Summary
  console.log(`\n📊 Download Summary:`);
  console.log(`   ✅ Downloaded: ${success}/${total}`);
  console.log(`   ⏭️  Skipped (already exists): ${skipped}/${total}`);
  console.log(`   ❌ Failed: ${failed}/${total}`);
  
  if (failedBrands.length > 0) {
    console.log(`\n⚠️  Failed downloads:`);
    failedBrands.forEach(({ brand, domain, error }) => {
      console.log(`   - ${brand} (${domain}): ${error}`);
    });
  }

  if (success > 0) {
    console.log(`\n✨ Successfully downloaded ${success} logos to: ${LOGOS_DIR}`);
    console.log(`💡 Tip: Logos are saved as PNG files. You can replace them with SVG versions from Wikimedia Commons for better quality.\n`);
  }
}

// Run the script
if (require.main === module) {
  downloadLogos().catch(console.error);
}

module.exports = { downloadLogos, BRAND_DOMAINS };
