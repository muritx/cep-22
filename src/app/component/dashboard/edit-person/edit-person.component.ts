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
    cidade: '',
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

    this.carregarEstados();

    // Adiciona evento de saída (blur) ao campo CEP
    const campoCEP = document.getElementById('cep') as HTMLInputElement;
    if (campoCEP) {
      campoCEP.addEventListener('blur', () => {
        const cep = campoCEP.value.replace('-', '');
        this.preencherCamposPorCEP(cep);
      });
    }

    const estadoSelect = document.getElementById("estado") as HTMLSelectElement;
    estadoSelect.addEventListener('change', () => {
      this.carregarCidades();
    });

    const cidadeSelect = document.getElementById("cidade") as HTMLSelectElement;
    cidadeSelect.addEventListener('change', () => {
      this.carregarRuas();
    });

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

  // Função para carregar os estados
  carregarEstados(): void {
    const estadoSelect = document.getElementById("estado") as HTMLSelectElement;
    const estadoResSelect = document.getElementById("estado-res") as HTMLSelectElement;

    // Faz a requisição para a API do IBGE para obter a lista de estados
    fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
      .then((response) => response.json())
      .then((data) => {
        // Preenche as opções do select de estados com base nos dados retornados
        data.forEach((estado: { sigla: string; nome: string }) => {
          const option = document.createElement("option");
          option.value = estado.sigla;
          option.textContent = estado.nome;
          estadoSelect.appendChild(option);
          estadoResSelect.appendChild(option.cloneNode(true) as HTMLOptionElement);
        });
      })
      .catch((error) => {
        console.log("Erro na requisição:", error);
      });
  };

  // Função para carregar as cidades de acordo com o estado selecionado
  carregarCidades(): void {
    const estadoSelect = document.getElementById("estado") as HTMLSelectElement;
    const cidadeSelect = document.getElementById("cidade") as HTMLSelectElement;
    const estadoSigla = estadoSelect.value;

    // Limpa as opções do select de cidades
    cidadeSelect.innerHTML = "";

    if (!estadoSigla) {
      // Estado não selecionado
      return;
    }

    // Faz a requisição para a API do IBGE para obter as cidades do estado selecionado
    fetch(
      `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estadoSigla}/municipios`
    )
      .then((response) => response.json())
      .then((data) => {
        // Preenche as opções do select de cidades com base nos dados retornados
        data.forEach((cidade: { nome: string }) => {
          const option = document.createElement("option");
          option.value = cidade.nome;
          option.textContent = cidade.nome;
          cidadeSelect.appendChild(option);

        });
      })
      .catch((error) => {
        console.log("Erro na requisição:", error);
      });
  };

  // Função para carregar as ruas
  carregarRuas(): void {
    const estadoSelect = document.getElementById("estado") as HTMLSelectElement;
    const cidadeSelect = document.getElementById("cidade") as HTMLSelectElement;
    const ruaInput = document.getElementById("rua") as HTMLInputElement;
    const estadoSigla = estadoSelect.value;
    const cidadeNome = cidadeSelect.value;
    const ruaNome = ruaInput.value.trim();

    // Verifica se estado, cidade e nome da rua foram selecionados
    if (!estadoSigla || !cidadeNome || !ruaNome) {
      return;
    }

    // Formata o nome da cidade para inclusão na URL
    const cidadeFormatada = cidadeNome.replace(" ", "%20");

    // Monta a URL com os valores selecionados
    const url = `https://viacep.com.br/ws/${estadoSigla}/${cidadeFormatada}/${ruaNome}/json/`;

    // Faz a requisição para a API do ViaCEP
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        // Limpa a lista de ruas
        const listaRuas = document.getElementById("lista-ruas");
        if (listaRuas) {
          listaRuas.innerHTML = "";
        }

        // Verifica se a resposta da API contém ruas
        if (Array.isArray(data) && data.length > 0) {
          // Adiciona cada rua à lista
          data.forEach((rua: { cep?: string; logradouro?: string; bairro?: string }) => {
            const li = document.createElement("li");
            const cep = rua.cep ? rua.cep : "CEP não disponível";
            const logradouro = rua.logradouro ? rua.logradouro : "Logradouro não disponível";
            const bairro = rua.bairro ? rua.bairro : "Bairro não disponível";
            const endereco = `${logradouro} - Bairro: ${bairro} - CEP: ${cep}`;
            li.textContent = endereco;

            li.addEventListener("click", () => {
              if (rua.cep) {
                this.preencherCamposEndereco(rua);
              }
            });

            if (listaRuas) {
              listaRuas.appendChild(li);
            }
          });
        } else {
          // Nenhuma rua encontrada
          const mensagem = document.createElement("li");
          mensagem.textContent = "Nenhuma rua encontrada.";
          if (listaRuas) {
            listaRuas.appendChild(mensagem);
          }
        }
      })
      .catch((error) => {
        console.log("Erro na requisição:", error);
      });
  };

  // Função para preencher os campos do formulário com o endereço selecionado
  preencherCamposEndereco = (endereco: {
    cep?: string;
    logradouro?: string;
    bairro?: string;
    cidade?: string;
    estado?: string;

  }): void => {
    const cepInput = document.getElementById("cep") as HTMLInputElement;
    const logradouroInput = document.getElementById("logradouro") as HTMLInputElement;
    const bairroInput = document.getElementById("bairro") as HTMLInputElement;
    const cidadeInput = document.getElementById("cidade-res") as HTMLInputElement;
    const estadoInput = document.getElementById("estado-res") as HTMLInputElement;

    cepInput.value = endereco.cep || "";
    logradouroInput.value = endereco.logradouro || "";
    bairroInput.value = endereco.bairro || "";
    cidadeInput.value = endereco.cidade || "";
    estadoInput.value = endereco.estado || "";

  };

  // Função para preencher os campos do formulário com base no CEP
  preencherCamposPorCEP = (cep: string): void => {
    const cepFormatado = cep.replace(/\D/g, "");

    if (cepFormatado.length !== 8) {
      return;
    }

    // Faz a requisição para a API do ViaCEP para obter o endereço com base no CEP
    fetch(`https://viacep.com.br/ws/${cepFormatado}/json/`)
      .then((response) => response.json())
      .then((data) => {
        if (data.erro) {
          console.log("CEP não encontrado");
          return;
        }

        this.preencherCamposEndereco(data);
      })
      .catch((error) => {
        console.log("Erro na requisição:", error);
      });
  };

}
