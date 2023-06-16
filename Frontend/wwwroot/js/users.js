function getUsers() {
    // Get the token from the cookie
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, '$1');

    // Set the header configuration to include the token
    const headers = {
        Authorization: `Bearer ${token}`
    };

    // API endpoint URL
    const url = 'http://localhost:5052/api/Users';

    // Select the table in the DOM
    const table = document.querySelector('.table');

    // Make a GET request using Axios
    axios.get(url, { headers })
        .then(response => {
            const data = response.data;

            // Loop through the returned data
            data.forEach(item => {
                // Create a new row in the table
                const newRow = table.insertRow();

                // Create cells for each field
                const nameCell = newRow.insertCell();
                const usernameCell = newRow.insertCell();
                const emailCell = newRow.insertCell();
                const userTypeCell = newRow.insertCell();
                const actionsCell = newRow.insertCell();

                // Set the content of the cells
                nameCell.textContent = item.name;
                usernameCell.textContent = item.username;
                emailCell.textContent = item.email;
                userTypeCell.textContent = item.usertype;
                actionsCell.innerHTML = '<button class="btn btn-primary" onclick="openEditModalUser(\'' + item.id + '\', \'' + item.name + '\', \'' + item.username + '\', \'' + item.email + '\', \'' + item.usertype + '\')">Edit</button><button class="btn btn-danger" onclick="deleteUser(\'' + item.id + '\')">Delete</button>';
            });
        })
        .catch(error => {
            // Handle the returned error in case of failure
            console.error(error);
        });
}

async function createUser() {
    const userName = document.getElementById('userNameInput').value;
    const userUsername = document.getElementById('userUsernameInput').value;
    const userPassword = document.getElementById('userPasswordInput').value;
    const userEmail = document.getElementById('userEmailInput').value;
    const userType = document.getElementById('userTypeInput').value;

    try {
        const response = await axios.post('http://localhost:5052/api/Users', {
            name: userName,
            username: userUsername,
            password: userPassword,
            email: userEmail,
            usertype: userType
        });

        console.log('User created successfully:', response.data);

        // Refresh the users table
        getUsers();

        // Close the modal
        const modal = document.getElementById('exampleModal');
        const modalInstance = bootstrap.Modal.getInstance(modal);
        modalInstance.hide();
    } catch (error) {
        console.error('Error creating user:', error);
        alert("Error creating user");
    }
    location.reload();
}

async function deleteUser(userId) {
    try {
        const confirmation = confirm("Are you sure you want to delete this user?");

        if (!confirmation) {
            return;
        }

        const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, '$1');
        const headers = {
            Authorization: `Bearer ${token}`
        };

        const url = `http://localhost:5052/api/Users/${userId}`;

        const response = await axios.delete(url, { headers });

        console.log('User deleted successfully:', response.data);

        // Update the table or perform any necessary actions after deleting the user
        getUsers();
    } catch (error) {
        console.error('Error deleting user:', error);
        alert("Error deleting user");
    }
    location.reload();
}

async function updateUser() {
    // Get the user ID and updated field values from the modal
    const userId = document.getElementById('editUserModal').getAttribute('data-user-id');
    const updatedName = document.getElementById('editUserNameInput').value;
    const updatedUsername = document.getElementById('editUserUsernameInput').value;
    const updatedEmail = document.getElementById('editUserEmailInput').value;
    const updatedUserType = document.getElementById('editUserTypeInput').value;

    try {
        // Create the request payload
        const data = {
            id: userId,
            name: updatedName,
            username: updatedUsername,
            email: updatedEmail,
            usertype: updatedUserType
        };

        // Make the PUT request to update the user
        const response = await axios.put(`http://localhost:5052/api/Users/${userId}`, data);

        alert('User updated successfully!');

        // Close the edit modal
        const editModal = document.getElementById('editUserModal');
        const modalInstance = bootstrap.Modal.getInstance(editModal);
        modalInstance.hide();

        // Refresh the users table
        getUsers();
    } catch (error) {
        console.error('Error updating user:', error);
        alert('Error updating user');
    }
    location.reload();
}

function openEditModalUser(userId, userName, userUsername, userEmail, userUserType) {
    // Set the value of the inputs in the edit modal
    const editUserNameInput = document.getElementById('editUserNameInput');
    const editUserUsernameInput = document.getElementById('editUserUsernameInput');
    const editUserEmailInput = document.getElementById('editUserEmailInput');
    const editUserTypeInput = document.getElementById('editUserTypeInput');

    editUserNameInput.value = userName;
    editUserUsernameInput.value = userUsername;
    editUserEmailInput.value = userEmail;
    editUserTypeInput.value = userUserType;

    // Set the "data-user-id" attribute in the edit modal with the user ID
    const editModal = document.getElementById('editUserModal');
    editModal.setAttribute('data-user-id', userId);

    // Open the edit modal using Bootstrap
    const modal = new bootstrap.Modal(editModal);
    modal.show();
}