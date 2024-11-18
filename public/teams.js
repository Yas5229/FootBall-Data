// Global variable to store the teams
let teamsList = [];

// Function to fetch and display teams
function fetchTeams() {
    fetch('/api/teams')
        .then(response => response.json())
        .then(teams => {
            teamsList = teams; // Update the global teamsList with fetched teams
            const teamsTableBody = document.querySelector('#teamsTable tbody');
            teamsTableBody.innerHTML = '';
            teams.forEach(team => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${team.id}</td>
                    <td>${team.name}</td>
                    <td>${team.country}</td>
                    <td><button class="delete-button" data-id="${team.id}">Delete</button></td>
                `;
                teamsTableBody.appendChild(row);
            });
            // Add event listeners to delete buttons
            document.querySelectorAll('.delete-button').forEach(button => {
                button.addEventListener('click', function() {
                    const teamId = this.getAttribute('data-id');
                    deleteTeam(teamId);
                });
            });
        })
        .catch(error => {
            console.error('Error fetching teams:', error);
            document.getElementById('teamError').textContent = 'Failed to fetch teams. Please try again.';
        });
}

// Function to delete a team
function deleteTeam(teamId) {
    if (confirm('Are you sure you want to delete this team?')) { // Confirmation dialog
        fetch(`/api/teams/${teamId}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => {
                    throw new Error(text || 'Failed to delete team.');
                });
            }
            fetchTeams(); // Refresh the teams list after successful deletion
        })
        .catch(error => {
            console.error('Error deleting team:', error);
            document.getElementById('teamError').textContent = error.message; // Display the error message
        });
    }
}

// Add team form submission
document.getElementById('addTeamForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('teamName').value.trim();
    const country = document.getElementById('teamCountry').value.trim();

    // Check if a team with the same name already exists
    const isDuplicate = teamsList.some(team => team.name.toLowerCase() === name.toLowerCase());

    if (isDuplicate) {
        document.getElementById('teamError').textContent = 'Team already exists with the same name.';
        return;
    }

    fetch('/api/teams', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, country }),
    })
    .then(response => response.json())
    .then(() => {
        fetchTeams();
        this.reset();
        document.getElementById('teamError').textContent = '';
    })
    .catch(error => {
        console.error('Error adding team:', error);
        document.getElementById('teamError').textContent = 'Failed to add team. Please try again.';
    });
});

// Fetch teams on page load
if (window.location.pathname === '/teams.html') {
    fetchTeams();
}
