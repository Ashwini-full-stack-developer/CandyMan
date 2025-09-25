Project --> Candy Man

• "Candy Man" is a project for an online store that sells candy and chocolates. The main purpose is to allow customers to order these treats online.

• For development we used technologys like CSS,React JS,SQL server, C sharp asp.Net core web API Development

• Weused MSSQLdatabase for storage and implemented the concepts like Storedprocigers, Joins.

• For Development we used the IDE’s called VS Code , Visual Studio.

Technologies Used : 
  • Frontend : HTML5 , CSS3 , Javascript , Tailwind CSS , React JS. 
  • Backend : C# ASP.Net Core web API. 
  • Database : MS SQL Server. 
  • Other Services : Email JS , Here Maps.

Frontend Concepts : 
  • React Routing , UseState() , UseEffect() , UseContext() , UseParam() , UseLocation() , UseNavigater() , Exception Handling CRUD Operations. 
Backend Concepts : 
  • Authorization and athentication : JSON web Token. 
Database Concepts :
  • The importent Tables are:
create table ProductTb(
	ProductID int identity(1,1) primary key not null,
	ProductName varchar(max) not null,
	ProductCost varchar(max) not null,
	ProductImage varbinary(max) not null,
	IsAvailable bit not null
);

create table BioData(
	BDID int identity(1,1) not null,
	UserName varchar(max) not null,
	ImageData varbinary(max) not null,
	Designation varchar(max) not null
);

create table OrderList
(
	OrderId int primary key identity(1,1) not null,
	ProductID int not null,
	UserName varchar(max) not null,
	State varchar(max) not null,
	District varchar(max) not null,
	Taluk varchar(max) not null,
	Vilage varchar(max) not null,
	Street varchar(max) not null,
	HousNumber varchar(max) not null
);
• The stored procedure we used :

create procedure InsertPersonBioData
@UserName varchar(max),
@ImageData varbinary(max),
@Designation varchar(max)
as begin
	insert into BioData(UserName,ImageData,Designation) values(@UserName,@ImageData,@Designation)
end


alter procedure InsertProduct
@ProductName varchar(max),
@ProductCost int,
@ProductImage varbinary(max),
@IsAvailable bit
 as begin 
	insert into ProductTb (ProductName,ProductCost,ProductImage,IsAvailable) values(@ProductName,@ProductCost,@ProductImage,@IsAvailable)
 end


 create procedure getAllProducts 
as begin 
	select ProductID,ProductName,ProductCost,ProductImage,IsAvailable from ProductTb
end


create procedure InsertOrders
@ProductID int,
@UserName varchar(max),
@State varchar(max),
@District varchar(max),
@Taluk varchar(max),
@Vilage varchar(max),
@Street varchar(max),
@HousNumber varchar(max)
as begin
	insert into OrderList (ProductID,UserName,State,District,Taluk,Vilage,Street,HousNumber) values(@ProductID,@UserName,@State,@District,@Taluk,@Vilage,@Street,@HousNumber)
end


