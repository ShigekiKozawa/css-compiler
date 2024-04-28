(function(){
  // SASS / SCSS 出力形式
  const NESTED = Sass.style.nested;
  const EXPANDED = Sass.style.expanded;
  const COMPACT = Sass.style.compact;
  const COMPRESSED = Sass.style.compressed;

  // エディタ
  const sassEditor = CodeMirror.fromTextArea(document.getElementById("js-sass-input"), {
    lineNumbers: true,
    mode: "sass",
    theme: 'vscode-dark',
    indentUnit: 2,
    tabSize: 2,
    smartIndent: false,
    matchBrackets: true,
    autoCloseBrackets: true
  });
  const cssEditor = CodeMirror.fromTextArea(document.getElementById("js-css-output"), {
    lineNumbers: true,
    mode: "css",
    theme: 'vscode-dark',
    readOnly: true
  });

  // コンパイル
  const compileSass = () => {
    const styleSelect = document.getElementById('js-style-select');
    const sassInput = sassEditor.getValue();
    const selectedStyle = styleSelect.value;

    let sassOutputStyle;
    switch (selectedStyle) {
      case 'nested':
        sassOutputStyle = NESTED;
        break;
      case 'expanded':
        sassOutputStyle = EXPANDED;
        break;
      case 'compact':
        sassOutputStyle = COMPACT;
        break;
      case 'compressed':
        sassOutputStyle = COMPRESSED;
        break;
      default:
        sassOutputStyle = COMPRESSED;
    }

    Sass.compile(sassInput, { style: sassOutputStyle }, function(result) {
      if (result.status === 0) {
        if(!result.text) {
          alert(`Not Value`);
          return false;
        }
        cssEditor.setValue(result.text);
      } else {
        alert(`Code Error: ${result.line} line`);
      }
    });
  }

  // コンパイルボタン
  const clickCompile = () => {
    const compileButton = document.getElementById('js-compile-button');

    compileButton.addEventListener('click', compileSass);
  }

  // ショートカットキー
  const shortcutCompile = () => {
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
        console.error(`Error: ${err}`);
      }
    });
  }

  // ダウンロードボタン
  const downloadFunc = () => {
    const downloadButton = document.getElementById('js-download');

    downloadButton.addEventListener('click', function(e) {
      const cssContent = "@charset \"UTF-8\";\n" + cssEditor.getValue();
      const blob = new Blob([cssContent], {type: 'text/css'});
      const url = window.URL.createObjectURL(blob);

      this.href = url;
  
      setTimeout(function() {
        window.URL.revokeObjectURL(url);
      }, 100);
    });
  }

  // コードの保存
  const saveCode = () => {
    const sassValue = sassEditor.getValue();
    const cssValue = cssEditor.getValue();

    chrome.storage.local.set({
      'savedSass': sassValue,
      'savedCss': cssValue
    });
  }

  // 保存されたコードの読み込み
  const loadCode = () => {
    chrome.storage.local.get(['savedSass', 'savedCss'], function(data) {
      if (data.savedSass) {
        sassEditor.setValue(data.savedSass);
      }
      if (data.savedCss) {
        cssEditor.setValue(data.savedCss);
      }
    });
  }

  // コードの削除
  const clearCode = () => {
    const clearButton = document.getElementById('js-clear-button');

    clearButton.addEventListener('click', function() {
      sassEditor.setValue('');
      cssEditor.setValue('');

      chrome.storage.local.set({'savedSass': '', 'savedCss': ''});
    });
  }

  window.addEventListener('DOMContentLoaded', () => {
    sassEditor.on('change', saveCode);
    cssEditor.on('change', saveCode);

    clickCompile();
    shortcutCompile();
    clearCode();
    loadCode();
    uploadScss();
    copyFunc();
    downloadFunc();
  });
}())