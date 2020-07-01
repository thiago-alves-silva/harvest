create database dbcontas
default char set utf8
default collate utf8_general_ci;

use dbcontas;

CREATE TABLE Funcionario (
    cod_func int auto_increment PRIMARY KEY,
    nome_fun varchar(60) not null,
    cpf_fun varchar(14) not null,
    telefone_fun varchar(15) not null,
    dt_nasc date not null,
    email_fun varchar(80) not null,
    senha_fun varchar(15) not null
)default char set utf8
default collate utf8_general_ci;

CREATE TABLE Cliente (
    cod_cli int auto_increment PRIMARY KEY,
    cod_func int not null,
    nome_cli varchar(80) not null,
    data_nasc date not null,
    cpf_cli varchar(14) not null,
    email_cli varchar(80) not null,
    endereco_cli varchar(100) not null,
    Foreign key (cod_func) references Funcionario(cod_func)
)default char set utf8
default collate utf8_general_ci;

CREATE TABLE Conta (
    cod_conta int auto_increment PRIMARY KEY,
    cod_func int not null,
    cod_cli int not null,
    data_venc date not null,
    desc_con varchar(60) not null,
    valor_con double(6,2) not null,
    tipo_con enum('P','R') not null,
    foreign key(cod_func) references Funcionario(cod_func),
    foreign key(cod_cli) references Cliente(cod_cli)
)default char set utf8
default collate utf8_general_ci;

CREATE TABLE Gerente (
    cod_gerente int auto_increment PRIMARY KEY,
    nome_fun varchar(80) not null,
    cpf_ger varchar(14) not null,
    telefone_ger varchar(14),
    dt_nasc date not null,
    email_ger varchar(100) not null,
    senha_ger varchar(15) not null
)default char set utf8
default collate utf8_general_ci;
 
delimiter %%
create trigger dropContas before delete on cliente
for each row
begin
delete from Conta where cod_cli = old.cod_cli;
end %%
delimiter ;