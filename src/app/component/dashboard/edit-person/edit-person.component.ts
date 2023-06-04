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

  validCPF: boolean = false;
  validCelular: boolean = false;

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

  validateCPF(cpf: string): boolean {
    let soma = 0;

    // Verifica se o CPF é indefinido
    if (cpf === undefined) {
      return this.validCPF = false;

    }

    // Remove os caracteres . e - do CPF, deixando apenas os números
    const strCPF = cpf.replace('.', '').replace('.', '').replace('-', '');

    // Testa sequências que possuem todos os dígitos iguais e verifica se o CPF possui 11 dígitos
    if (
      strCPF === '00000000000' ||
      strCPF === '11111111111' ||
      strCPF === '22222222222' ||
      strCPF === '33333333333' ||
      strCPF === '44444444444' ||
      strCPF === '55555555555' ||
      strCPF === '66666666666' ||
      strCPF === '77777777777' ||
      strCPF === '88888888888' ||
      strCPF === '99999999999' ||
      strCPF.length !== 11

    ) {
      return this.validCPF = false;

    }

    // Multiplica cada dígito por números de 1 a 9, soma-os e multiplica-os por 10.
    // Depois, divide o resultado encontrado por 11 para encontrar o resto
    for (let i = 1; i <= 9; i++) {
      soma += parseInt(strCPF.substring(i - 1, i)) * (11 - i);

    }

    let resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) {
      resto = 0;

    }

    if (resto !== parseInt(strCPF.substring(9, 10))) {
      return this.validCPF = false;

    }

    soma = 0;
    for (let k = 1; k <= 10; k++) {
      soma += parseInt(strCPF.substring(k - 1, k)) * (12 - k);

    }

    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) {
      resto = 0;

    }

    if (resto !== parseInt(strCPF.substring(10, 11))) {
      return this.validCPF = false;

    }

    return this.validCPF = true;
  }

  formatCellphone(event: any): boolean {
    const value = event.target.value || '';
    const cleaned = value.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{11})$/);
    if (match) {
      const formatted = `(${match[1].substr(0, 2)}) ${match[1].substr(2, 5)}-${match[1].substr(7, 4)}`;
      this.editingPerson.celular = formatted;
      return this.validCelular = true;
    } else {
      return this.validCelular = false;
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

  // Função para preencher os campos do formulário com o endereço selecionado
  preencherCamposEndereco = (dataVIACEP: {
    cep?: string;
    logradouro?: string;
    bairro?: string;
    localidade?: string;
    uf?: string;

  }): void => {
    const cepInput = document.getElementById("cep") as HTMLInputElement;
    const logradouroInput = document.getElementById("logradouro") as HTMLInputElement;
    const bairroInput = document.getElementById("bairro") as HTMLInputElement;
    const cidadeInput = document.getElementById("cidade-res") as HTMLInputElement;
    const estadoInput = document.getElementById("estado-res") as HTMLInputElement;

    cepInput.value = dataVIACEP.cep || "";
    logradouroInput.value = dataVIACEP.logradouro || "";
    bairroInput.value = dataVIACEP.bairro || "";
    cidadeInput.value = dataVIACEP.localidade || "";
    estadoInput.value = dataVIACEP.uf || "";

    // Atribuir os valores ao objeto 'person'
    this.editingPerson.cep = cepInput.value || "";
    this.editingPerson.logradouro = logradouroInput.value || "";
    this.editingPerson.bairro = bairroInput.value || "";
    this.editingPerson.cidade = cidadeInput.value || "";
    this.editingPerson.estado = estadoInput.value || "";

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
          data.forEach((rua: { cep?: string; logradouro?: string; bairro?: string; cidade?: string; estado?: string }) => {
            const li = document.createElement("li");
            li.classList.add("rua-item"); // Adicione uma classe para estilização opcional

            const cep = rua.cep ? rua.cep : "CEP não disponível";
            const logradouro = rua.logradouro ? rua.logradouro : "Logradouro não disponível";
            const bairro = rua.bairro ? rua.bairro : "Bairro não disponível";

            // Crie elementos HTML para exibir as informações separadamente
            const cepElement = document.createElement("span");
            cepElement.textContent = `CEP: ${cep}`;

            const logradouroElement = document.createElement("span");
            logradouroElement.textContent = ` - Rua: ${logradouro}`;

            const bairroElement = document.createElement("span");
            bairroElement.textContent = ` - Bairro: ${bairro}`;

            // Adicione os elementos à lista
            li.appendChild(cepElement);
            li.appendChild(logradouroElement);
            li.appendChild(bairroElement);

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

}
