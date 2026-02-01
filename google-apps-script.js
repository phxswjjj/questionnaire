function doGet(e) {
  return generateJSONResponse(getQuestions());
}

function doPost(e) {
  // Check if postData exists (it might be empty depending on how content-type is handled)
  // For 'text/plain' or 'application/json' sent as raw body
  try {
    var data;
    if (e.postData && e.postData.contents) {
       data = JSON.parse(e.postData.contents);
    } else if (e.parameter) {
       // Fallback for form-encoded, though we expect JSON
       data = e.parameter;
    }
    
    saveResponse(data);
    return generateJSONResponse({status: "success", message: "Answer recorded"});
  } catch (error) {
    return generateJSONResponse({status: "error", message: error.toString()});
  }
}

function generateJSONResponse(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

function getQuestions() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Questions");
  if (!sheet) {
    return []; 
    // Or create it? Better to just return empty or error.
  }
  
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var questions = [];
  
  // Assuming Row 1 is headers: [id, type, title, options]
  // options can be comma separated
  
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    questions.push({
      id: row[0],
      type: row[1], // e.g., 'text' or 'radio'
      title: row[2],
      options: row[3] ? row[3].toString().split(',') : []
    });
  }
  
  // Randomize questions? The user asked for random from the sheet.
  // Implementation: Shuffle array
  shuffleArray(questions);
  
  return questions;
}

function saveResponse(data) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Responses");
  if (!sheet) {
    sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet("Responses");
    // Add default headers if new
    sheet.appendRow(["Timestamp", "Account", "AvatarUrl", "AnswersJSON"]);
  }
  
  // data expected: { account: "name", avatar: "url", answers: [...] }
  var timestamp = new Date();
  var account = data.account || "Anonymous";
  var avatar = data.avatar || "";
  var answers = JSON.stringify(data.answers || []);
  
  sheet.appendRow([timestamp, account, avatar, answers]);
}

function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

function setup() {
  // Helper to create the initial sheets
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var qSheet = ss.getSheetByName("Questions");
  if (!qSheet) {
    qSheet = ss.insertSheet("Questions");
    qSheet.appendRow(["id", "type", "title", "options"]);
    qSheet.appendRow(["q1", "radio", "今天心情如何？", "好,普通,差"]);
    qSheet.appendRow(["q2", "text", "想對系統說什麼？", ""]);
    qSheet.appendRow(["q3", "radio", "喜歡 Pixel Art 嗎？", "超愛,還好,不喜歡"]);
  }
  
  var rSheet = ss.getSheetByName("Responses");
  if (!rSheet) {
    rSheet = ss.insertSheet("Responses");
    rSheet.appendRow(["Timestamp", "Account", "AvatarUrl", "AnswersJSON"]);
  }
}
