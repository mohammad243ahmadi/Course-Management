package edu.kabuluniversity.courseapi;

import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.atomic.AtomicLong;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/courses")
@CrossOrigin(origins = "http://localhost:5173")
public class CourseController {
    private final List<Course> courses = new CopyOnWriteArrayList<>(List.of(
        new Course(1, "EWA301", "Enterprise Web App", 3),
        new Course(2, "DB201", "Database Systems", 3),
        new Course(3, "SE202", "Software Engineering", 3)
    ));
    private final AtomicLong nextId = new AtomicLong(4);

    @GetMapping
    public List<Course> getCourses() {
        return List.copyOf(courses);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Course> updateCourse(@PathVariable long id, @RequestBody CourseRequest request) {
        if (request.code() == null || request.code().isBlank() || request.title() == null
                || request.title().isBlank() || request.credits() < 1) {
            return ResponseEntity.badRequest().build();
        }
        for (int i = 0; i < courses.size(); i++) {
            if (courses.get(i).id() == id) {
                Course updated = new Course(id, request.code().trim(), request.title().trim(), request.credits());
                courses.set(i, updated);
                return ResponseEntity.ok(updated);
            }
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCourse(@PathVariable long id) {
        boolean removed = courses.removeIf(course -> course.id() == id);
        return removed ? ResponseEntity.noContent().build() : ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }
}
