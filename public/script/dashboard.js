const DOM = {
    editPostContainer: document.getElementById('editPostContainer'),
    editPostButtons: document.getElementsByClassName('editPostButton'),
    deletePostButtons: document.getElementsByClassName('deletePostButton'),
}

for(let i = 0; i < DOM.editPostButtons.length; i++) {
    DOM.editPostButtons[i].addEventListener('click', (e) => {
        displayEdit();
    });
};

for(let i = 0; i < DOM.deletePostButtons.length; i++) {
    DOM.deletePostButtons[i].addEventListener('click', (e) => {
        deleteBlogPost(e);
    });
};

const displayEdit = () => {
    DOM.editPostContainer.classList.toggle('editPostContainerHide');
}

const removeElement = (id) => {
    let element = document.getElementById(id);
    element.parentNode.removeChild(element);
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
        removeElement(id);
    };
};

// const modifyBlogPost = (e) => {
//     const target = e.target;
//     const id = target.parentNode.getAttribute('id');
//     const page = '/dashboard/blog/modify/' + id;
//     const xmlhttp = new XMLHttpRequest();
//     if(confirm("Are you sure that you want to modify this blog post?") === true) {
//         xmlhttp.onreadystatechange = () => {
//             if(xmlhttp.readyState == 4 && xmlhttp.status == 200) {

//             };
//         };
//         xmlhttp.open('POST', page, true);
//         xmlhttp.send();
//     };
// }; 