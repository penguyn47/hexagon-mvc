
const editButton = document.getElementById('edit-button');
const updateButton = document.getElementById('update-button');
const inputs = document.querySelectorAll('#profile-form input');
const profileImgInput = document.getElementById('profileImg');
const profileImgPreview = document.getElementById('profileImgPreview');

editButton.addEventListener('click', () => {
    inputs.forEach(input => {
        if (input.id !== 'email') {
            input.removeAttribute('readonly');
        }
    });
    updateButton.style.display = 'block';
    editButton.style.display = 'none';
});

profileImgInput.addEventListener('input', () => {
    profileImgPreview.src = profileImgInput.value; // Update the image preview when the URL changes
});

document.getElementById('profile-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    let form = e.target;
    let formData = new FormData(form);

    fetch(form.action, {
        method: 'PUT',
        body: JSON.stringify(Object.fromEntries(formData)),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => response.json())
    .then(data => {
        console.log('Success', data);
        alert('Profile updated successfully');
        window.location.reload();
    })
    .catch((error) => {
        alert('Error updating profile: ' + error.message);
        console.error('Error:', error);
    });
});
