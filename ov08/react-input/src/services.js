import { pool } from './mysql-pool';

// endret fra Studens til StudentsView

class StudentService {
  getStudents(success) {
    pool.query('SELECT * FROM StudentsView', (error, results) => {
      if (error) return console.error(error);

      success(results);
    });
  }

  getStudent(id, success) {
    pool.query('SELECT * FROM StudentsView WHERE id=?', [id], (error, results) => {
      if (error) return console.error(error);

      success(results[0]);
    });
  }

  //slette student:
  deleteStudent(id, success) {
    pool.query('DELETE FROM Students WHERE id=?', [id], (error, results) => {
      if (error) return console.error(error);

      success(results[0]);
    });
  }

  updateStudent(student, success) {
    pool.query(
      'UPDATE Students SET name=?, email=?, studiekode=? WHERE id=?',
      [student.name, student.email, student.studiekode, student.id],
      (error, results) => {
        if (error) return console.error(error);

        success();
      },
    );
  }
}

export let studentService = new StudentService();

// nye pool.queries for å hente info om studiene fra databasen

class StudieProgramService {
  getStudieProgrammer(success) {
    pool.query('SELECT studiekode, studienavn FROM studieprogram', (error, results) => {
      if (error) return console.error(error);

      success(results);
    });
  }

  getStudieProgramInfo(studiekode, success) {
    pool.query(
      'SELECT studiekode, studienavn FROM studieprogram WHERE studiekode=?',
      [studiekode],
      (error, results) => {
        if (error) return console.error(error);

        success(results[0]);
      },
    );
  }

  getStudenterForStudieprogram(studiekode, success) {
    pool.query(
      'SELECT id, name FROM Students WHERE studiekode = ?',
      [studiekode],
      (error, results) => {
        if (error) return console.error(error);

        success(results);
      },
    );
  }

  deleteStudieProgram(studiekode, success) {
    pool.query('DELETE FROM studieprogram WHERE studiekode=?', [studiekode], (error, results) => {
      if (error) return console.error(error);

      success(results);
    });
  }
}

export let studieProgramService = new StudieProgramService();
