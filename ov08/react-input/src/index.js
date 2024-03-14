import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { Component } from 'react-simplified';
import { NavLink, HashRouter, Route } from 'react-router-dom';
import { studentService, studieProgramService } from './services';
import { createHashHistory } from 'history';

const history = createHashHistory(); // Use history.push(...) to programmatically change path, for instance after successfully saving a student

class Menu extends Component {
  render() {
    return (
      <div>
        <NavLink exact to="/" activeStyle={{ color: 'darkblue' }}>
          StudAdm
        </NavLink>
        {' ' /* Add extra space between menu items */}
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
      <div>
        <ul>
          {this.students.map((student) => (
            <li key={student.id}>
              <NavLink to={'/students/' + student.id + '/edit'}>{student.name}</NavLink>
            </li>
          ))}
        </ul>{' '}
        {/* lager oppsett for å legge til student: */}
        <ul></ul>
      </div>
    );
  }

  mounted() {
    studentService.getStudents((students) => {
      this.students = students;
    });
  }
}

// vise studieprogram:

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
    studieProgramService.getStudieProgrammer((egg) => {
      this.studieProgrammer = egg;
    });
  }
}

class StudentEdit extends Component {
  student = null;
  studieprogrammer = [];

  render() {
    if (!this.student || !this.studieprogrammer.length) return null;

    return (
      <div>
        Name:{' '}
        <input
          type="text"
          value={this.student.name}
          onChange={(event) => (this.student.name = event.currentTarget.value)}
        />
        Email:{' '}
        <input
          type="text"
          value={this.student.email}
          onChange={(event) => (this.student.email = event.currentTarget.value)}
        />
        Studieprogram:
        <select
          value={this.student.studiekode || 'ikke valgt'}
          onChange={(event) =>
            (this.student.studiekode =
              event.currentTarget.value === 'ikke valgt' ? null : event.currentTarget.value)
          }
        >
          <option value="ikke valgt">Ikke valgt</option>
          {this.studieprogrammer.map((program) => (
            <option key={program.studiekode} value={program.studiekode}>
              {program.studienavn}
            </option>
          ))}
        </select>
        <button type="button" onClick={this.save}>
          Save
        </button>
        <button type="button" onClick={this.deleteStudent}>
          Delete
        </button>
      </div>
    );
  }

  mounted() {
    studentService.getStudent(this.props.match.params.id, (eggeg) => {
      this.student = eggeg;
    });
    studieProgramService.getStudieProgrammer((lol) => {
      this.studieprogrammer = lol;
    });
  } // jeg skriver rare ord for å skille hva som er hva. Det burde egentlig stått feks "student", ikke "eggeg"

  save() {
    studentService.updateStudent(this.student, () => {
      history.push('/students');
    });
    /*     studieProgramService.updateStudentStudie(this.studieprogram, () => {
      history.push('/studieprogram');
    }); */
  }

  // slette student:
  deleteStudent() {
    studentService.deleteStudent(this.student.id, () => {
      history.push('/students');
    });
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
        <button type="button" onClick={this.deleteStudieProgram}>
          delete
        </button>
      </div>
    );
  }

  mounted() {
    studieProgramService.getStudieProgramInfo(
      this.props.match.params.studiekode,
      (studieprogram) => {
        this.studieprogram = studieprogram;
        studieProgramService.getStudenterForStudieprogram(
          this.studieprogram.studiekode,
          (studenter) => {
            this.studenter = studenter;
          },
        );
      },
    );
  }

  // slette studieprogram:
  deleteStudieProgram() {
    studieProgramService.deleteStudieProgram(this.studieprogram.studiekode, () => {
      history.push('/studieprogram');
    });
  }

  /*   mounted() {
    studieProgramService.getStudieProgramInfo((eggeg) => {
      this.studieprogram = eggeg;
    });
    studieProgramService.getStudieProgrammer((lol) => {
      this.studieprogrammer = lol;
    });
  } */
}

createRoot(document.getElementById('root')).render(
  <HashRouter>
    <Menu />
    <Route exact path="/" component={Home} />
    <Route exact path="/students" component={StudentList} />
    <Route path="/students/:id/edit" component={StudentEdit} />
    <Route exact path="/studieprogram" component={studieProgram} />
    <Route exact path="/studieprogram/:studiekode" component={studieProgramInfo} />
  </HashRouter>,
);
