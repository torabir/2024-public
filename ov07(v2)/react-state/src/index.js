import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { Component } from 'react-simplified';
import { NavLink, HashRouter, Route } from 'react-router-dom';
import { pool } from './mysql-pool';

class Menu extends Component {
  render() {
    return (
      <div>
        <NavLink exact to="/" activeStyle={{ color: 'darkblue' }}>
          StudAdm
        </NavLink>{' '}
        <NavLink to="/students" activeStyle={{ color: 'darkblue' }}>
          Students
        </NavLink>
        <NavLink to="/studieprogram" activeStyle={{ color: 'darkblue' }}>
          Studieprogram
        </NavLink>
      </div>
    );
  }
}

class Home extends Component {
  render() {
    return <div>Welcome to StudAdm</div>;
  }
}

class StudentList extends Component {
  students = [];

  render() {
    return (
      <ul>
        {this.students.map((student) => (
          <li key={student.id}>
            <NavLink to={'/students/' + student.id}>{student.name}</NavLink>
          </li>
        ))}
      </ul>
    );
  }

  mounted() {
    pool.query('SELECT id, name FROM Students', (error, results) => {
      if (error) return console.error(error); // If error, show error in console (in red text) and return

      this.students = results;
    });
  }
}

//Klasse for å hente ut studieProgram:

class studieProgram extends Component {
  studieProgrammer = [];

  render() {
    return (
      <ul>
        {this.studieProgrammer.map((studieprogram) => (
          <li key={studieprogram.studiekode}>
            <NavLink to={'/studieprogram/' + studieprogram.studiekode}>
              {studieprogram.studienavn}
            </NavLink>
          </li>
        ))}
      </ul>
    );
  }

  mounted() {
    pool.query('SELECT studiekode, studienavn FROM studieprogram', (error, results) => {
      if (error) return console.error(error);
      this.studieProgrammer = results;
    });
  }
}

class StudentDetails extends Component {
  student = null;

  render() {
    if (!this.student) return null;

    return (
      <ul>
        <li>Name: {this.student.name}</li>
        <li>Email: {this.student.email}</li>
        <li>Studieprogram: {this.student.studienavn}</li>
        <li>Studiekode: {this.student.studiekode}</li>
      </ul>
    );
  }

  //     Oppdaterer query: 'SELECT Students.name, Students.email, Students.studiekode, studieprogram.studienavn
  //      FROM Students
  //      JOIN studieprogram ON Students.studiekode = studieprogram.studiekode WHERE Students.id=?',

  mounted() {
    pool.query(
      'SELECT Students.name, Students.email, Students.studiekode, studieprogram.studienavn FROM Students JOIN studieprogram ON studieprogram.studiekode = Students.studiekode WHERE id=?',
      [this.props.match.params.id],
      (error, results) => {
        if (error) return console.error(error); // If error, show error in console (in red text) and return

        this.student = results[0];
      },
    );
  }
}

// klasse for å vise info om studieprogram (studenter tilknyttet studiet)

class studieProgramInfo extends Component {
  studieprogram = null;
  studenter = [];

  render() {
    if (!this.studieprogram) return null;

    return (
      <div>
        <ul>
          <li>Studiekode: {this.studieprogram.studiekode}</li>
          <li>Studienavn: {this.studieprogram.studienavn}</li>
          <li>Studenter: </li>
        </ul>
        <ul>
          {this.studenter.map((student) => (
            <li key={student.id}>{student.name}</li>
          ))}
        </ul>
      </div>
    );
  }

  mounted() {
    pool.query(
      'SELECT studiekode, studienavn FROM studieprogram WHERE studiekode=?',
      [this.props.match.params.studiekode],
      (error, results) => {
        if (error) return console.error(error);
        this.studieprogram = results[0];

        // Når studieprogram er satt, henter studenter:
        pool.query(
          'SELECT id, name FROM Students WHERE studiekode=?',
          [this.studieprogram.studiekode],
          (error, studentResults) => {
            if (error) return console.error(error);
            this.studenter = studentResults; // Sette studenter basert på det valgte studieprogrammet
          },
        );
      },
    );
  }
}

createRoot(document.getElementById('root')).render(
  <HashRouter>
    <div>
      <Menu />
      <Route exact path="/" component={Home} />
      <Route exact path="/students" component={StudentList} />
      <Route exact path="/students/:id" component={StudentDetails} />
      <Route exact path="/studieprogram" component={studieProgram} />
      <Route exact path="/studieprogram/:studiekode" component={studieProgramInfo} />
    </div>
  </HashRouter>,
);
