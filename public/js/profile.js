const editButton = document.getElementById('edit-button');
const updateButton = document.getElementById('update-button');
const inputs = document.querySelectorAll('#profile-form input');
const profileImgInput = document.getElementById('profileImg');
const profileImgPreview = document.getElementById('profileImgPreview');
const changePasswordButton = document.getElementById('change-password-button');
const passwordFields = document.querySelectorAll('.password-fields');

// Enable editing profile fields
editButton.addEventListener('click', () => {
    inputs.forEach(input => {
        if (!['email', 'oldPassword', 'newPassword'].includes(input.id)) {
            input.removeAttribute('readonly');
        }
    });
    updateButton.style.display = 'block';
    editButton.style.display = 'none';
    changePasswordButton.style.display = 'block';
});


// Show password fields on "Change Password" button click
changePasswordButton.addEventListener('click', () => {
    passwordFields.forEach(field => {
        field.style.display = 'block';
        field.querySelector('input').setAttribute('required', 'required');
    });
    changePasswordButton.style.display = 'none';
});

// Preview profile image
profileImgInput.addEventListener('input', () => {
    profileImgPreview.src = profileImgInput.value;
});

// Form submission handler
document.getElementById('profile-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const oldPassword = document.getElementById('oldPassword').value;
    const newPassword = document.getElementById('newPassword').value;

    // Check if password fields are valid
    if (passwordFields[0].style.display === 'block' && (!oldPassword || !newPassword)) {
        alert('Please fill both old and new password fields.');
        return;
    }

    const form = e.target;
    const formData = new FormData(form);
    const formObject = Object.fromEntries(formData.entries());

    fetch(form.action, {
        method: 'PUT',
        body: JSON.stringify(formObject),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            console.log('Success', data);
            alert('Profile updated successfully');
            window.location.reload();
        })
        .catch(error => {
            alert('Error updating profile: ' + error.message);
            console.error('Error:', error);
        });
});
