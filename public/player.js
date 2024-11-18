// Global variable to store teams
let teamsList = [];

// Function to fetch and display players
function fetchPlayers() {
    fetch('/api/players')
        .then(response => response.json())
        .then(players => {
            const playersTableBody = document.querySelector('#playersTable tbody');
            playersTableBody.innerHTML = '';
            players.forEach(player => {
                const row = document.createElement('tr');
                row.innerHTML = `<td>${player.id}</td><td>${player.name}</td><td>${player.position}</td><td>${player.teamName}</td><td>${player.teamCountry}</td>`;
                playersTableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error fetching players:', error);
            document.getElementById('playerError').textContent = 'Failed to fetch players. Please try again.';
        });
}

// Function to fetch and display teams
function fetchTeams() {
    fetch('/api/teams')
        .then(response => response.json())
        .then(teams => {
            teamsList = teams; // Store fetched teams
            const teamSelect = document.getElementById('playerTeamId');
            teams.forEach(team => {
                const option = document.createElement('option');
                option.value = team.id;
                option.textContent = team.name; // Display team name in dropdown
                teamSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error fetching teams:', error);
            document.getElementById('playerError').textContent = 'Failed to fetch teams. Please try again.';
        });
}

// Update selected team details
document.getElementById('playerTeamId').addEventListener('change', function() {
    const selectedId = parseInt(this.value);
    const selectedTeam = teamsList.find(team => team.id === selectedId);
    const teamDetails = document.getElementById('selectedTeamDetails');

    if (selectedTeam) {
        teamDetails.textContent = `Team: ${selectedTeam.name}, Country: ${selectedTeam.country}`;
    } else {
        teamDetails.textContent = ''; // Clear details if no team is selected
    }
});

// Add player form submission
document.getElementById('addPlayerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('playerName').value;
    const position = document.getElementById('playerPosition').value;
    const teamId = parseInt(document.getElementById('playerTeamId').value);

    fetch('/api/players', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, position, teamId }),
    })
    .then(response => response.json())
    .then(() => {
        fetchPlayers();
        this.reset();
        document.getElementById('playerError').textContent = '';
    })
    .catch(error => {
        console.error('Error adding player:', error);
        document.getElementById('playerError').textContent = 'Failed to add player. Please try again.';
    });
});

// Fetch players and teams on page load
if (window.location.pathname === '/players.html') {
    fetchPlayers();
    fetchTeams(); // Fetch teams to populate dropdown
}
