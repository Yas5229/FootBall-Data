// Function to fetch and display teams
function fetchTeams() {
    fetch('/api/teams')
        .then(response => response.json())
        .then(teams => {
            const teamsTableBody = document.querySelector('#teamsTable tbody');
            teamsTableBody.innerHTML = '';
            teams.forEach(team => {
                const row = document.createElement('tr');
                row.innerHTML = `<td>${team.id}</td><td>${team.name}</td><td>${team.country}</td>`;
                teamsTableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error fetching teams:', error);
            document.getElementById('teamError').textContent = 'Failed to fetch teams. Please try again.';
        });
}

// Add team form submission
document.getElementById('addTeamForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('teamName').value;
    const country = document.getElementById('teamCountry').value;

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
