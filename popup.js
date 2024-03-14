let btn = document.getElementById("btn");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	let { questions, title } = message;
	for (let i = 0; i < questions.length; i++) {
		let question = questions[i];
		question.question = question.question.replace("View Answer", "");
		question.question = i + 1 + ". " + question.question;
		question.answer = "Answer: " + question.answer;
	}
	format(title, questions);
});

btn.addEventListener("click", async () => {
	let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
	if (tab.url.match(/sanfoundry.com/)) {
		chrome.scripting.executeScript({
			target: { tabId: tab.id },
			func: scrapeData,
		});
	} else {
		alert("This extension only works on sanfoundry.com");
	}
});
function scrapeData() {
	let title = document.querySelector("h1.entry-title");
	let content = document.querySelector("div.entry-content");
	let questions = [];
	for (let i = 0; i < content.children.length; i++) {
		let child = content.children[i];
		if (child.tagName === "P") {
			if (child.innerText.match(/^\d+\./)) {
				// get the question
				let question = child.innerText.replace(/^\d+\.\s*/, "");
				// get the answer and explanation
				let answer = content.children[i + 1].innerText;
				let questionObj = {
					question,
					answer: answer.replace("Answer: ", ""),
					explanation: answer.split("Explanation: ")[1],
				};
				// push the object to the questions array
				questions.push(questionObj);
			}
		}
	}
	chrome.runtime.sendMessage({ questions, title: title.textContent });
}

function format(title, questions) {
	const formattedQuestions = [];

	questions.forEach((question, index) => {
		const text = question.question.split("\n")[0].trim();
		const options = question.question.split("\n").slice(1);

		const formattedOptions = options.map((option) => {
			const letter = option.slice(0, 1); // Extracting option letter
			const text = option.slice(2).trim(); // Extracting option text
			return { letter, text };
		});

		// Extracting answer and explanation
		const answer = question.answer
			.split("\n")[0]
			.replace("Answer: ", "")
			.trim();
		const explanation = question.answer
			.split("\n")
			.slice(1)
			.join("\n")
			.replace("Explanation: ", "")
			.trim();

		const formattedQuestion = {
			id: index + 1, // Question number
			text, // Question text
			options: formattedOptions, // Formatted options
			answer, // Answer
			explanation, // Explanation
		};
		formattedQuestions.push(formattedQuestion);
	});
	createPDF(title, formattedQuestions);
}

function createPDF(title, questions) {
	let doc = new jsPDF("p", "mm", [250, 360]);
	let x = 10,
		y = 10,
		lineHeight = 7,
		fontStyle = ["bold", "normal"],
		fontSize = 12;
	doc.setFontSize(fontSize);
	doc.setFont("Times", fontStyle[0]);
	doc.setTextColor(0, 0, 0);
	let text = title;
	let textWidth =
		(doc.getStringUnitWidth(title) * fontSize) / doc.internal.scaleFactor;
	x = (doc.internal.pageSize.width - textWidth) / 2;
	let textLines = doc.splitTextToSize(text, 250);
	textLines.forEach((line) => {
		doc.text(line, x, y);
		y += lineHeight;
	});
	y += lineHeight;
	for (let i = 0; i < questions.length; i++) {
		doc.setFont("Times", fontStyle[0]);
		let question = questions[i];
		let remainingHeight = doc.internal.pageSize.height - y;
		if (
			checkQuestionHeight(
				doc,
				y,
				lineHeight,
				remainingHeight,
				question,
				fontSize
			) == false
		) {
			doc.addPage();
			y = 10;
			remainingHeight = doc.internal.pageSize.height - y;
		}
		let options = question.options;
		let questionText = question.text;
		let answer = question.answer;
		let explanation = question.explanation;
		let textLines = doc.splitTextToSize(questionText, 230);
		textLines.forEach((line) => {
			doc.text(line, 10, y);
			y += lineHeight;
		});
		for (let i = 0; i < options.length - 1; i++) {
			doc.setFont("Times", fontStyle[1]);
			let option = options[i];
			let letter = option.letter;
			let text = option.text;
			let textLines = doc.splitTextToSize(letter + ". " + text, 230);
			textLines.forEach((line) => {
				if (letter === answer) {
					doc.setTextColor(0, 128, 0); // Set text color to green
				} else {
					doc.setTextColor(0, 0, 0);
				}
				doc.text(line, 10, y);
				y += lineHeight;
			});
		}
		doc.setTextColor(0, 0, 0);
		let exp = "Explanation: " + explanation;
		let expText = doc.splitTextToSize(exp, 230);
		expText.forEach((line) => {
			doc.text(line, 10, y);
			y += lineHeight;
		});
		y += lineHeight;
	}
	doc.save(`${title}.pdf`);
}

function checkQuestionHeight(
	doc,
	y,
	lineHeight,
	remainingHeight,
	question,
	fontSize
) {
	let options = question.options;
	let questionText = question.text;
	let answer = question.answer;
	let explanation = question.explanation;
	let textLines = doc.splitTextToSize(questionText, 230);
	textLines.forEach((line) => {
		// doc.text(line, 10, y);
		y += lineHeight;
	});
	for (let i = 0; i < options.length - 1; i++) {
		let option = options[i];
		let letter = option.letter;
		let text = option.text;
		let textLines = doc.splitTextToSize(letter + ". " + text, 230);
		textLines.forEach((line) => {
			// doc.text(line, 10, y);
			y += lineHeight;
		});
	}
	let exp = "Explanation: " + explanation;
	let expText = doc.splitTextToSize(exp, 230);
	expText.forEach((line) => {
		// doc.text(line, 10, y);
		y += lineHeight;
	});
	if (y > remainingHeight + 300) {
		return false;
	}
	return true;
}
