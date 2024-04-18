(function(){
  // download button
  // try {
  //   let downloadBtn = document.getElementById('download');
  //   if (!downloadBtn) throw new Error("Download button not found");
  
  //   downloadBtn.addEventListener('click', (e) => {
  //     let textareas = document.querySelectorAll('.contents');
  //     if (!textareas.length) throw new Error("Textareas not found");
  
  //     let textFileContent = '';
  
  //     textareas.forEach((textarea, index) => {
  //       let memoNumber = index + 1;
  //       textFileContent += `/***** [tab: ${memoNumber}] *****/\n${textarea.value}\n\n`;
  //     });
  
  //     const textBlob = new Blob([textFileContent], { type: 'text/plain' });
  //     e.currentTarget.href = window.URL.createObjectURL(textBlob);
  //   });
  // } catch (error) {
  //   console.error(`An error occurred: ${error.message}`);
  // }
  window.addEventListener('DOMContentLoaded', (event) => {
    const scssEditor = CodeMirror.fromTextArea(document.getElementById("scss-input"), {
      lineNumbers: true,
      mode: "sass",
      theme: 'vscode-dark',
      indentUnit: 4,
      smartIndent: false,
      extraKeys: {
        "Shift-Cmd-X": "autocomplete"
      },
      matchBrackets: true,
      autoCloseBrackets: true
    });

    const cssEditor = CodeMirror.fromTextArea(document.getElementById("css-output"), {
      lineNumbers: true,
      mode: "css",
      theme: 'vscode-dark',
      readOnly: true
    });
  });
  const compileScss = () => {
      const scssInput = document.getElementById('scss-input').value;
      console.log(scssInput)
      Sass.compile(scssInput, { style: Sass.style.COMPACT }, function(result) {
          if (result.status === 0) {
              document.getElementById('css-output').value = result.text;
          } else {
              alert(`エラーが発生しました: ${result.line}行目`);
          }
      });
  }

  const compileButton = document.getElementById('compile-button');

  compileButton.addEventListener('click', compileScss);
  document.addEventListener('keydown', function(e) {
    // macOSだと e.metaKey が Command キーになってる、WindowsやLinuxだと e.ctrlKey かな
    if (e.metaKey && e.shiftKey && e.keyCode == 83) { // keyCode 83 は 'S' のことだ
      compileScss();
      e.preventDefault();
    }
  });
}())
  