import React, { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    axios.get("https://jmjforms.onrender.com/api/stats")
      .then(res => setStats(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">📊 Activity Dashboard</h2>
      <table className="table table-bordered table-striped">
        <thead className="table-dark">
          <tr>
            <th>Class</th>
            <th>Activity</th>
            <th>Count</th>
          </tr>
        </thead>
        <tbody>
          {stats.map((row, idx) => (
            <tr key={idx}>
              <td>{row._id.class}</td>
              <td>{row._id.activity || "Not Registered"}</td>
              <td>{row.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Dashboard;
