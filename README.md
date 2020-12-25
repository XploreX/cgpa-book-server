# cgpa-book-server
```
Disclaimer:
This project is not affiliated with GGSIPU or any other government entity.It is maintained by student volunteers only.
```
Easy to use API to retrieve information about courses, semesters, subjects and grading schema of 120+ GGSIPU (Guru Gobind Singh Indraprastha University) colleges .

## Table of Contents
- [Features](#features)
- [Documentation](#documentation)
- [License](#license)
- [Noticed any bugs or have any suggestions?](#noticed-any-bugs-or-have-any-suggestions)

### Features
- Informations like courses in college, branches in some course, semesters in a branch, subjects in some semester,
  grading schema of some semester can be easily retrieved
- Information can be searched by providing regular expressions for college, course, branch, semester etc
- Also supports conditional requests containing `If-Modified-Since` to support caching and go easy on bandwidth.

### Documentation
#### API base url: [https://api-rhapsody.herokuapp.com](https://api-rhapsody.herokuapp.com)

- Response from the API will always be in `json` format.
- All the criteria conditions have to be passed as url query parameter
- Data is said to satisfy given query parameters conditions if:
  - Values in query parameter is substring of the values in said data's parameters , for example , if query parameters are ,
    ```
    college: collegeName,
    course: courseName,
    branch: branchName
    ```
    And request is made to retrieve all information of a college, then information of first college that will satisfy **all
    query parameters** will be returned.   
    A college will be said to satisfy all these query parameters if , college name contains a substring `collegeName` **and**
    college contains any course such that 
      - course name have a substring `courseName` 
      - course have any branch that have a substring `branchName`
   - Value in query parameter matches value in said data's parameter exactly in case of numerical values (semester parameter)
- `ignorecase: true` query parameter can be added in the request to make all searches(college, course, branch, subject) case insensitive  
- All APIs support conditional requests containing `If-Modified-Since` header 
  
 <br /> 
 <br />
 
| Request Method| API endpoint                  | Brief description                                                                                                                 |
|---------------|-------------------------------|-----------------------------------------------------------------------------------------------------------------------------------|
|`GET`          |[/academia/college](#college-get)          | Get all information(courses, branches, semesters, grading schemas) of first college which satisfy given criterias                 |                
|`GET`          |[/academia/college-list](#college-list-get)     | Get list of all colleges supported by this api                                                                                    |
|`GET`          |[/academia/course](#course-get)           | Get all information(branches, semesters, grading schemas) of first course which satisfy given criterias                           |                  
|`GET`          |[/academia/course-list](#course-list-get)      | Get list of all courses of a college                                                                                              |   
|`GET`          |[/academia/branch](#branch-get)           | Get all information(semesters, grading schema) of first branch which satisfy given criterias                                      |       
|`GET`          |[/academia/branch-list](#branch-list-get)      | Get list of all branches of first course satisfying given criterias                                                               |   
|`GET`          |[/academia/semester]()         | Get all information(subjects, grading schema) of first semester which satisfy given criterias                                     |        
|`GET`          |[/academia/semester-list]()    | Get list of semesters of first branch satisfying given criterias                                                                  |   
|`GET`          |[/academia/subject]()          | Get all information(grading schema) of first subject which satisfy given criterias                                                |   
|`GET`          |[/academia/subject-list]()     | Get list of subjects of the first semester satisfying given criterias                                                             |   


#### /college `GET`

| Required url query parameters | Optional url query parameters |
| ------------------------------| ----------------------------- |
| college                       | course, branch, ignorecase    |


Information of first college which satisfy all the given query parameters is returned .

For examples , 
Sample Request: 
```
https://api-rhapsody.herokuapp.com/academia/college?college=university school of &course=bachelor&branch=computer&ignorecase=true
```

Query parameters passed in this request are:
```
college: university school of 
course: bachelor
branch: computer
ignorecase: true
```

 #### /college-list `GET`
 
 Returns list of colleges supported by this API .
 
 #### /course `GET`
 
| Required url query parameters | Optional url query parameters |
| ------------------------------| ----------------------------- |
| college, course               |  branch, ignorecase           |

Information of first course which satisfy all the given query parameters is returned.

#### /course-list `GET`

| Required url query parameters | Optional url query parameters |
| ------------------------------| ----------------------------- |
| college                       |                               |

Returns list of courses of first college which satisfy all the given query parameters.

#### /branch `GET`

| Required url query parameters | Optional url query parameters |
| ------------------------------| ----------------------------- |
| college, course, branch       | ignorecase                    |

Returns information of first branch which satisfy all the given query parameters.

#### /branch-list `GET`

| Required url query parameters | Optional url query parameters |
| ------------------------------| ----------------------------- |
| college, course               | ignorecase                    |

Returns list of branch of first course which satisfy all the given query parameters.

#### /semester `GET`

| Required url query parameters           | Optional url query parameters |
| ----------------------------------------| ----------------------------- |
| college, course, branch, semester       | ignorecase                    |

Returns information of first semester which satisfy all the given query parameters.

#### /semester-list `GET`

| Required url query parameters | Optional url query parameters |
| ------------------------------| ----------------------------- |
| college, course, branch       | ignorecase                    |

Returns list of semester of first branch which satisfy all the given query parameters.

### Noticed any bugs or have any suggestions?

Feel free to open up [issue](https://github.com/XploreX/cgpa-book-server/issues) and we will try to work on them

### License
This project is licensed under Apache-2.0 License. See the license [here](/LICENSE)
