import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";

function RegistrationForm() {
  const [students, setStudents] = useState([]);
  const [activities, setActivities] = useState({});
  const [filterName, setFilterName] = useState("");
  const [filterClass, setFilterClass] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "CLASS", direction: "asc" });

  useEffect(() => {
    axios.get("https://jmjforms.onrender.com/api/students")
      .then(res => setStudents(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleRegister = async (id) => {
    const selectedActivity = activities[id];
    if (!selectedActivity) {
      alert("Please select an activity before registering.");
      return;
    }

    await axios.post("https://jmjforms.onrender.com/api/register", { id, extraActivity: selectedActivity });
    alert("Activity registered successfully!");
    // Refresh students list
    const res = await axios.get("https://jmjforms.onrender.com/api/students");
    setStudents(res.data);
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const filteredAndSortedStudents = useMemo(() => {
    let filtered = students.filter(student => {
      const matchName = (student.NAME || "").toLowerCase().includes(filterName.toLowerCase());
      const matchClass = (student.CLASS || "").toLowerCase().includes(filterClass.toLowerCase());
      return matchName && matchClass;
    });

    filtered.sort((a, b) => {
      const valA = (a[sortConfig.key] || "").toString().toLowerCase();
      const valB = (b[sortConfig.key] || "").toString().toLowerCase();
      if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
      if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [students, filterName, filterClass, sortConfig]);

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return " ↕️";
    return sortConfig.direction === "asc" ? " ⬆️" : " ⬇️";
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">JMJ Extracurricular Activity Registration</h2>

      <div className="row mb-3">
        <div className="col-md-6">
          <input type="text" className="form-control" placeholder="Filter by Name..." value={filterName} onChange={e => setFilterName(e.target.value)} />
        </div>
        <div className="col-md-6">
          <input type="text" className="form-control" placeholder="Filter by Class..." value={filterClass} onChange={e => setFilterClass(e.target.value)} />
        </div>
      </div>

      <table className="table table-bordered table-striped">
        <thead className="table-dark">
          <tr>
            <th onClick={() => handleSort("NAME")} style={{ cursor: "pointer" }}>Name{getSortIcon("NAME")}</th>
            <th onClick={() => handleSort("CLASS")} style={{ cursor: "pointer" }}>Class{getSortIcon("CLASS")}</th>
            <th onClick={() => handleSort("FATHER NAME")} style={{ cursor: "pointer" }}>Father Name{getSortIcon("FATHER NAME")}</th>
            <th onClick={() => handleSort("PHONE")} style={{ cursor: "pointer" }}>Phone{getSortIcon("PHONE")}</th>
            <th>Activity</th>
            <th>Register</th>
          </tr>
        </thead>
        <tbody>
          {filteredAndSortedStudents.map(student => (
            <tr key={student._id}>
              <td>{student.NAME}</td>
              <td>{student.CLASS}</td>
              <td>{student["FATHER NAME"]}</td>
              <td>{student.PHONE}</td>
              <td>
                <select
                  className="form-select"
                  value={activities[student._id] || student.extraActivity || student["EXTRA Cultural Activity"] || ""}
                  onChange={(e) => setActivities({ ...activities, [student._id]: e.target.value })}
                >
                  <option value="">Select Activity</option>
                  <option value="Classical Dance">Classical Dance</option>
                  <option value="Western Dance">Western Dance</option>
                  <option value="Karate">Karate</option>
                </select>
              </td>
              <td>
                <button
                  className="btn btn-primary"
                  onClick={() => handleRegister(student._id)}
                >
                  Register
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default RegistrationForm;
