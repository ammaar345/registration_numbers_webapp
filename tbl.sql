create table towns (id serial not null primary key , townName text,town text);
create table regNumbers (
id serial not null primary key,
regNumId int,
reg text,
foreign key (regNumId) references towns(id)
);

-- //remove townName or town if not needed