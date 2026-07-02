import { chromium } from 'playwright';
import { PDFDocument } from 'pdf-lib';
import fs from 'fs';

async function convertDeckToPdf() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // 1920x1080 Presentation Aspect Ratio
  await page.setViewportSize({ width: 1920, height: 1080 });

  const deckUrl = 'http://localhost:5173'; 
  await page.goto(deckUrl, { waitUntil: 'networkidle' });

  console.log('Deck loaded. Preparing final animated state extraction...');

  // Inject CSS to hide all UI controls
  await page.addStyleTag({
    content: `
      .fixed.inset-y-0.right-5, 
      .fixed.bottom-9.left-1/2, 
      .fixed.right-5.bottom-7 { 
        display: none !important; 
      }
      body {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
    `
  });

  // Find all buttons in the progress rail to count total slides
  const slideButtons = await page.$$('button[aria-label^="Go to slide"]');
  const totalSlides = slideButtons.length;
  
  console.log(`Detected ${totalSlides} total slides.`);

  const pdfPages = [];

  for (let i = 0; i < totalSlides; i++) {
    console.log(`Processing slide ${i + 1}/${totalSlides}...`);
    
    // 1. Jump to the slide base state (sets slideIndex = i, stage = 0)
    await page.evaluate((index) => {
      const buttons = document.querySelectorAll('button[aria-label^="Go to slide"]');
      if (buttons[index]) buttons[index].click();
    }, i);

    // Short wait for slide transition to settle
    await page.waitForTimeout(400);

    // 2. Fast-forward through internal stages until the "Next" button would switch slides
    // We check if the next button is disabled OR if clicking next would change the active dot indicator
    let slideFullyLoaded = false;
    while (!slideFullyLoaded) {
      // Check if the "Next" button is disabled completely (handles the absolute last slide)
      const isNextDisabled = await page.$eval('button[aria-label="Previous"]', () => {
        // We evaluate if there are active stage dots or if we can fast-forward
        return false; 
      }).catch(() => false);

      // Check how many stage dots are present, and which one is active
      // Your code: i === stage ? 'w-6 bg-gold' : 'w-1.5 bg-line'
      // Check how many stage dots are present, and which one is active
      const activeStageInfo = await page.evaluate(() => {
        // Escaped the forward slash: .left-1\/2 becomes .left-1\\/2 in the string
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

      // If there are no internal animation stages, or we are on the very last dot indicator:
      if (activeStageInfo.total === 0 || activeStageInfo.current === activeStageInfo.total - 1) {
        slideFullyLoaded = true;
      } else {
        // Click next to advance the internal animation stage
        // Use a selector target that bypasses the print hidden state
        await page.evaluate(() => {
          const nextBtn = document.querySelector('button[aria-label="Next"]');
          if (nextBtn) nextBtn.click();
        });
        // Tiny wait for the layout content to populate/fade in
        await page.waitForTimeout(200);
      }
    }

    // Give it a tiny moment to complete any last fade CSS transition
    await page.waitForTimeout(300);

    // 3. Take a snapshot now that the final state of the content is completely loaded
    const pageBuffer = await page.pdf({
      width: '1920px',
      height: '1080px',
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 }
    });
    
    pdfPages.push(pageBuffer);
  }

  await browser.close();

  // Merge the clean final-state pages
  console.log('Merging final states into presentation PDF...');
  const { PDFDocument: PDFDoc } = await import('pdf-lib');
  const mergedPdf = await PDFDoc.create();
  
  for (const buffer of pdfPages) {
    const pdf = await PDFDoc.load(buffer);
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