const DOM = {
    anchorTags: document.getElementsByClassName('userProfileLinks'),
}

for(let i = 0; i < DOM.anchorTags.length; i++) {
    DOM.anchorTags[i].setAttribute('href', 'dashboard/' + DOM.anchorTags[i].parentNode.getAttribute('id'));
}