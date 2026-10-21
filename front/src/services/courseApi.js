import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080/api/v1/courses";

export const getCourses = () => axios.get(API_URL);
export const updateCourse = (id, course) => axios.put(`${API_URL}/${id}`, course);
export const deleteCourse = (id) => axios.delete(`${API_URL}/${id}`);
