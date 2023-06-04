import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { PersonService } from 'src/app/services/person-service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  peopleList: any = [];

  constructor(private router: Router, private personService: PersonService) { }

  ngOnInit(): void {
    this.getAll();

  }

  getAll(): void {
    this.personService.getAll().snapshotChanges().pipe(
      map(changes =>
        changes.map(
          c => (
            {
              id: c.payload.doc.id, ...c.payload.doc.data()
            }
          )
        )
      )).subscribe(data => {
          this.peopleList = data;
      }
    );

  }

  addPerson() {
    this.router.navigate(['create']);

  }

  deletePerson(id: string) {
    this.personService.delete(id);

  }

}
