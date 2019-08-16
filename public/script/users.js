const form = document.getElementsByTagName('form')[0];
const FORM_INPUTS = {
    username: document.getElementById('username'),
    email: document.getElementById('email'),
    firstname: document.getElementById('firstname'),
    lastname: document.getElementById('lastname'),
    password: document.getElementById('password'),
    confirmpassword: document.getElementById('confirmpassword'),
}



//form validation

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