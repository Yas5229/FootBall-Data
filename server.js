const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// In-memory data store
let teams = [];

let players = [];

// Helper function to find the next ID
const getNextId = (array) => {
  return array.length > 0 ? Math.max(...array.map(item => item.id)) + 1 : 1;
};

// Routes for teams
app.get('/api/teams', (req, res) => {
  res.json(teams);
});

app.get('/api/teams/:id', (req, res) => {
  const team = teams.find(t => t.id === parseInt(req.params.id));
  if (team) {
    res.json(team);
  } else {
    res.status(404).json({ message: 'Team not found' });
  }
});

app.post('/api/teams', (req, res) => {
  const newTeam = {
    id: getNextId(teams),
    name: req.body.name,
    country: req.body.country
  };
  teams.push(newTeam);
  res.status(201).json(newTeam);
});

// Routes for players with team information
app.get('/api/players', (req, res) => {
  const playersWithTeams = players.map(player => {
    const team = teams.find(team => team.id === player.teamId);
    return {
      ...player,
      teamName: team ? team.name : 'Unknown',
      teamCountry: team ? team.country : 'Unknown'
    };
  });
  res.json(playersWithTeams);
});

app.get('/api/players/:id', (req, res) => {
  const player = players.find(p => p.id === parseInt(req.params.id));
  if (player) {
    res.json(player);
  } else {
    res.status(404).json({ message: 'Player not found' });
  }
});

app.post('/api/players', (req, res) => {
  const newPlayer = {
    id: getNextId(players),
    name: req.body.name,
    teamId: req.body.teamId,
    position: req.body.position
  };
  players.push(newPlayer);
  res.status(201).json(newPlayer);
});

// Serve the main page for all routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Football API server running on port ${port}`);
});
