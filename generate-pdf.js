import { chromium } from 'playwright';
import { PDFDocument } from 'pdf-lib';
import fs from 'fs';
// node ./generate-pdf.js
async function convertDeckToPdf() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // Pixel-perfect 16:9 Presentation Viewport
  await page.setViewportSize({ width: 1280, height: 730 });

  const deckUrl = 'http://localhost:5173'; 
  await page.goto(deckUrl, { waitUntil: 'networkidle' });

  console.log('Deck loaded. Starting sequential stage progression...');

  // Set up standard print rules on the body
  await page.addStyleTag({
    content: `
      body {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
    `
  });

  // Count slides via your progress rail
  const slideButtons = await page.$$('button[aria-label^="Go to slide"]');
  const totalSlides = slideButtons.length;
  
  console.log(`Detected ${totalSlides} total slides.`);
  const pdfPages = [];

  for (let i = 0; i < totalSlides; i++) {
    console.log(`Navigating to slide index ${i + 1}/${totalSlides}...`);
    
    // 1. Force the deck back to the base state of this specific slide index
    await page.evaluate((index) => {
      const buttons = document.querySelectorAll('button[aria-label^="Go to slide"]');
      if (buttons[index]) buttons[index].click();
    }, i);

    // Let the new slide mount and initialize its stage dots
    await page.waitForTimeout(600);

    // 2. Step through every internal stage using Keyboard actions
    let slideFullyLoaded = false;
    let currentStage = 0;
    let attempts = 0;
    const MAX_STAGES = 20; 

    while (!slideFullyLoaded && attempts < MAX_STAGES) {
      attempts++;

      // Check current active dot positioning
      const stageState = await page.evaluate(() => {
        const dots = document.querySelectorAll('.fixed.bottom-9.left-1\\/2 span');
        if (dots.length === 0) return { current: 0, total: 0 };
        
        let activeIndex = 0;
        dots.forEach((dot, idx) => {
          if (dot.classList.contains('w-6') || dot.classList.contains('bg-gold')) {
            activeIndex = idx;
          }
        });
        return { current: activeIndex, total: dots.length };
      });

      console.log(`  -> Stage state: ${stageState.current + 1}/${stageState.total || 1}`);

      // If there are no animation steps, or we are sitting on the final dot
      if (stageState.total === 0 || stageState.current === stageState.total - 1) {
        slideFullyLoaded = true;
      } else {
        // Press ArrowRight to trigger the internal state change without breaking layout
        await page.keyboard.press('ArrowRight');
        
        // Wait for the animation frame to tick over and register the new classes
        await page.waitForTimeout(400);

        // Safety verification: Check if ArrowRight accidentally advanced the entire slide index early
        const currentActiveSlide = await page.evaluate(() => {
          let activeSlideIndex = 0;
          const buttons = document.querySelectorAll('button[aria-label^="Go to slide"]');
          buttons.forEach((btn, idx) => {
            // Adjust this if your active slide rail button uses a different signature class
            if (btn.classList.contains('bg-gold') || btn.getAttribute('aria-current') === 'true') {
              activeSlideIndex = idx;
            }
          });
          return activeSlideIndex;
        });

        // If the slide index jumped ahead out of turn, back up and break
        if (currentActiveSlide > i) {
          console.log(`  -> Detected premature slide jump. Falling back to snapshot layout.`);
          await page.keyboard.press('ArrowLeft');
          await page.waitForTimeout(200);
          slideFullyLoaded = true;
        }
      }
    }

    // Give it a final heartbeat for elements to finish fading up
    await page.waitForTimeout(400);

    // 3. Temporarily drop the navigation interface for a flawless snapshot
    const uiStyleHandle = await page.addStyleTag({
      content: `
        .fixed.inset-y-0.right-5, 
        .fixed.bottom-9.left-1/2, 
        .fixed.right-5.bottom-7 { 
          display: none !important; 
        }
      `
    });

    // Capture the layout canvas completely 1:1
    const pageBuffer = await page.pdf({
      width: '1280px',
      height: '720px',
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 }
    });
    
    pdfPages.push(pageBuffer);

    // Re-mount UI components so the dot arrays are read correctly on the next loop
    await uiStyleHandle.evaluate(el => el.remove());
  }

  await browser.close();

  console.log('Merging final states into presentation PDF...');
  const mergedPdf = await PDFDocument.create();
  
  for (const buffer of pdfPages) {
    const pdf = await PDFDocument.load(buffer);
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }

  const mergedPdfFile = await mergedPdf.save();
  fs.writeFileSync('presentation.pdf', mergedPdfFile);
  
  console.log(`Success! Saved ${totalSlides} completed slides to presentation.pdf`);
}

convertDeckToPdf().catch((err) => {
  console.error("--- ERROR RUNNING SCRIPT ---");
  console.error(err.stack || err);
});