create table regNumbers (
id serial not null primary key,
registration,
regNum int,
foreign key (regNum) references towns(id)
);

create table towns (id serial not null primary key , town text);