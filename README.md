# Sanfoundry-To-PDF

Sanfoundry-To-PDF is a Chrome extension **in development** that scrapes multiple-choice questions (MCQs) from sanfoundry.com and converts them into a PDF file.

## Features

-   Scrape MCQs from sanfoundry.com
-   Format scraped data
-   Convert formatted data into a PDF file

## Files

-   [popup.js](./popup.js): Contains the main functionality of the extension, including scraping, formatting, and PDF creation.
-   [manifest.json](./manifest.json): The manifest file for the Chrome extension, which provides important metadata for the extension.
-   [popup.html](./popup.html): The HTML file for the popup interface of the extension.

## Usage

1. Click on the extension icon in the Chrome toolbar.
2. Click on the "Convert the MCQ to PDF" button when you are on a sanfoundry.com page with MCQs.

<div align="center">

![Screenshot](https://github.com/AhmedMohamedAbdelaty/Sanfoundry-To-PDF/assets/73834838/fe980b02-1b1d-48c3-8791-1d6b74077e91)

</div>

### Example Output

<div align="center">

https://github.com/AhmedMohamedAbdelaty/Sanfoundry-To-PDF/assets/73834838/4e263fbc-2922-44e3-828f-18fec84a7930

</div>

## Installation

Follow these steps to install the extension:

1. Clone the repository to your local machine using `git clone https://github.com/AhmedMohamedAbdelaty/Sanfoundry-To-PDF` or download the repository as a ZIP file and extract it.
2. Open Google Chrome or a Chromium-based browser and navigate to `chrome://extensions/`.
3. Enable Developer Mode by clicking the toggle switch at the top right.
4. Click the "Load unpacked" button and select the directory where you cloned the repository.
5. The extension should now be installed and visible in your Chrome toolbar.
6. Pin the extension to your Chrome toolbar for easy access.

Please note that since this extension is still in development, it may not function as expected. We appreciate your patience and contributions.

## Development Status

### To-Do List

- [ ] Add support for different question formats.
- [ ] Implement a user-friendly interface for the popup.
- [ ] Add an option to customize the output PDF.

### Known Bugs

- The extension struggles with choices presented as code blocks. Fixes are underway. Contributions are welcome.

Here is a screenshot of the issue:
<div align="center">

![Screenshot from 2024-03-16 16-38-12](https://github.com/AhmedMohamedAbdelaty/Sanfoundry-To-PDF/assets/73834838/b8b533c8-ebd6-4ec6-a12d-13a87f781cf3)
</div>

## Contribution Guide

We welcome contributions from the community. Here are the steps to contribute:

1. Fork the repository.
2. Create a new branch for your changes.
3. Make your changes in your branch.
4. Submit a pull request with your changes.
5. Make sure your pull request describes what you changed, why you changed it, and how you tested these changes.

Please note that this project is still in development, and we appreciate your patience and contributions.

## Disclaimer

This extension is not affiliated with or endorsed by sanfoundry.com. It is developed for educational purposes only. Please use responsibly.
