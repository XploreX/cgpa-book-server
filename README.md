# cgpa_book_server #Under testing

### This readme at the moment will just briefly explain how to use the api to access , update and create college databases

In general ,

**Get Methods** are used to retrieve data

**Post Methods** are used to insert new data

**Put Methods** are used to update existing data

**Delete Methods** are used to delete existing data

All the data and query information should be sent in json format in the body of request and `content-type` header should be set to `application/json`.

#### To retrieve data

All these api calls require query information in body of the request . Matching of queries is done through regex , regex follow usual javascript RegExp notation ,
there is no way and no need of using grouping through parentheses , thus `(` , `)` will not be considered special characters in query .

All these api also returns `Last-Modified` in response headers , which is date-time string containing information when was the requested content last updated.

Ordinal Variable objects in the document = `[College , course , branch , semester , subject ]`

API URLs ending with `-list` , return json array of asked values with no additional information .

API URLs ending with one of the ordinal variable return json dictionary containing all the information available of the first match satisfying provided query object.
For ordinal variable `var` , query object should contain all the ordinal variables which comes before `var` in ordinal variable order presented in last paragraph

##### How to describe query object

query object should be dictionary where each key represents either a query or some property which will directly or indirectly effect the querying process .

Currently query object supports following keys :

`college` : RegExp of college name

`course` : RegExp of course name

`branch` : RegExp of branch name

`semester` : RegExp of semester number

`subject` : RegExp of subject name

`ignorecase` : if true , then `ignorecase` flag will be used with all the queries used for matching

[https://cgpa-book.herokuapp.com/academia/college-list](https://cgpa-book.herokuapp.com/academia/college-list) : Get json array of college names satisfying provided query

[https://cgpa-book.herokuapp.com/academia/branch-list](https://cgpa-book.herokuapp.com/academia/branch-list) : Get json array of branch names of a particular college and course satisfying provided query

[https://cgpa-book.herokuapp.com/academia/semester-list](https://cgpa-book.herokuapp.com/academia/semester-list) : Get json array of semester numbers of a particular college,course and branch satisfying provided query

[https://cgpa-book.herokuapp.com/academia/college](https://cgpa-book.herokuapp.com/academia/college) : Get complete data of first college satisfying provided query

[https://cgpa-book.herokuapp.com/academia/course](https://cgpa-book.herokuapp.com/academia/branch-list) : Get complete data of first course satisfying provided query

[https://cgpa-book.herokuapp.com/academia/branch](https://cgpa-book.herokuapp.com/academia/branch) : Get complete data of first branch satisfying provided query

[https://cgpa-book.herokuapp.com/academia/semester](https://cgpa-book.herokuapp.com/academia/semester) : Get complete data of first semester satisfying provided query

##### Examples

To get all branches of a course ,json query object should look like ,

{

college : college_name_RegExp,

course : course_name_RegExp,

ignorecase : true

}

and api call should be made to [https://cgpa-book.herokuapp.com/academia/branch-list](https://cgpa-book.herokuapp.com/academia/branch-list)

To get complete grading information of a semester ,json query object should look like ,

{

college : college_name_RegExp,

course : course_name_RegExp,

branch : branch_name_RegExp,

semester : semester_number,

ignorecase : true

}

and api call should be made to [https://cgpa-book.herokuapp.com/academia/semester](https://cgpa-book.herokuapp.com/academia/semester)
