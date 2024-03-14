# Sanfoundry-To-PDF

Sanfoundry-To-PDF is a Chrome extension **in development** that scrapes multiple-choice questions (MCQs) from sanfoundry.com and converts them into a PDF file.

## Features

-   Scrape MCQs from sanfoundry.com
-   Format scraped data
-   Convert formatted data into a PDF file

## Files

-   [popup.js](#file:popup.js-context): Contains the main functionality of the extension, including scraping, formatting, and PDF creation.
-   [manifest.json](#file:manifest.json-context): The manifest file for the Chrome extension, which provides important metadata for the extension.
-   [popup.html](#file:popup.html-context): The HTML file for the popup interface of the extension.

## Usage

1. Click on the extension icon in the Chrome toolbar.
2. Click on the "Convert the MCQ to PDF" button when you are on a sanfoundry.com page with MCQs.

## Installation

Follow these steps to install the extension:

1. Clone the repository to your local machine using `git clone <repository-url>` or download the repository as a ZIP file and extract it.
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

- The extension does not function correctly when a question or answer contains a code block. We are currently working on a fix for this issue. If you have any suggestions or solutions, please feel free to contribute.

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
