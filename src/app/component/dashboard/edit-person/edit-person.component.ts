import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Person } from 'src/app/models/person';
import { PersonService } from 'src/app/services/person-service';

@Component({
  selector: 'app-edit-person',
  templateUrl: './edit-person.component.html',
  styleUrls: ['./edit-person.component.css']
})
export class EditPersonComponent implements OnInit {
  @Input() person?: Person;

  editingPerson: Person = {
    //Dados pessoais
    cpf: '',
    nome: '',
    nascimento: undefined,
    sexo: '',

    //Dados de contato
    email: '',
    celular: undefined,

    //Endereço
    cep: undefined,
    logradouro: '',
    numero: undefined,
    complemento: '',
    bairro: '',
    municipio: '',
    estado: ''
  }

  @ViewChild('Person')
  Person!: NgForm;

  isSubmitted: boolean = false;
  personId: any;

  constructor(private route: ActivatedRoute, private router: Router, private personService: PersonService) { }

  ngOnInit(): void {
    this.personId = this.route.snapshot.params['personId'];
    this.getPersonDetailsById(this.personId);

  }

  getPersonDetailsById(id: string) {
    this.personService.read(this.personId).subscribe(
      (data: any) => {
        if (data) {
          this.person = data.data();
          this.editingPerson = { ...this.person };
        }
      }
    )
    
  }

  editPerson(isValid: any) {
    this.isSubmitted = true;
    if (isValid) {
      this.personService.update(this.personId, this.editingPerson)
      .then(() => {
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 500);
      })
    }
  }

}
