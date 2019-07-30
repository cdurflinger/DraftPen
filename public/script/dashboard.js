//DOM selectors
const DOM = {
    userBlogContainer: document.querySelector('.userBlogContainer'),
    createBlogButton: document.getElementById('createBlogButton'),
    editPostContainer: document.getElementById('editPostContainer'),
    editPostButtons: document.getElementsByClassName('editPostButton'),
    deletePostButtons: document.getElementsByClassName('deletePostButton'),
    editBlogTitle: document.getElementById('editBlogTitle'),
    editBlogContent: document.getElementById('editBlogContent'),
    editBlogSubmitButton: document.getElementById('editBlogSubmitButton'),
}



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
    DOM.editPostContainer.classList.toggle('editPostContainerHide');
    //fix this in the future, it remove the DOM selector from the DIV but still works on consecutive modify clicks
    DOM.editPostContainer.setAttribute('id', "e" + parentId);
}

const removeDeletedBlogDiv = (id) => {
    let element = document.getElementById(id);
    element.parentNode.removeChild(element);
};

//helper function

const createDomElement = (element) => {
    return document.createElement(element);
}

const appendNewBlogDiv = (data) => {
    let div = createDomElement('div');
    let editButton = createDomElement('button');
    let deleteButton = createDomElement('button');
    let title = createDomElement('p');
    let date = createDomElement('p');
    let content = createDomElement('p');
    let titleSpan = createDomElement('span');
    let contentSpan = createDomElement('span');
    div.setAttribute('class', 'blogContainer');
    div.setAttribute('id', data.id);
    editButton.setAttribute('class', 'editPostButton');
    editButton.appendChild(document.createTextNode('Edit Blog Post'));
    deleteButton.setAttribute('class', 'deletePostButton');
    deleteButton.appendChild(document.createTextNode('Delete Blog Post'));
    title.appendChild(document.createTextNode('Title: '));
    date.appendChild(document.createTextNode(`Published on: ${data.date}`));
    content.appendChild(document.createTextNode('Blog Post: '));
    titleSpan.setAttribute('id', `t${data.id}`);
    contentSpan.setAttribute('id', `b${data.id}`);
    titleSpan.appendChild(document.createTextNode(`${data.title}`));
    contentSpan.appendChild(document.createTextNode(`${data.content}`));
    title.appendChild(titleSpan);
    content.appendChild(contentSpan);
    div.appendChild(editButton);
    div.appendChild(deleteButton);
    div.appendChild(title);
    div.appendChild(date);
    div.appendChild(content);
    editButton.addEventListener('click', (e) => {
        modifyBlogPost(e);
    });
    deleteButton.addEventListener('click', (e) => {
        deleteBlogPost(e);
    });
    DOM.userBlogContainer.appendChild(div);
};


//Ajax functions

const createBlogPost = () => {
    const page = '/dashboard/publish';
    const xmlhttp = new XMLHttpRequest();
    let data = {
        title: document.getElementById('newBlogTitle').value,
        blogpost: document.getElementById('newBlogContent').value,
    }
    xmlhttp.onreadystatechange = () => {
        if(xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            let json = JSON.parse(xmlhttp.responseText);
            appendNewBlogDiv(json);
            document.getElementById('newBlogTitle').value = "";
            document.getElementById('newBlogContent').value = "";
        };
    };
    xmlhttp.open('POST', page, true);
    xmlhttp.setRequestHeader('Content-Type', 'application/json');
    xmlhttp.send(JSON.stringify(data));
};

const deleteBlogPost = (e) => {
    const target = e.target;
    const id = target.parentNode.getAttribute('id');
    const page = '/dashboard/blog/delete/' + id;
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
    const page = '/dashboard/blog/modify/' + id;
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
        DOM.editPostContainer.classList.toggle('editPostContainerHide');
    };
}; 