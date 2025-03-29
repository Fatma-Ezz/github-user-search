import { useState } from "react";
import axios from "axios";

const Search = ({ onSearch }) => {
  const [username, setUsername] = useState("");
  const [location, setLocation] = useState("");
  const [repos, setRepos] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(username, location, repos);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 flex gap-2">
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="border p-2 rounded"
      />
      <input
        type="text"
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="border p-2 rounded"
      />
      <input
        type="number"
        placeholder="Min Repos"
        value={repos}
        onChange={(e) => setRepos(e.target.value)}
        className="border p-2 rounded"
      />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Search
      </button>
    </form>
  );
};

const App = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchUsersByFilters = async (username, location, repos) => {
    setLoading(true);
    setError("");
    setUsers([]);

    let query = `q=${username}`;
    if (location) query += `+location:${location}`;
    if (repos) query += `+repos:>${repos}`;

    try {
      const response = await axios.get(`https://api.github.com/search/users?${query}`);
      setUsers(response.data.items);
    } catch (err) {
      setError("Looks like we can't find the user");
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold">GitHub User Search</h1>
      <Search onSearch={fetchUsersByFilters} />
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {users.map((user) => (
          <div key={user.id} className="p-4 border rounded shadow">
            <img src={user.avatar_url} alt={user.login} className="w-20 h-20 rounded-full mx-auto" />
            <h2 className="text-center">{user.login}</h2>
            <a href={user.html_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 text-center block">
              View Profile
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
