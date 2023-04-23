function loadPDF() {
  // Get the selected file from the file input element
  var file = document.getElementById("fileInput").files[0];

  // Create a new instance of the FileReader object
  var reader = new FileReader();

  // Define a callback function to be called when the file is loaded
  reader.onload = function(e) {
    var typedarray = new Uint8Array(this.result);

    // Load the PDF file using pdf.js
    pdfjsLib.getDocument(typedarray).promise.then(function(pdf) {

      // Get the number of pages in the PDF file
      var numPages = pdf.numPages;

      // Extract text from each page in the PDF file
      for (var i = 1; i <= numPages; i++) {
        pdf.getPage(i).then(function(page) {
          page.getTextContent().then(function(textContent) {
            var text = "";
            for (var j = 0; j < textContent.items.length; j++) {
              text += textContent.items[j].str + " ";
            }
        
            // Create a new paragraph element containing the extracted text
            var para = document.createElement("p");
            var node = document.createTextNode(text);
            para.appendChild(node);
            para.classList.add("hidden");

            // Append the paragraph element to the PDF container div
            var pdfContainer = document.getElementById("pdfContainer");
            pdfContainer.appendChild(para);
            Export2Word("pdfContainer",'ConvertedPDF')
          });
        });
      }
    });
  };
  reader.readAsArrayBuffer(file);
}

function Export2Word(element, filename = ''){
  var preHtml = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Export HTML To Doc</title></head><body>";
  var postHtml = "</body></html>";
  var html = preHtml+document.getElementById(element).innerHTML+postHtml;

  var blob = new Blob(['\ufeff', html], {
      type: 'application/msword'
  });
  
  // Specify link url
  var url = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(html);
  
  // Specify file name
  filename = filename?filename+'.doc':'document.doc';
  
  // Create download link element
  var downloadLink = document.createElement("a");

  document.body.appendChild(downloadLink);
  
  if(navigator.msSaveOrOpenBlob ){
      navigator.msSaveOrOpenBlob(blob, filename);
  }else{
      // Create a link to the file
      downloadLink.href = url;
      
      // Setting the file name
      downloadLink.download = filename;
      
      //triggering the function
      downloadLink.click();
  }
  
  document.body.removeChild(downloadLink);
}