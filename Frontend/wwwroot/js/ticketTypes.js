function getTicketTypes() {
    // Get the token from the cookie
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, '$1');

    // Set the header to include the token
    const headers = {
        Authorization: `Bearer ${token}`
    };

    // Endpoint URL
    const url = 'http://localhost:5052/api/TicketTypes';

    // Select the table in the DOM
    const table = document.querySelector('.table');

    // Send a GET request using Axios
    axios.get(url, { headers })
        .then(response => {
            const data = response.data;

            // Loop through the returned data
            data.forEach(item => {
                // Create a new row in the table
                const newRow = table.insertRow();

                // Create cells for the "Name" and "Actions" columns
                const nameCell = newRow.insertCell();
                const actionsCell = newRow.insertCell();

                // Set the content of the cells
                nameCell.textContent = item.name;
                actionsCell.innerHTML = '<button class="btn btn-primary" onclick="openEditModalTicketType(\'' + item.id + '\', \'' + item.name + '\')">Edit</button><button class="btn btn-danger" onclick="deleteTicketType(\'' + item.id + '\')">Delete</button>';
            });
        })
        .catch(error => {
            // Handle the returned error in case of failure
            console.error(error);
        });
}

async function createTicketType() {
    const ticketTypeName = document.getElementById('ticketTypeNameInput').value;

    try {
        const response = await axios.post('http://localhost:5052/api/TicketTypes', {
            name: ticketTypeName
        });

        console.log('Ticket type created successfully:', response.data);

        getTicketTypes();

        // Close the modal
        const modal = document.getElementById('exampleModal');
        const modalInstance = bootstrap.Modal.getInstance(modal);
        modalInstance.hide();
    } catch (error) {
        console.error('Error creating ticket type:', error);
        alert("Error creating ticket type");
    }
    location.reload();
}

async function deleteTicketType(ticketTypeId) {
    try {
        const confirmation = confirm("Are you sure you want to delete this ticket type?");

        if (!confirmation) {
            return;
        }

        const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, '$1');
        const headers = {
            Authorization: `Bearer ${token}`
        };

        const url = `http://localhost:5052/api/TicketTypes/${ticketTypeId}`;

        const response = await axios.delete(url, { headers });

        console.log('Ticket type deleted successfully:', response.data);

        // Update the table or perform other necessary actions after deleting the ticket type
        getTicketTypes();
    } catch (error) {
        console.error('Error deleting ticket type:', error);
        alert("Error deleting ticket type");
    }
    location.reload();
}

async function updateTicketType() {
    // Get the ticket type ID and updated name from the modal
    const ticketTypeId = document.getElementById('editTicketTypeModal').getAttribute('data-ticket-type-id');
    const updatedName = document.getElementById('editTicketTypeNameInput').value;

    try {
        // Create the request payload
        const data = {
            id: ticketTypeId,
            name: updatedName
        };

        // Make the PUT request to update the ticket type
        const response = await axios.put(`http://localhost:5052/api/TicketTypes/${ticketTypeId}`, data);

        alert('Ticket type updated successfully!');

        // Close the edit modal
        const editModal = document.getElementById('editTicketTypeModal');
        const modalInstance = bootstrap.Modal.getInstance(editModal);
        modalInstance.hide();

        // Refresh the ticket types table
        getTicketTypes();
    } catch (error) {
        console.error('Error updating ticket type:', error);
        alert('Error updating ticket type');
    }
    location.reload();
}

function openEditModalTicketType(ticketTypeId, ticketTypeName) {
    // Set the value of the input in the edit modal to the ticket type name
    const editTicketTypeNameInput = document.getElementById('editTicketTypeNameInput');
    editTicketTypeNameInput.value = ticketTypeName;

    // Set the "data-ticket-type-id" attribute in the edit modal to the ticket type ID
    const editModal = document.getElementById('editTicketTypeModal');
    editModal.setAttribute('data-ticket-type-id', ticketTypeId);

    // Open the edit modal using Bootstrap
    const modal = new bootstrap.Modal(editModal);
    modal.show();
}