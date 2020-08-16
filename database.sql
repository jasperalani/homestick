create database homestick;

use homestick;

create table content
(
    identifier varchar(20)  null,
    text       varchar(255) null,
    constraint content_identifier_uindex
        unique (identifier)
);