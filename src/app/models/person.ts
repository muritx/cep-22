export class Person {
  id?: string | null;

  //Dados pessoais
  cpf?: string;
  nome?: string;
  nascimento?: Date;
  sexo?: string;

  //Dados de contato
  email?: string;
  celular?: number;

  //Endereço
  cep?: number;
  logradouro?: string;
  numero?: number;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;

}
