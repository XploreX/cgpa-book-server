# cgpa-book-server
```
Disclaimer:
This project is not affiliated with GGSIPU or any other government entity.It is maintained by student volunteers only.
```
Easy to use API to retrieve information about courses, semesters, subjects and grading schema of 120+ IPU (Indrprastha Public University) colleges .

## Table of Contents
- [Features](#features)
- [Documentation](#documentation)
- [License](#license)


### Features
- Informations like courses in college, branches in some course, semesters in a branch, subjects in some semester,
  grading schema of some semester can be easily retrieved
- Information can be searched by providing regular expressions for college, course, branch, semester etc
- Also supports conditional requests containing `If-Modified-Since` to support caching and go easy on bandwidth.

### Documentation
#### API base url: [https://api-rhapsody.herokuapp.com](https://api-rhapsody.herokuapp.com)

- All the criteria conditions have to be passed as url query parameter
- All APIs support conditional requests containing `If-Modified-Since` header 
 <br /> 
 <br />
 
| Request Method| API endpoint                  | Brief description                                                                                                                 |
|---------------|-------------------------------|-----------------------------------------------------------------------------------------------------------------------------------|
|`GET`          |[/academia/college]()          | Get all information(courses, branches, semesters, grading schemas) of first college which satisfy given criterias                 |                
|`GET`          |[/academia/college-list]()     | Get list of all colleges supported by this api                                                                                    |
|`GET`          |[/academia/course]()           | Get all information(branches, semesters, grading schemas) of first course which satisfy given criterias                           |                  
|`GET`          |[/academia/course-list]()      | Get list of all courses of a college                                                                                              |   
|`GET`          |[/academia/branch]()           | Get all information(semesters, grading schema) of first branch which satisfy given criterias                                      |       
|`GET`          |[/academia/branch-list]()      | Get list of all branches of first course satisfying given criterias                                                               |   
|`GET`          |[/academia/semester]()         | Get all information(subjects, grading schema) of first semester which satisfy given criterias                                     |        
|`GET`          |[/academia/semester-list]()    | Get list of semesters of first branch satisfying given criterias                                                                  |   
|`GET`          |[/academia/subject]()          | Get all information(grading schema) of first subject which satisfy given criterias                                                |   
|`GET`          |[/academia/subject-list]()     | Get list of subjects of the first semester satisfying given criterias                                                             |   


#### /college `GET`

Required criterias: 
- college

Optional criterias:
- course
- branch
- semester
