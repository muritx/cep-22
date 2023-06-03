import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Person } from 'src/app/models/person';
import { PersonService } from 'src/app/services/person-service';

@Component({
  selector: 'app-add-person',
  templateUrl: './add-person.component.html',
  styleUrls: ['./add-person.component.css']
})
export class AddPersonComponent {
  person: Person = new Person();

  @ViewChild("Person")
  Person!: NgForm;
  isSubmitted: boolean = false;

  constructor(private router: Router, private personService: PersonService) { }

  addPerson(isValid: any) {
    this.isSubmitted = true;
    if (isValid) {
      this.personService.create(this.person);
      console.log("Pessoa criada com sucesso!");
      
    }
  }

  newPerson(): void {
    this.isSubmitted = false;
    this.person = new Person();

  }

}
