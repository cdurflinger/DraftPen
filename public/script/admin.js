const DOM = {
    anchorTags: document.getElementsByClassName('user__profile__links'),
    deletePostButtons: document.getElementsByClassName('delete__post__button'),
    closeEditContainerButton: document.getElementById('close__edit__container'),
    editPostContainer: document.getElementById('edit__post__container'),
    editPostButtons: document.getElementsByClassName('edit__post__button'),
    editBlogTitle: document.getElementById('edit__blog__title'),
    editBlogContent: document.getElementById('edit__blog__content'),
    editBlogSubmitButton: document.getElementById('edit__blog__submit__button'),
    firstName: document.getElementById('first__name'),
    lastName: document.getElementById('last__name'),
    username: document.getElementById('username'),
    userId: document.getElementById('user__id'),
    permissionLevel: document.getElementById('permission__level'),
    userEmail: document.getElementById('user__email'),
    updateUserButton: document.getElementById('update__user__button'),
    deleteUserButton: document.getElementById('delete__user__button'),
    userRegisterFormDisplayButton: document.getElementById('user__register__form__button'),
}

//add href to user anchor tags
for(let i = 0; i < DOM.anchorTags.length; i++) {
    DOM.anchorTags[i].setAttribute('href', 'admin/' + DOM.anchorTags[i].parentNode.getAttribute('id'));
}




//adminControl Section

//This if/else is only here so a seperate JS file is not needed for the admin/admin control page. If
//admin page, only add event listener to user registration form button, else add other event listeners.
if(DOM.userRegisterFormDisplayButton) {
    DOM.userRegisterFormDisplayButton.addEventListener('click', () => {
        document.getElementById('register__form').classList.toggle('hide');
    });
} else {
    DOM.editBlogSubmitButton.addEventListener('click', (e) => {
        modifyBlogPost(e);
    });
    
    DOM.updateUserButton.addEventListener('click', () => {
        updateUserData();
    })
    
    DOM.deleteUserButton.addEventListener('click', () => {
        deleteUser();
    });
}

for(let i = 0; i < DOM.editPostButtons.length; i++) {
    DOM.editPostButtons[i].addEventListener('click', (e) => {
        let parentId = e.target.parentNode.getAttribute('id');
        DOM.editBlogTitle.value = document.getElementById(`t${parentId}`).textContent;
        DOM.editBlogContent.textContent = document.getElementById(`b${parentId}`).textContent;
        displayEditDiv(parentId);
    });
};

const displayEditDiv = (parentId) => {
    DOM.editPostContainer.classList.toggle('edit__post__container__hide');
    //fix this in the future, it remove the DOM selector from the DIV but still works on consecutive modify clicks
    DOM.editPostContainer.setAttribute('id', parentId);

    //add event listener for close button
    DOM.closeEditContainerButton.addEventListener('click', () => {
        DOM.editPostContainer.classList.add('edit__post__container__hide');
    });
}

//helper function to remove DOM element
const removeElement = (id) => {
    let element = document.getElementById(id);
    element.parentNode.removeChild(element);
};

//add event listener delete to delete post buttons
for(let i = 0; i < DOM.deletePostButtons.length; i++) {
    DOM.deletePostButtons[i].addEventListener('click', (e) => {
        deleteBlogPost(e);
    });
};

//AJAX requests

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
        removeElement(id);
    };
};

const modifyBlogPost = (e) => {
    const target = e.target;
    const id = target.parentNode.getAttribute('id');
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

const updateUserData = () => {
    const id = DOM.userId.textContent;
    const page = '/admin/user/' + id;
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
    const page = '/admin/user/' + id;
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
        window.location = "/admin";
    };
};

//registration validation

const form = document.getElementsByTagName('form')[0];
const FORM_INPUTS = {
    username: document.getElementById('username'),
    email: document.getElementById('email'),
    firstname: document.getElementById('firstname'),
    lastname: document.getElementById('lastname'),
    password: document.getElementById('password'),
    confirmpassword: document.getElementById('confirmpassword'),
}

let constraints = {
    username: {
        presence: {
            allowEmpty: false,
            message: 'Please enter a username'
        }
    },
    email: {
        presence: {
            allowEmpty: false,
            message: 'Please enter an email address'
        },
        email: {
            message: 'Please enter a valid email address'
        }
    },
    firstname: {
        presence: {
            allowEmpty: false,
            message: 'Please enter your first name'
        }
    },
    lastname: {
        presence: {
            allowEmpty: false,
            message: 'Please enter your last name'
        }
    },
    password: {
        presence: true,
        length: {
            minimum: 5,
            message: 'Password must be at least 5 characters'
        }
    },
    confirmpassword: {
        equality: {
            attribute: 'password',
            message: 'Passwords do not match'
        }
    },
};



form.addEventListener('submit', (e) => {
    let values = validate.collectFormValues(form);
    let keys = Object.keys(FORM_INPUTS);
    let validated = validate(values, constraints, {format: 'detailed'});

    //remove invalid class from inputs and remove error message
    for(let i = 0; i < keys.length; i++) {
        FORM_INPUTS[`${keys[i]}`].classList.remove('input__invalid');
        document.getElementById(`${keys[i]}__span`).textContent = '';
    }
    if (validated !== undefined) {
        //stop form from posting
        e.preventDefault();

        //add invalid class and error message
        for(let i = 0; i < validated.length; i++) {
            let span = document.getElementById(`${validated[i].attribute}__span`);
            span.textContent = validated[i].options.message;
            document.getElementById(`${validated[i].attribute}`).classList.add('input__invalid');
        }
    }

}, false);