const DOM = {
    anchorTags: document.getElementsByClassName('userProfileLinks'),
    deletePostButtons: document.getElementsByClassName('deletePostButton'),
    editPostContainer: document.getElementById('editPostContainer'),
    editPostButtons: document.getElementsByClassName('editPostButton'),
    editBlogTitle: document.getElementById('editBlogTitle'),
    editBlogContent: document.getElementById('editBlogContent'),
    editBlogSubmitButton: document.getElementById('editBlogSubmitButton'),
    firstName: document.getElementById('firstName'),
    lastName: document.getElementById('lastName'),
    username: document.getElementById('username'),
    userId: document.getElementById('userId'),
    permissionLevel: document.getElementById('permissionLevel'),
    userEmail: document.getElementById('userEmail'),
    updateUserButton: document.getElementById('updateUserButton'),
    deleteUserButton: document.getElementById('deleteUserButton'),
}

for(let i = 0; i < DOM.anchorTags.length; i++) {
    DOM.anchorTags[i].setAttribute('href', 'admin/' + DOM.anchorTags[i].parentNode.getAttribute('id'));
}




//adminControl Section

for(let i = 0; i < DOM.editPostButtons.length; i++) {
    DOM.editPostButtons[i].addEventListener('click', (e) => {
        let parentId = e.target.parentNode.getAttribute('id');
        DOM.editBlogTitle.value = document.getElementById(`t${parentId}`).textContent;
        DOM.editBlogContent.textContent = document.getElementById(`b${parentId}`).textContent;
        displayEditDiv(parentId);
    });
};

const displayEditDiv = (parentId) => {
    DOM.editPostContainer.classList.toggle('editPostContainerHide');
    //fix this in the future, it remove the DOM selector from the DIV but still works on consecutive modify clicks
    DOM.editPostContainer.setAttribute('id', parentId);
}

const removeElement = (id) => {
    let element = document.getElementById(id);
    element.parentNode.removeChild(element);
};

for(let i = 0; i < DOM.deletePostButtons.length; i++) {
    DOM.deletePostButtons[i].addEventListener('click', (e) => {
        deleteBlogPost(e);
    });
};

DOM.editBlogSubmitButton.addEventListener('click', (e) => {
    modifyBlogPost(e);
});

DOM.updateUserButton.addEventListener('click', () => {
    updateUserData();
})

DOM.deleteUserButton.addEventListener('click', () => {
    deleteUser();
});

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
        xmlhttp.setRequestHeader('Content-Type', 'application/json');
        xmlhttp.send(JSON.stringify(data));
        DOM.editPostContainer.classList.toggle('editPostContainerHide');
    };
};

const updateUserData = () => {
    const id = DOM.userId.textContent;
    const page = '/admin/user/modify/' + id;
    let data = {
        id: id,
        firstName: DOM.firstName.value,
        lastName: DOM.lastName.value,
        username: DOM.username.value,
        UserPermissionLevel: DOM.permissionLevel.value,
        userEmail: DOM.userEmail.value,
    }
    const xmlhttp = new XMLHttpRequest();
    if(confirm("Are you sure that you want to update this Users Data?") === true) {
        xmlhttp.onreadystatechange = () => {
            if(xmlhttp.readyState == 4 && xmlhttp.status == 200) {

            };
        };
        xmlhttp.open('PUT', page, true);
        xmlhttp.setRequestHeader('Content-Type', 'application/json');
        xmlhttp.send(JSON.stringify(data));
    };
};

const deleteUser = () => {
    const id = DOM.userId.textContent;
    const page = '/admin/user/delete/' + id;
    const xmlhttp = new XMLHttpRequest();
    if(confirm("Are you sure that you want to delete this users profile? This cannot be reversed!!!") === true) {
        if(confirm("This is you last chance! Are you sure that you want to delete this users profile?") === true) {
            xmlhttp.onreadystatechange = () => {
                if(xmlhttp.readyState == 4 && xmlhttp.status == 200) {

                };
            };
        };
        xmlhttp.open('DELETE', page, true);
        xmlhttp.send();
    };
};