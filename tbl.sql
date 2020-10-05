create table towns (id serial not null primary key , town text);
create table regNumbers (
id serial not null primary key,
regNum int,
foreign key (regNum) references towns(id)
);