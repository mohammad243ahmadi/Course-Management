# Enterprise Web App — Course Management Lab

## Projects

- `back/` — Spring Boot 3 REST API, Java 17+, port 8080.
- `front/` — React 19 + Vite UI, port 5173.

The API starts with three in-memory sample courses. Updates and deletions are available for the edit/delete extension and last only until the backend restarts.

## Run the backend

From `back/` run `mvn spring-boot:run`. The course list is available at `http://localhost:8080/api/v1/courses`.

## Run the frontend

From `front/` run `npm install`, then `npm run dev`. Open `http://localhost:5173`.

The frontend reads the course API URL from `VITE_API_URL` when set; otherwise it uses `http://localhost:8080/api/v1/courses`. The backend allows the Vite origin `http://localhost:5173` through `@CrossOrigin`.

## Lab notes

`Courses.jsx` demonstrates `useEffect` for the initial fetch and `useState` for the fetched list, loading/error/form state. The table uses `map()` with each course ID as its stable key. `setCourses` stores the API response in React state and triggers a rerender. Postman is not subject to browser CORS enforcement, so an API request may work in Postman while the browser blocks it if the backend does not allow the frontend origin.

Student name: ____________________
