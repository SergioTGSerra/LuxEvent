function getEvents() {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, '$1');
    const headers = {
        Authorization: `Bearer ${token}`
    };

    const eventsUrl = 'http://localhost:5052/api/Events';
    const usersUrl = 'http://localhost:5052/api/Users';
    const categoriesUrl = 'http://localhost:5052/api/Categories';

    // Seleciona a tabela no DOM
    const table = document.querySelector('.table');
    const tableRows = table.querySelectorAll('tr');

    // Começa a remoção a partir do segundo elemento (índice 1)
    for (let i = 1; i < tableRows.length; i++) {
        tableRows[i].remove();
    }
    
    axios.get(eventsUrl, { headers })
        .then(response => {
            const events = response.data;
            const userRequest = axios.get(usersUrl, { headers });
            const categoryRequest = axios.get(categoriesUrl, { headers });

            axios.all([userRequest, categoryRequest])
                .then(axios.spread((userResponse, categoryResponse) => {
                    const users = userResponse.data;
                    const categories = categoryResponse.data;

                    events.forEach(event => {
                        const user = users.find(user => user.id === event.createdBy);
                        const category = categories.find(category => category.id === event.categoryId);

                        const newRow = table.insertRow();
                        const nameCell = newRow.insertCell();
                        const descriptionCell = newRow.insertCell();
                        const locationCell = newRow.insertCell();
                        const dateCell = newRow.insertCell();
                        const maxParticipantsCell = newRow.insertCell();
                        const createdByCell = newRow.insertCell();
                        const categoryCell = newRow.insertCell();
                        const actionsCell = newRow.insertCell();

                        nameCell.textContent = event.name;
                        descriptionCell.textContent = event.description;
                        locationCell.textContent = event.location;
                        dateCell.textContent = event.eventDate;
                        maxParticipantsCell.textContent = event.maxParticipants;
                        createdByCell.textContent = user ? user.name : 'Unknown User';
                        categoryCell.textContent = category ? category.name : 'Unknown Category';

                        actionsCell.innerHTML =
                            `<button class="btn btn-primary" onclick="openEditModalEvents('${event.id}', '${event.name}', '${event.description}', '${event.location}', '${event.eventDate}', '${event.maxParticipants}')">Edit</button>
                            <button class="btn btn-danger" onclick="deleteEvent('${event.id}')">Delete</button>`;
                    });
                }))
                .catch(error => {
                    if (error.response.status === 401 || error.response.status === 403) {
                        alert("Não tem permissões para aceder a este recurso.");
                    } else {
                        alert(error.response.data.message);
                    }
                });
        })
        .catch(error => {
            if (error.response.status === 401 || error.response.status === 403) {
                alert("Não tem permissões para aceder a este recurso.");
            } else {
                alert(error.response.data.message);
            }
        });
}

async function CreateEvent() {
    const eventName = document.getElementById('eventNameInput').value;
    const eventDescription = document.getElementById('eventDescriptionInput').value;
    const eventLocation = document.getElementById('eventLocationInput').value;
    const eventDateInput = document.getElementById('eventDateInput');
    let eventDate = new Date(eventDateInput.value);
    eventDate = eventDate.toISOString().slice(0, -1);
    const eventMaxParticipants = document.getElementById('eventMaxParticipantsInput').value;
    const eventCreatedBy = document.getElementById('eventCreatedByInput').value;
    const eventCategory = document.getElementById('eventCategoryInput').value;

    const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, '$1');
    const headers = {
        Authorization: `Bearer ${token}`
    };

    try {
        const response = await axios.post('http://localhost:5052/api/Events', {
            name: eventName,
            description: eventDescription,
            location: eventLocation,
            eventDate: eventDate,
            maxParticipants: eventMaxParticipants,
            createdBy: eventCreatedBy,
            categoryId: eventCategory
        }, { headers });

        alert('Event created successfully!');
        getEvents();
    } catch (error) {
        if (error.response.status === 401 || error.response.status === 403) {
            alert("Não tem permissões para aceder a este recurso.");
        } else {
            alert(error.response.data.message);
        }
    }
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
        if (error.response.status === 401 || error.response.status === 403) {
            alert("Não tem permissões para aceder a este recurso.");
        } else {
            alert(error.response.data.message);
        }
    }
}

async function updateEvent() {
    const eventId = document.getElementById('editEventModal').getAttribute('data-event-id');
    const eventName = document.getElementById('editEventNameInput').value;
    const eventDescription = document.getElementById('editEventDescriptionInput').value;
    const eventLocation = document.getElementById('editEventLocationInput').value;
    const eventDateInput = document.getElementById('editEventDateInput');
    let eventDate = new Date(eventDateInput.value);
    eventDate = eventDate.toISOString().slice(0, -1);
    const eventMaxParticipants = document.getElementById('editEventMaxParticipantsInput').value;
    const eventCreatedBy = document.getElementById('eventEditCreatedByInput').value;
    const eventCategory = document.getElementById('eventEditCategoryInput').value;

    const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, '$1');
    const headers = {
        Authorization: `Bearer ${token}`
    };

    try {
        const response = await axios.put(`http://localhost:5052/api/Events/${eventId}`, {
            id: eventId,
            name: eventName,
            description: eventDescription,
            location: eventLocation,
            eventDate: eventDate,
            maxParticipants: eventMaxParticipants,
            createdBy: eventCreatedBy,
            categoryId: eventCategory
        }, { headers });

        console.log('Event updated successfully:', response.data);
        getEvents();
    } catch (error) {
        if (error.response.status === 401 || error.response.status === 403) {
            alert("Não tem permissões para aceder a este recurso.");
        } else {
            alert(error.response.data.message);
        }
    }
}

function openEditModalEvents(eventId, eventName, eventDescription, eventLocation, eventMaxParticipants) {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, '$1');
    const headers = {
        Authorization: `Bearer ${token}`
    };

    const categoryDropdown = document.getElementById("eventEditCategoryInput");
    categoryDropdown.innerHTML = ''; // Clear the dropdown before populating it again

    axios.get("http://localhost:5052/api/Categories", { headers })
        .then(response => {
            const categories = response.data;
            categories.forEach(category => {
                const option = document.createElement("option");
                option.value = category.id;
                option.text = category.name;
                categoryDropdown.appendChild(option);
            });

            const userDropdown = document.getElementById("eventEditCreatedByInput");
            userDropdown.innerHTML = ''; // Clear the dropdown before populating it again

            axios.get("http://localhost:5052/api/Users", { headers })
                .then(response => {
                    const users = response.data;
                    users.forEach(user => {
                        const option = document.createElement("option");
                        option.value = user.id;
                        option.text = user.name;
                        userDropdown.appendChild(option);
                    });

                    document.getElementById('editEventNameInput').value = eventName;
                    document.getElementById('editEventDescriptionInput').value = eventDescription;
                    document.getElementById('editEventLocationInput').value = eventLocation;
                    document.getElementById('editEventMaxParticipantsInput').value = eventMaxParticipants;

                    const editModal = document.getElementById('editEventModal');
                    editModal.setAttribute('data-event-id', eventId);

                    const modal = new bootstrap.Modal(editModal);
                    modal.show();
                })
                .catch(error => {
                    if (error.response.status === 401 || error.response.status === 403) {
                        alert("Não tem permissões para aceder a este recurso.");
                    } else {
                        alert(error.response.data.message);
                    }
                });
        })
        .catch(error => {
            if (error.response.status === 401 || error.response.status === 403) {
                alert("Não tem permissões para aceder a este recurso.");
            } else {
                alert(error.response.data.message);
            }
        });
}

function openAddEventModal() {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, '$1');
    const headers = {
        Authorization: `Bearer ${token}`
    };

    const categoryDropdown = document.getElementById("eventCategoryInput");
    categoryDropdown.innerHTML = ''; // Clear the dropdown before populating it again

    axios.get("http://localhost:5052/api/Categories", { headers })
        .then(response => {
            const categories = response.data;
            categories.forEach(category => {
                const option = document.createElement("option");
                option.value = category.id;
                option.text = category.name;
                categoryDropdown.appendChild(option);
            });

            const userDropdown = document.getElementById("eventCreatedByInput");
            userDropdown.innerHTML = ''; // Clear the dropdown before populating it again

            axios.get("http://localhost:5052/api/Users", { headers })
                .then(response => {
                    const users = response.data;
                    users.forEach(user => {
                        const option = document.createElement("option");
                        option.value = user.id;
                        option.text = user.name;
                        userDropdown.appendChild(option);
                    });

                    const addEventModal = document.getElementById('addEventModal');
                    const modal = new bootstrap.Modal(addEventModal);
                    modal.show();
                })
                .catch(error => {
                    if (error.response.status === 401 || error.response.status === 403) {
                        alert("Não tem permissões para aceder a este recurso.");
                    } else {
                        alert(error.response.data.message);
                    }
                });
        })
        .catch(error => {
            if (error.response.status === 401 || error.response.status === 403) {
                alert("Não tem permissões para aceder a este recurso.");
            } else {
                alert(error.response.data.message);
            }
        });
}