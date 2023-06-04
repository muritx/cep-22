export class Person {
  id?: string | null;

  //Dados pessoais
  cpf?: string;
  nome?: string;
  nascimento?: Date;
  sexo?: string;

  //Dados de contato
  email?: string;
  celular?: string;

  //Endereço
  cep?: string;
  logradouro?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;

}
