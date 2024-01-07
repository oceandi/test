document.addEventListener('DOMContentLoaded', function() {
  const fileInput = document.querySelector('.assistant-file-upload input[type="file"]');
  const uploadBtn = document.querySelector('.assistant-file-upload');

  uploadBtn.addEventListener('click', function() {
      fileInput.click();
  });

  fileInput.addEventListener('change', function() {
      // Dosya(lar) seçildiğinde burada işleme koyabilirsiniz
      // Örneğin, dosyayı bir form ile sunucuya yüklemek için veya önizleme yapmak için
  });

  // Function for copying code to clipboard
  function copyToClipboard(code) {
      if (navigator.clipboard) { // Modern approach
          navigator.clipboard.writeText(code).then(() => {
              console.log('Code copied to clipboard!');
          }).catch(err => {
              console.error('Failed to copy to clipboard:', err);
          });
      } else { // Fallback for older browsers
          const textArea = document.createElement('textarea');
          textArea.value = code;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
          console.log('Code copied to clipboard using fallback!');
      }
  }

  // Event listener for the 'copy code' buttons
  // Assuming each 'copy code' button has a class 'copy-code-button'
  const copyButtons = document.querySelectorAll('.copy-code-button');
  copyButtons.forEach(btn => {
      btn.addEventListener('click', function() {
          // The code to copy is present in the next sibling element (pre > code) of the button's parent
          const codeToCopy = btn.parentNode.nextElementSibling.querySelector('code').innerText;
          copyToClipboard(codeToCopy);
      });
  });

  // Existing event listeners and functionality from uploaded_button_js_content...
});
