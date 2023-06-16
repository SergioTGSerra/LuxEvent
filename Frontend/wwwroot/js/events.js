function getEvents() {
    // Get the token from the cookie
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, '$1');

    // Header configuration to include the token
    const headers = {
        Authorization: `Bearer ${token}`
    };

    // Endpoint URL
    const url = 'http://localhost:5052/api/Events';

    // Select the table in the DOM
    const table = document.querySelector('.table');

    // Make a GET request using Axios
    axios
        .get(url, { headers })
        .then(response => {
            const events = response.data;

            // Iterate over the returned data
            events.forEach(event => {
                // Create a new row in the table
                const newRow = table.insertRow();

                // Create cells for each field
                const nameCell = newRow.insertCell();
                const descriptionCell = newRow.insertCell();
                const locationCell = newRow.insertCell();
                const maxParticipantsCell = newRow.insertCell();
                const createdByCell = newRow.insertCell();
                const categoryCell = newRow.insertCell();
                const actionsCell = newRow.insertCell();

                // Set the content of each cell
                nameCell.textContent = event.name;
                descriptionCell.textContent = event.description;
                locationCell.textContent = event.location;
                maxParticipantsCell.textContent = event.maxParticipants;
                createdByCell.textContent = event.createdBy;
                categoryCell.textContent = event.categoryId;

                actionsCell.innerHTML =
                    '<button class="btn btn-primary" onclick="openEditModalEvents(\'' +
                    event.id +
                    '\', \'' +
                    event.name +
                    '\', \'' +
                    event.description +
                    '\', \'' +
                    event.local +
                    '\', \'' +
                    event.maxparticipants +
                    '\', \'' +
                    event.createdBy +
                    '\', \'' +
                    event.categoryId +
                    '\')">Edit</button><button class="btn btn-danger" onclick="deleteEvent(\'' +
                    event.id +
                    '\')">Delete</button>';
            });
        })
        .catch(error => {
            // Handle the returned error in case of failure
            console.error(error);
        });
}

async function createEvent() {
    const eventName = document.getElementById('eventNameInput').value;
    const eventDescription = document.getElementById('eventDescriptionInput').value;
    const eventLocation = document.getElementById('eventLocationInput').value;
    const eventMaxParticipants = document.getElementById('eventMaxParticipantsInput').value;
    const eventCreatedBy = document.getElementById('eventCreatedByInput').value;
    const eventCategory = document.getElementById('eventCategoryInput').value;

    try {
        const response = await axios.post('http://localhost:5052/api/Events', {
            name: eventName,
            description: eventDescription,
            local: eventLocation,
            maxparticipants: eventMaxParticipants,
            createdBy: eventCreatedBy,
            categoryId: eventCategory
        });

        console.log('Event created successfully:', response.data);

        getEvents();

        // Close the modal
        const modal = document.getElementById('exampleModal');
        const modalInstance = bootstrap.Modal.getInstance(modal);
        modalInstance.hide();
    } catch (error) {
        console.error('Error creating event:', error);
        alert('Error creating event');
    }
    location.reload();
}

async function deleteEvent(eventId) {
    try {
        const confirmation = confirm('Are you sure you want to delete this event?');

        if (!confirmation) {
            return;
        }

        const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, '$1');
        const headers = {
            Authorization: `Bearer ${token}`
        };

        const url = `http://localhost:5052/api/Events/${eventId}`;

        const response = await axios.delete(url, { headers });

        console.log('Event deleted successfully:', response.data);

        getEvents();
    } catch (error) {
        console.error('Error deleting event:', error);
        alert('Error deleting event');
    }
    location.reload();
}

async function updateEvent() {
    const eventId = document.getElementById('editEventModal').getAttribute('data-event-id');
    const updatedName = document.getElementById('editEventNameInput').value;
    const updatedDescription = document.getElementById('editEventDescriptionInput').value;
    const updatedLocation = document.getElementById('editEventLocationInput').value;
    const updatedMaxParticipants = document.getElementById('editEventMaxParticipantsInput').value;
    const updatedCreatedBy = document.getElementById('editEventCreatedByInput').value;
    const updatedCategory = document.getElementById('editEventCategoryInput').value;

    try {
        const data = {
            id: eventId,
            name: updatedName,
            description: updatedDescription,
            local: updatedLocation,
            maxparticipants: updatedMaxParticipants,
            createdBy: updatedCreatedBy,
            categoryId: updatedCategory
        };

        const response = await axios.put(`http://localhost:5052/api/Events/${eventId}`, data);

        alert('Event updated successfully!');

        const editModal = document.getElementById('editEventModal');
        const modalInstance = bootstrap.Modal.getInstance(editModal);
        modalInstance.hide();

        getEvents();
    } catch (error) {
        console.error('Error updating event:', error);
        alert('Error updating event');
    }
    location.reload();
}

function openEditModalEvents(eventId, eventName, eventDescription, eventLocation, eventMaxParticipants, eventCreatedBy, eventCategory) {
    const modal = document.getElementById('editEventModal');

    // Set the event ID as a data attribute of the modal
    modal.setAttribute('data-event-id', eventId);

    // Populate the modal fields with the event data
    document.getElementById('editEventNameInput').value = eventName;
    document.getElementById('editEventDescriptionInput').value = eventDescription;
    document.getElementById('editEventLocationInput').value = eventLocation;
    document.getElementById('editEventMaxParticipantsInput').value = eventMaxParticipants;
    document.getElementById('editEventCreatedByInput').value = eventCreatedBy;
    document.getElementById('editEventCategoryInput').value = eventCategory;

    // Show the modal
    const modalInstance = bootstrap.Modal.getInstance(modal);
    modalInstance.show();
}