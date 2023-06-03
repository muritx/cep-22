import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Person } from 'src/app/models/person';
import { PersonService } from 'src/app/services/person-service';

@Component({
  selector: 'app-view-person',
  templateUrl: './view-person.component.html',
  styleUrls: ['./view-person.component.css']
})
export class ViewPersonComponent implements OnInit {
  @Input() person?: Person;

  personDetails: any = [];

  @ViewChild('Person')
  Person!: NgForm;

  isSubmitted: boolean = true;
  personId: any;

  constructor(private route: ActivatedRoute, private router: Router, private personService: PersonService) { }

  ngOnInit(): void {
    this.personId = this.route.snapshot.params['personId'];
    this.getPersonDetailsById(this.personId);

  }

  getPersonDetailsById(id: string) {
    this.personService.read(id).subscribe(
      (data: any) => {
        if(data) {
          this.personDetails = data.data();
        }
      }
    );

  }

}
