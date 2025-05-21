const fs = require('fs');
const path = require('path');
const mammoth = require('mammoth');
const puppeteer = require('puppeteer');

async function convertDocxToPdf(inputPath, outputPath) {
  try {
    const { value: htmlContent } = await mammoth.convertToHtml({ path: inputPath });
    const tempHtmlPath = path.join(__dirname, 'temp.html');
    fs.writeFileSync(tempHtmlPath, htmlContent);

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

    await page.pdf({
      path: outputPath,
      format: 'A4',
      printBackground: true
    });

    await browser.close();
    fs.unlinkSync(tempHtmlPath); 

    console.log('PDF created at:', outputPath);
  } catch (error) {
    console.error('Error converting DOCX to PDF:', error);
  }
}

const docxPath = './sample.docx';
const pdfPath = './output.pdf';
convertDocxToPdf(docxPath, pdfPath);
