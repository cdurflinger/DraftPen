//DOM selectors
const DOM = {
    userBlogContainer: document.querySelector('.user__blog__container'),
    createBlogButton: document.getElementById('create__blog__button'),
    closeEditContainerButton: document.getElementById('close__edit__container'),
    editPostContainer: document.getElementById('edit__post__container'),
    editPostButtons: document.getElementsByClassName('edit__post__button'),
    deletePostButtons: document.getElementsByClassName('delete__post__button'),
    editBlogTitle: document.getElementById('edit__blog__title'),
    editBlogContent: document.getElementById('edit__blog__content'),
    editBlogSubmitButton: document.getElementById('edit__blog__submit__button'),
}

//nav
const navContainer = document.getElementById('nav-container');
navContainer.addEventListener('click', () => {
    navContainer.classList.toggle('menu__morph');
    document.getElementsByTagName('nav')[0].classList.toggle('nav-hide');
});

//event listeners

//adds an event listener to the edit buttons AND adds text values for the blog title and blog content
for(let i = 0; i < DOM.editPostButtons.length; i++) {
    DOM.editPostButtons[i].addEventListener('click', (e) => {
        let parentId = e.target.parentNode.getAttribute('id');
        DOM.editBlogTitle.value = document.getElementById(`t${parentId}`).textContent;
        DOM.editBlogContent.textContent = document.getElementById(`b${parentId}`).textContent;
        displayEditDiv(parentId);
    });
};

DOM.createBlogButton.addEventListener('click', () => {
    createBlogPost();
});

for(let i = 0; i < DOM.deletePostButtons.length; i++) {
    DOM.deletePostButtons[i].addEventListener('click', (e) => {
        deleteBlogPost(e);
    });
};

DOM.editBlogSubmitButton.addEventListener('click', (e) => {
    modifyBlogPost(e);
});

//end event listeners



const displayEditDiv = (parentId) => {
    DOM.editPostContainer.classList.toggle('edit__post__container__hide');
    //fix this in the future, it remove the DOM selector from the DIV but still works on consecutive modify clicks
    DOM.editPostContainer.setAttribute('id', "e" + parentId);

    //add event listener for close button
    DOM.closeEditContainerButton.addEventListener('click', () => {
        DOM.editPostContainer.classList.add('edit__post__container__hide');
    });
}

const removeDeletedBlogDiv = (id) => {
    let element = document.getElementById(id);
    element.parentNode.removeChild(element);
};

//helper function

const createDomElement = (element) => {
    return document.createElement(element);
}

const appendNewBlogArticle = (data) => {
    let article = createDomElement('article');
    let editButton = createDomElement('button');
    let deleteButton = createDomElement('button');
    let title = createDomElement('p');
    let date = createDomElement('p');
    let content = createDomElement('p');
    let titleSpan = createDomElement('span');
    let contentSpan = createDomElement('span');
    article.setAttribute('class', 'article__container');
    article.setAttribute('id', data.id);
    editButton.setAttribute('class', 'post__button');
    editButton.appendChild(document.createTextNode('Edit Blog Post'));
    editButton.addEventListener('click', (e) => {
            let parentId = e.target.parentNode.getAttribute('id');
            DOM.editBlogTitle.value = document.getElementById(`t${parentId}`).textContent;
            DOM.editBlogContent.textContent = document.getElementById(`b${parentId}`).textContent;
            displayEditDiv(parentId);
        });
    deleteButton.setAttribute('class', 'post__button');
    deleteButton.appendChild(document.createTextNode('Delete Blog Post'));
    deleteButton.addEventListener('click', (e) => {
        deleteBlogPost(e);
    });
    title.appendChild(document.createTextNode('Title: '));
    titleSpan.setAttribute('id', `t${data.id}`);
    titleSpan.appendChild(document.createTextNode(`${data.title}`));
    title.appendChild(titleSpan);
    date.appendChild(document.createTextNode(`Published on: ${data.date}`));
    content.appendChild(document.createTextNode('Blog Post: '));
    contentSpan.setAttribute('id', `b${data.id}`);
    contentSpan.appendChild(document.createTextNode(`${data.content}`));
    content.appendChild(contentSpan);
    article.appendChild(editButton);
    article.appendChild(deleteButton);
    article.appendChild(title);
    article.appendChild(date);
    article.appendChild(content);
    DOM.userBlogContainer.appendChild(article);
};


//Ajax functions

const createBlogPost = () => {
    const page = '/dashboard/publish';
    const xmlhttp = new XMLHttpRequest();
    let data = {
        title: document.getElementById('new__blog__title').value,
        blogpost: document.getElementById('new__blog__content').value,
    }
    xmlhttp.onreadystatechange = () => {
        if(xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            let json = JSON.parse(xmlhttp.responseText);
            appendNewBlogArticle(json);
            document.getElementById('new__blog__title').value = "";
            document.getElementById('new__blog__content').value = "";
        };
    };
    xmlhttp.open('POST', page, true);
    xmlhttp.setRequestHeader('Content-Type', 'application/json');
    xmlhttp.send(JSON.stringify(data));
};

const deleteBlogPost = (e) => {
    const target = e.target;
    const id = target.parentNode.getAttribute('id');
    const page = '/dashboard/blog/' + id;
    const xmlhttp = new XMLHttpRequest();
    if(confirm("Are you sure you want to delete this?") === true) {
        xmlhttp.onreadystatechange = () => {
            if(xmlhttp.readyState == 4 && xmlhttp.status == 200) {

            };
        };
        xmlhttp.open('DELETE', page, true);
        xmlhttp.send();
        removeDeletedBlogDiv(id);
    };
};

const modifyBlogPost = (e) => {
    const target = e.target;
    const id = target.parentNode.getAttribute('id').slice(1);
    const page = '/dashboard/blog/' + id;
    let data = {
        id: id,
        title: DOM.editBlogTitle.value,
        content: DOM.editBlogContent.value,
    }
    const xmlhttp = new XMLHttpRequest();
    if(confirm("Are you sure that you want to modify this blog post?") === true) {
        xmlhttp.onreadystatechange = () => {
            if(xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                let json = JSON.parse(xmlhttp.responseText);
                DOM.editPostContainer.removeAttribute('id');
                document.getElementById(`t${json.id}`).textContent = json.title;
                document.getElementById(`b${json.id}`).textContent = json.content;
            };
        };
        xmlhttp.open('PUT', page, true);
        xmlhttp.setRequestHeader('Content-Type', 'application/json');
        xmlhttp.send(JSON.stringify(data));
        DOM.editPostContainer.classList.toggle('edit__post__container__hide');
    };
}; 