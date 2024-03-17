let btn = document.getElementById("btn");
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  let title = message.title;
  let questions = message.questions;
  createPDF(title, questions);
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
  function formatChoices(str) {
    // Splitting it to array contains choices and answers
    let choices = str.split(/([a-z]\))/i);

    // removing the new lines between the answer.
    choices = choices.map((choice) => {
      choice = choice.trim();
      return choice;
    });
    let modifiedChoices = {};
    for (let i = 1; i < choices.length; i += 2) {
      modifiedChoices[choices[i]] = choices[i + 1] + "\n";
    }
    return modifiedChoices;
  }
  var i = 0;
  let isAD = function (element) {
    if (
      element.classList.contains("google-auto-placed") ||
      element.classList.contains("ap_container") ||
      element.classList.contains("google-auto-placed ap_container") ||
      element.classList.contains("sf-mobile-ads") ||
      element.classList.contains("sf-desktop-ads")
    ) {
      return true;
    }
    return false;
  };
  let QuestionWithCode = function (child, content) {
    let questionText = child.innerText;
    let codeText = "";
    let choices = "";
    let answer = "";
    let explanation = "";
    let ExplanationCode = "";
    i++;
    // get the code
    while (isAD(content.children[i])) {
      i++;
    }
    // get the pre tag
    let pre = content.children[i];
    // get the code formatted
    codeText = pre.innerText;
    // get the choices
    while (content.children[i].tagName !== "P") {
      i++;
    }
    let x = "";
    if (
      content.children[i].tagName === "P" ||
      content.children[i].tagName === "PRE"
    ) {
      while (
        content.children[i].tagName === "P" ||
        content.children[i].tagName === "PRE"
      ) {
        x += content.children[i].innerText + "\n";
        i++;
      }
    }
    choices = x.replace("View Answer", "");
    choices = choices.trim();
    console.log(formatChoices(choices));
    // choices = formatChoices(choices);
    // get the answer
    // while it is an AD
    while (isAD(content.children[i])) {
      i++;
    }
    let answerDiv = content.children[i];
    answer = answerDiv.innerText;
    // remove "Answer: " from the string
    // remove "Explanation: " from the string
    answer = answer.replace("Answer: ", "");
    answer = answer.replace("Explanation: ", "");
    let newAnswer = answer.split("\n");
    answer = newAnswer[0];
    // trim the answer
    answer = answer.trim();
    explanation = newAnswer[1];
    let preTag = answerDiv.querySelector("pre");
    if (preTag) {
      ExplanationCode = preTag.innerText;
      explanation += "\n" + ExplanationCode;
    }
    return {
      questionText,
      codeText,
      choices,
      answer,
      explanation,
    };
  };
  let Question = function (child, content) {
    let questionText = child.innerText.replace("View Answer", "");
    let choices = questionText.split("\n").slice(1, -1).join("\n");
    let codeText = "";
    let answer = "";
    let explanation = "";
    let ExplanationCode = "";
    i++;
    questionText = questionText.split("\n")[0];
    while (isAD(content.children[i])) {
      i++;
    }
    let answerDiv = content.children[i];
    answer = answerDiv.innerText;
    answer = answer.replace("Answer: ", "");
    answer = answer.replace("Explanation: ", "");
    let newAnswer = answer.split("\n");
    answer = newAnswer[0];
    // trim the answer
    answer = answer.trim();
    explanation = newAnswer[1];
    let preTag = answerDiv.querySelector("pre");
    if (preTag) {
      ExplanationCode = preTag.innerText;
      explanation += "\n" + ExplanationCode;
    }
    return {
      questionText,
      codeText,
      choices,
      answer,
      explanation,
    };
  };
  while (i < content.children.length) {
    let child = content.children[i];
    if (child.tagName === "P" && child.innerText.match(/^\d+\./)) {
      if (child.children.length > 0) {
        let question = Question(child, content, i);
        questions.push(question);
      } else {
        let question = QuestionWithCode(child, content, i);
        questions.push(question);
      }
    }
    i++;
  }
  // print title
  console.log(title.innerText);
  // print questions
  for (let i = 0; i < questions.length; i++) {
    console.log(questions[i]);
  }
  chrome.runtime.sendMessage({ title: title.innerText, questions });
}

function format(title, questions) {}

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
    let questionText = question.questionText;
    let codeText = question.codeText;
    let choices = question.choices;
    let answer = question.answer;
    let explanation = question.explanation;
    doc.setFontSize(fontSize);
    doc.setFont("Times", fontStyle[0]);
    doc.setTextColor(0, 0, 0);
    let x = 10;
    let text = questionText;
    let textWidth =
      (doc.getStringUnitWidth(text) * fontSize) / doc.internal.scaleFactor;
    let textLines = doc.splitTextToSize(text, 250);
    textLines.forEach((line) => {
      doc.text(line, x, y);
      y += lineHeight;
    });
    if (codeText !== "") {
      let codeLines = doc.splitTextToSize(codeText, 230);
      codeLines.forEach((line) => {
        doc.setFont("Courier", fontStyle[1]);
        doc.text(line, x, y);
        y += lineHeight;
      });
    }
    let choicesLines = doc.splitTextToSize(choices, 230);
    for (let i = 0; i < choicesLines.length; i++) {
      doc.setFont("Times", fontStyle[1]);
      if (choicesLines[i].charAt(0) === answer) {
        doc.setFont("Times", fontStyle[0]);
        doc.setTextColor(0, 0, 128);
      }
      doc.text(choicesLines[i], x + 4, y);
      doc.setFont("Times", fontStyle[1]);
      doc.setTextColor(0, 0, 0);
      y += lineHeight;
    }
    doc.setFont("Times", fontStyle[1]);
    doc.text("Explanation:", x, y);
    y += lineHeight;
    let explanationLines = doc.splitTextToSize(explanation, 230);
    explanationLines.forEach((line) => {
      doc.text(line, x, y);
      y += lineHeight;
    });
    y += lineHeight;
    if (y > doc.internal.pageSize.height + 300) {
      doc.addPage();
      y = 10;
    }
  }

  doc.save(`${title}.pdf`);
}

function checkQuestionHeight(doc, y, lineHeight, remainingHeight, question) {
  let questionText = question.questionText;
  let codeText = question.codeText;
  let choices = question.choices;
  let answer = question.answer;
  let explanation = question.explanation;
  let fontSize = 12;
  let fontStyle = ["bold", "normal"];
  let text = questionText;
  let textWidth =
    (doc.getStringUnitWidth(text) * fontSize) / doc.internal.scaleFactor;
  if (remainingHeight - lineHeight * 5 < 0) {
    return false;
  }
  doc.setFontSize(fontSize);
  doc.setFont("Times", fontStyle[0]);
  doc.setTextColor(0, 0, 0);
  let x = 10;
  let textLines = doc.splitTextToSize(text, 250);
  textLines.forEach((line) => {
    // doc.text(line, x, y);
    y += lineHeight;
  });
  if (codeText !== "") {
    let codeLines = doc.splitTextToSize(codeText, 250);
    codeLines.forEach((line) => {
      doc.setFont("Courier", fontStyle[1]);
      // doc.text(line, x, y);
      y += lineHeight;
    });
  }
  let choicesLines = doc.splitTextToSize(choices, 250);
  choicesLines.forEach((line) => {
    doc.setFont("Times", fontStyle[1]);
    // doc.text(line, x, y);
    y += lineHeight;
  });
  let answerLines = doc.splitTextToSize(answer, 250);
  answerLines.forEach((line) => {
    doc.setFont("Times", fontStyle[0]);
    // doc.text(line, x, y);
    y += lineHeight;
  });
  let explanationLines = doc.splitTextToSize(explanation, 250);
  explanationLines.forEach((line) => {
    doc.setFont("Times", fontStyle[1]);
    // doc.text(line, x, y);
    y += lineHeight;
  });
  y += lineHeight;
  if (y > doc.internal.pageSize.height) {
    return false;
  }
  return true;
}

document.addEventListener("DOMContentLoaded", function () {
  var links = document.getElementsByTagName("a");
  for (var i = 0; i < links.length; i++) {
    (function () {
      var ln = links[i];
      var location = ln.href;
      ln.onclick = function () {
        chrome.tabs.create({ active: true, url: location });
      };
    })();
  }
});
