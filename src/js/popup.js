(function(){
  // エディタ
  const sassEditor = CodeMirror.fromTextArea(document.getElementById("sass-input"), {
    lineNumbers: true,
    mode: "sass",
    theme: 'vscode-dark',
    indentUnit: 2,
    tabSize: 2,
    smartIndent: false,
    extraKeys: {
      "Ctrl-Cmd-Z": function(cm) {
        cm.showHint();
      }
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
  // コンパイル
  const compileSass = () => {
    const sassInput = sassEditor.getValue();

    Sass.compile(sassInput, { style: Sass.style.compressed }, function(result) {
      if (result.status === 0) {
        cssEditor.setValue(result.text);
      } else {
        alert(`エラーが発生しました: ${result.line}行目`);
      }
    });
  }
  // ショートカットキー
  const shortcutKey = () => {
    document.addEventListener('keydown', function(e) {
      if (e.ctrlKey && e.metaKey && e.key.toUpperCase() === 'Z') {
        compileSass();
        e.preventDefault();
      }
    });
  }
  // SASS / SCSS / CSSファイルの読み込み
  const uploadScss = () => {
    const uploadInput = document.getElementById('js-upload-input');
    const uploadButton = document.getElementById('js-upload-button');

    uploadButton.addEventListener('click', function() {
      uploadInput.click();
    });
    uploadInput.addEventListener('change', function(e) {
      const file = e.target.files[0];
      if (!file) {
        return;
      }
  
      const reader = new FileReader();

      reader.onload = (e) => {
        sassEditor.setValue(e.target.result);
      }
      reader.readAsText(file);
    });
  }
  // コピーボタン
  const copyFunc = () => {
    const copyButton = document.getElementById('js-copy');

    copyButton.addEventListener('click', async function() {
      const cssContent = cssEditor.getValue();

      try {
        if(cssContent.length > 0) {
          await navigator.clipboard.writeText(cssContent);

          copyButton.classList.add('is-copied');
          setTimeout(() => {
            copyButton.classList.remove('is-copied');
          }, 1500);
        } else {
          copyButton.classList.add('is-not-copied');
          setTimeout(() => {
            copyButton.classList.remove('is-not-copied');
          }, 1500);
        }
      } catch (err) {
        console.error(`エラーが発生しました： ${err}`);
      }
    });
  }
  // ダウンロードボタン
  const downloadFunc = () => {
    const downloadButton = document.getElementById('js-download');

    downloadButton.addEventListener('click', function(e) {
      const cssContent = cssEditor.getValue();
      const blob = new Blob([cssContent], {type: 'text/css'});
      const url = window.URL.createObjectURL(blob);

      this.href = url;
  
      setTimeout(function() {
        window.URL.revokeObjectURL(url);
      }, 100);
    });
  }
  window.addEventListener('DOMContentLoaded', (e) => {
    const compileButton = document.getElementById('compile-button');

    compileButton.addEventListener('click', compileSass);
    shortcutKey();
    uploadScss();
    copyFunc();
    downloadFunc();
  });
}())