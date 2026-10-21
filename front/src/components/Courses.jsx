import { useCallback, useEffect, useState } from "react";
import { deleteCourse, getCourses, updateCourse } from "../services/courseApi";

const emptyCourse = { code: "", title: "", credits: "" };

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [course, setCourse] = useState(emptyCourse);
  const [message, setMessage] = useState("");

  const loadCourses = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getCourses();
      if (!Array.isArray(response.data)) throw new Error("Expected an array of courses");
      setCourses(response.data);
    } catch (requestError) {
      console.error("Error loading courses:", requestError);
      setError("Unable to load courses. Check the backend and try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    async function fetchCourses() {
      try {
        const response = await getCourses();
        if (!Array.isArray(response.data)) throw new Error("Expected an array of courses");
        if (!ignore) setCourses(response.data);
      } catch (requestError) {
        console.error("Error loading courses:", requestError);
        if (!ignore) setError("Unable to load courses. Check the backend and try again.");
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    fetchCourses();
    return () => { ignore = true; };
  }, []);

  function handleEdit(selected) {
    setEditingId(selected.id);
    setCourse({
      code: String(selected.code ?? ""),
      title: String(selected.title ?? ""),
      credits: String(selected.credits ?? ""),
    });
    setMessage("");
    setError("");
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setCourse((previous) => ({ ...previous, [name]: value }));
  }

  async function handleUpdate(event) {
    event.preventDefault();
    const updated = {
      code: String(course.code ?? "").trim(),
      title: String(course.title ?? "").trim(),
      credits: Number(course.credits),
    };
    try {
      await updateCourse(editingId, updated);
      await loadCourses();
      setEditingId(null);
      setCourse(emptyCourse);
      setMessage("Course updated successfully.");
    } catch (requestError) {
      console.error("Error updating course:", requestError);
      setError("Unable to update course. Check the API response and try again.");
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this course? This action cannot be undone.")) return;
    try {
      await deleteCourse(id);
      await loadCourses();
      if (editingId === id) setEditingId(null);
      setMessage("Course deleted successfully.");
    } catch (requestError) {
      console.error("Error deleting course:", requestError);
      setError("Unable to delete course. Check the API response and try again.");
    }
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="#home" aria-label="Kabul University home">
          <span className="brand-mark">KU</span>
          <span><strong>Kabul University</strong><small>Faculty of Computer Science</small></span>
        </a>
        <span className="topbar-label">Enterprise Web App · Lab 01</span>
      </header>

      <section className="page-content container">
        <div className="page-heading">
          <div>
            <div className="eyebrow"><span className="live-dot" /> Academic catalog</div>
            <h1>Course management</h1>
            <p className="subtitle">Browse and maintain the courses offered by the faculty.</p>
          </div>
          <div className="term-chip"><span className="term-icon">▦</span><span><small>Catalog</small><strong>Course directory</strong></span></div>
        </div>

        {message && <div className="alert alert-success" role="status">{message}</div>}
        {error && <div className="alert alert-danger" role="alert"><span>{error}</span><button className="btn btn-sm btn-outline-danger" onClick={loadCourses}>Retry</button></div>}

        {editingId !== null && (
          <section className="card edit-card mb-4" aria-labelledby="edit-heading">
            <div className="card-header"><div><span className="section-kicker">Course details</span><h2 id="edit-heading">Edit course</h2></div><span className="edit-badge">Editing #{editingId}</span></div>
            <div className="card-body">
              <form onSubmit={handleUpdate}>
                <div className="row g-3">
                  <div className="col-md-3"><label className="form-label" htmlFor="course-code">Course code</label><input id="course-code" className="form-control" name="code" value={course.code} onChange={handleChange} required /></div>
                  <div className="col-md-5"><label className="form-label" htmlFor="course-title">Course title</label><input id="course-title" className="form-control" name="title" value={course.title} onChange={handleChange} required /></div>
                  <div className="col-md-2"><label className="form-label" htmlFor="course-credits">Credits</label><input id="course-credits" className="form-control" type="number" name="credits" min="1" value={course.credits} onChange={handleChange} required /></div>
                  <div className="col-md-2 d-flex align-items-end"><button type="submit" className="btn btn-primary w-100">Save changes <span aria-hidden="true">→</span></button></div>
                </div>
                <button type="button" className="btn btn-link cancel-button mt-3" onClick={() => { setEditingId(null); setCourse(emptyCourse); }}>Cancel editing</button>
              </form>
            </div>
          </section>
        )}

        <section className="card table-card" aria-labelledby="table-heading">
          <div className="card-header table-card-header">
            <div><span className="section-kicker">Academic programs</span><h2 id="table-heading">All courses</h2></div>
            <div className="count-pill"><span className="count-dot" />{courses.length} <span>courses</span></div>
          </div>
          {loading ? <div className="state-panel" role="status"><span className="spinner-border spinner-border-sm" />Loading courses…</div>
            : error ? <div className="state-panel muted-state">Course data is currently unavailable.</div>
              : courses.length === 0 ? <div className="state-panel muted-state">No courses available.</div>
                : <div className="table-responsive"><table className="table align-middle mb-0">
                  <thead><tr><th scope="col">ID</th><th scope="col">Code</th><th scope="col">Title</th><th scope="col">Credits</th><th scope="col" className="text-end">Actions</th></tr></thead>
                  <tbody>{courses.map((item) => <tr key={item.id}>
                    <td><span className="id-cell">{item.id}</span></td>
                    <td><span className="course-code">{String(item.code ?? "")}</span></td>
                    <td className="course-title">{item.title}</td>
                    <td><span className="credit-pill">{item.credits} <span>cr</span></span></td>
                    <td className="text-end action-cell"><button type="button" className="btn btn-sm btn-edit" onClick={() => handleEdit(item)} aria-label={`Edit ${item.code}`}>Edit</button><button type="button" className="btn btn-sm btn-delete" onClick={() => handleDelete(item.id)} aria-label={`Delete ${item.code}`}>Delete</button></td>
                  </tr>)}</tbody>
                </table></div>}
          <div className="table-footer"><span><span className="footer-dot" /> Live data from the course API</span><span>Showing {courses.length} {courses.length === 1 ? "course" : "courses"}</span></div>
        </section>
        <footer className="page-footer"><span>© Kabul University · Faculty of Computer Science</span><span>Course API <i /> Connected through REST</span></footer>
      </section>
    </main>
  );
}
