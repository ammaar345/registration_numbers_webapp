create table towns (id serial not null primary key , townName text,town text);



create table regNumbers (
id serial not null primary key,
regNum int,
reg text,
foreign key (regNum) references towns(id)
);

-- //remove townName or town if not needed