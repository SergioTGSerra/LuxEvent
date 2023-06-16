function getEvents() {
    // Get the token from the cookie
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, '$1');

    // Header configuration to include the token
    const headers = {
        Authorization: `Bearer ${token}`
    };

    // Endpoint URLs
    const eventsUrl = 'http://localhost:5052/api/Events';
    const usersUrl = 'http://localhost:5052/api/Users';
    const categoriesUrl = 'http://localhost:5052/api/Categories';

    // Select the table in the DOM
    const table = document.querySelector('.table');

    // Make a GET request to fetch events using Axios
    axios.get(eventsUrl, { headers })
        .then(response => {
            const events = response.data;

            // Make parallel requests to fetch user and category details
            const userRequest = axios.get(usersUrl, { headers });
            const categoryRequest = axios.get(categoriesUrl, { headers });

            // Wait for all requests to complete
            axios.all([userRequest, categoryRequest])
                .then(axios.spread((userResponse, categoryResponse) => {
                    const users = userResponse.data;
                    const categories = categoryResponse.data;

                    // Iterate over the returned data
                    events.forEach(event => {
                        // Find the corresponding user and category by their IDs
                        const user = users.find(user => user.id === event.createdBy);
                        const category = categories.find(category => category.id === event.categoryId);

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
                        createdByCell.textContent = user ? user.name : 'Unknown User';
                        categoryCell.textContent = category ? category.name : 'Unknown Category';

                        actionsCell.innerHTML =
                            '<button class="btn btn-primary" onclick="openEditModalEvents(\'' +
                            event.id +
                            '\', \'' +
                            event.name +
                            '\', \'' +
                            event.description +
                            '\', \'' +
                            event.location +
                            '\', \'' +
                            event.maxParticipants +
                            '\', \'' +
                            '\')">Edit</button><button class="btn btn-danger" onclick="deleteEvent(\'' +
                            event.id +
                            '\')">Delete</button>';
                    });
                }))
                .catch(error => {
                    console.error('Error fetching user and category details:', error);
                });
        })
        .catch(error => {
            // Handle the returned error in case of failure
            console.error(error);
        });
}

async function CreateEvent() {
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
            location: eventLocation,
            maxParticipants: eventMaxParticipants,
            createdBy: eventCreatedBy,
            categoryId: eventCategory
        });

        console.log('Event created successfully:', response.data);

        getEvents();
        
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
    
}

function openEditModalEvents(eventId, eventName, eventDescription, eventLocation, eventMaxParticipants, eventCreatedBy, eventCategory) {

    const categoryDropdown = document.getElementById("eventEditCategoryInput");
    axios.get("http://localhost:5052/api/Categories")
        .then(response => {
            const categories = response.data;
            categories.forEach(category => {
                const option = document.createElement("option");
                option.value = category.id;
                option.text = category.name;
                categoryDropdown.appendChild(option);
            });
        })
        .catch(error => {
            console.error("Erro ao obter categorias:", error);
        });
    const userDropdown = document.getElementById("eventEditCreatedByInput");
    axios.get("http://localhost:5052/api/Users")
        .then(response => {
            const users = response.data;
            users.forEach(user => {
                const option = document.createElement("option");
                option.value = user.id;
                option.text = user.name;
                userDropdown.appendChild(option);
            });
        })
        .catch(error => {
            console.error("Erro ao obter usuários:", error);
        });
    
    
    // Populate the modal fields with the event data
    document.getElementById('editEventNameInput').value = eventName;
    document.getElementById('editEventDescriptionInput').value = eventDescription;
    document.getElementById('editEventLocationInput').value = eventLocation;
    document.getElementById('editEventMaxParticipantsInput').value = eventMaxParticipants;


    // Define o atributo "data-category-id" na modal de edição com o ID do evento
    const editModal = document.getElementById('editEventModal');
    editModal.setAttribute('data-category-id', eventId);

    // Abre a modal de edição usando o Bootstrap
    const modal = new bootstrap.Modal(editModal);
    modal.show();
}

function openAddEventModal() {
    const categoryDropdown = document.getElementById("eventCategoryInput");
    axios.get("http://localhost:5052/api/Categories")
        .then(response => {
            const categories = response.data;
            categories.forEach(category => {
                const option = document.createElement("option");
                option.value = category.id;
                option.text = category.name;
                categoryDropdown.appendChild(option);
            });
        })
        .catch(error => {
            console.error("Erro ao obter categorias:", error);
        });
    const userDropdown = document.getElementById("eventCreatedByInput");
    axios.get("http://localhost:5052/api/Users")
        .then(response => {
            const users = response.data;
            users.forEach(user => {
                const option = document.createElement("option");
                option.value = user.id;
                option.text = user.name;
                userDropdown.appendChild(option);
            });
        })
        .catch(error => {
            console.error("Erro ao obter usuários:", error);
        });
    var addEventModal = new bootstrap.Modal(document.getElementById('addEventModal'));
    addEventModal.show();
}