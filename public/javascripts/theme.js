'use strict';

if(typeof $ === 'function'){

  $(function () {

    $('.title h1').on('click', function() {
      window.location = '/';
    });

    $('button.copy').on('click', function() {
      const entry = $('p.entry');
      copyToClipboard(entry.text());
    });

  });

  function copyToClipboard(element) {
    let tempItem = document.createElement('input');

    tempItem.setAttribute('type','text');
    tempItem.setAttribute('display','none');

    let content = element;
    if (element instanceof HTMLElement) {
      content = element.innerHTML;
    }

    tempItem.setAttribute('value',content);
    document.body.appendChild(tempItem);

    tempItem.select();
    document.execCommand('Copy');

    tempItem.parentElement.removeChild(tempItem);

    alert('Copied to clipboard');
  }

}