import { useEffect, useState } from "react";

const API_URL = `${import.meta.env.VITE_API_URL}/students`;

function Students() {

  // States
  const [students, setStudents] = useState([]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [course, setCourse] = useState("");

  const [editId, setEditId] = useState(null);
  const [searchId, setSearchId] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);


  // ==========================
  // 1. GET ALL STUDENTS
  // ==========================

  async function getStudents() {

    try {

      setLoading(true);

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to fetch students");
      }

      const data = await response.json();

      setStudents(data);

    } catch (error) {

      setMessage(error.message);

    } finally {

      setLoading(false);

    }

  }


  // ==========================
  // 2. GET STUDENT BY ID
  // ==========================

  async function getStudentById() {

    if (!searchId.trim()) {
      setMessage("Please enter a student ID");
      return;
    }

    try {

      const response = await fetch(
        `${API_URL}/${searchId}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Student not found");
      }

      setStudents([data]);

      setMessage("Student found successfully");

    } catch (error) {

      setStudents([]);
      setMessage(error.message);

    }

  }


  // ==========================
  // 3. POST - ADD STUDENT
  // ==========================
let id=1;
  async function addStudent() {

    const studentData = {
      id,
      name,
      email,
      course
    };

    const response = await fetch(API_URL, {

      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify(studentData)

    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to add student");
    }

    setMessage(data.message);

    clearForm();

    await getStudents();

  }


  // ==========================
  // 4. EDIT BUTTON
  // ==========================

  function editStudent(student) {

    setEditId(student.id);

    setName(student.name);
    setEmail(student.email);
    setCourse(student.course);

    setMessage(`Editing student ID: ${student.id}`);

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  }


  // ==========================
  // 5. PUT - UPDATE STUDENT
  // ==========================

  async function updateStudent() {

    const studentData = {
      name,
      email,
      course
    };

    const response = await fetch(
      `${API_URL}/${editId}`,
      {
        method: "PUT",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify(studentData)
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to update student");
    }

    setMessage(data.message);

    clearForm();

    await getStudents();

  }


  // ==========================
  // 6. DELETE STUDENT
  // ==========================

  async function deleteStudent(id) {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmDelete) {
      return;
    }

    try {

      const response = await fetch(
        `${API_URL}/${id}`,
        {
          method: "DELETE"
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Delete failed");
      }

      setMessage(data.message);

      if (editId === id) {
        clearForm();
      }

      await getStudents();

    } catch (error) {

      setMessage(error.message);

    }

  }


  // ==========================
  // FORM SUBMIT
  // ==========================

  async function handleSubmit(e) {

    e.preventDefault();

    if (
      !name.trim() ||
      !email.trim() ||
      !course.trim()
    ) {

      setMessage("All fields are required");
      return;

    }

    try {

      setMessage("");

      if (editId === null) {

        await addStudent();

      } else {

        await updateStudent();

      }

    } catch (error) {

      setMessage(error.message);

    }

  }


  // ==========================
  // CLEAR FORM
  // ==========================

  function clearForm() {

    setName("");
    setEmail("");
    setCourse("");

    setEditId(null);

  }


  // ==========================
  // PAGE LOAD
  // ==========================

  useEffect(() => {

    getStudents();

  }, []);


  // ==========================
  // JSX DESIGN
  // ==========================

  return (

    <div className="container">

      <h1>Student Management System</h1>

      {message && (
        <p className="message">{message}</p>
      )}


      {/* ADD / UPDATE FORM */}

      <div className="form-box">

        <h2>
          {editId === null
            ? "Add New Student"
            : "Update Student"}
        </h2>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            placeholder="Enter Student Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="text"
            placeholder="Enter Course"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
          />

          <button type="submit">

            {editId === null
              ? "Add Student"
              : "Update Student"}

          </button>

          {editId !== null && (

            <button
              type="button"
              className="cancel-btn"
              onClick={clearForm}
            >
              Cancel Edit
            </button>

          )}

        </form>

      </div>


      {/* SEARCH BY ID */}

      <div className="search-box">

        <h2>Search Student by ID</h2>

        <input
          type="number"
          placeholder="Enter Student ID"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
        />

        <button onClick={getStudentById}>
          Search
        </button>

        <button onClick={() => {
          setSearchId("");
          getStudents();
        }}>
          Show All
        </button>

      </div>


      {/* STUDENTS TABLE */}

      <div className="table-box">

        <h2>Students List</h2>

        {loading ? (

          <p>Loading students...</p>

        ) : (

          <table>

            <thead>

              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Course</th>
                <th>Actions</th>
              </tr>

            </thead>

            <tbody>

              {students.length === 0 ? (

                <tr>
                  <td colSpan="5">
                    No Students Found
                  </td>
                </tr>

              ) : (

                students.map((student) => (

                  <tr key={student.id}>

                    <td>{student.id}</td>

                    <td>{student.name}</td>

                    <td>{student.email}</td>

                    <td>{student.course}</td>

                    <td>

                      <button
                        className="edit-btn"
                        onClick={() => editStudent(student)}
                      >
                        Edit
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() => deleteStudent(student.id)}
                      >
                        Delete
                      </button>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        )}

      </div>

    </div>

  );

}

export default Students;