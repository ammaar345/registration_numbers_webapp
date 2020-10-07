create table towns (id serial not null primary key , townName text,town text);
create table regNumbers (
id serial not null primary key,
regNumId int,
reg text,
foreign key (regNumId) references towns(id)
);
insert into towns(townName,town)VALUES('Cape Town','CA');
insert into towns(townName,town)VALUES('Paarl','CJ');
insert into towns(townName,town)VALUES('Bellville','CY');
-- //remove townName or town if not needed