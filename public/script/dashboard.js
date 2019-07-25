//DOM selectors
const DOM = {
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
    DOM.editPostContainer.setAttribute('id', parentId);
}

const removeElement = (id) => {
    let element = document.getElementById(id);
    element.parentNode.removeChild(element);
};


//Ajax functions

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
        removeElement(id);
    };
};

const modifyBlogPost = (e) => {
    const target = e.target;
    const id = target.parentNode.getAttribute('id');
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

            };
        };
        xmlhttp.open('PUT', page, true);
        xmlhttp.setRequestHeader('Content-Type', 'application/json')
        xmlhttp.send(JSON.stringify(data));
        DOM.editPostContainer.classList.toggle('editPostContainerHide');
    };
}; 