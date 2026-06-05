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

  const uniqueClasses = useMemo(() => {
    const classes = new Set(students.map(s => s.CLASS).filter(Boolean));
    return Array.from(classes).sort();
  }, [students]);

  const insights = useMemo(() => {
    const overallTotal = students.length;
    const overallRegistered = students.filter(s => s.extraActivity || s["EXTRA Cultural Activity"]).length;

    const classStudents = filterClass ? students.filter(s => s.CLASS === filterClass) : students;
    const classTotal = classStudents.length;
    const classRegistered = classStudents.filter(s => s.extraActivity || s["EXTRA Cultural Activity"]).length;

    return {
      overallTotal,
      overallRegistered,
      classTotal,
      classRegistered,
    };
  }, [students, filterClass]);

  const filteredAndSortedStudents = useMemo(() => {
    let filtered = students.filter(student => {
      const matchName = (student.NAME || "").toLowerCase().includes(filterName.toLowerCase());
      const matchClass = filterClass ? student.CLASS === filterClass : true;
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

      {/* Dashboard Insights */}
      <div className="row mb-4">
        <div className="col-md-6 mb-3">
          <div className="card text-white bg-info mb-3 h-100">
            <div className="card-header text-center">Overall Insights</div>
            <div className="card-body">
              <h5 className="card-title">Total Students: {insights.overallTotal}</h5>
              <p className="card-text">Registered for Activities: {insights.overallRegistered}</p>
            </div>
          </div>
        </div>
        <div className="col-md-6 mb-3">
          <div className="card text-white bg-success mb-3 h-100">
            <div className="card-header text-center">{filterClass ? `Insights for Class: ${filterClass}` : "Insights for All Classes"}</div>
            <div className="card-body">
              <h5 className="card-title">Total Students: {insights.classTotal}</h5>
              <p className="card-text">Registered for Activities: {insights.classRegistered}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-md-6">
          <input type="text" className="form-control" placeholder="Filter by Name..." value={filterName} onChange={e => setFilterName(e.target.value)} />
        </div>
        <div className="col-md-6">
          <select className="form-select" value={filterClass} onChange={e => setFilterClass(e.target.value)}>
            <option value="">All Classes</option>
            {uniqueClasses.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
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
              <td><a href={`tel:${student.PHONE}`} className="footer-icon link-underline-dark" target="_blank" rel="noopener noreferrer">{student.PHONE}</a></td>
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
