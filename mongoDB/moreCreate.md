#### ordered and unordered inserts.

> usually works with insertMany([ ], { ordered: true | false })

> it dictate wether you want to process the other fields in your insert or not in case of an error(duplicate key ...).pretty()`

> ordered will stop inserting at the first error while unordered will insert everything except the erroneous data.

#### insert().

> is not recommended, since it does not add automatic ids. don't use it.

#### writeConcern.

`{ w: <value>, j: <boolean>, wtimeout: <number> }`

> is an additional configuration document that get added to the insertMany() and insertOne() object.

> the j indicate that the data will be written in a todo journal so in case of server failure the data will still be written on the disk.
> this is just a safety mechanism since writing directly on the disk is resource intensive and take a long time.
>
> **w : 1** : the storage engine should have accepted that write.
>
> **w : 0** : you don't know if your write has reached the server. no acknowledgment.

> **j : true** the journal is an additional file that keep track of the data that the storage engine need to write but it not have completed yet, is a backup for the steps that the server should do.

#### importing in mongo.

`mongoimport -d moviesData -c movies --jsonArray --drop tv-shows.json`

> mongoimport command was not available by default on the system (windows PC), so first download from the official website the additional tools provided by MongoDB this includes mongoimport and others that you may not need.

> after installation copy mongoimport.exe from "C:\Program Files\MongoDB\Tools" into the bin folder "C:\Program Files\MongoDB\Server\4.4\bin"

> navigate using your terminal to the folder where the json file you want to import is located then run your mongoimport command.

#### using operators.

> `$in` and `$nin` searches for values that are | not within the set(the range) of values that you have specified.

`db.movies.find({duration: {$in:[25, 30]})`

> the **\$or** and \$nor operator.

`db.movies.find({$or: [{"rating.average": {$gt:25}}, {"rating.average": {$lt:22}}]).pretty()`

> using the `$and` operator: you need an and operator if your query contain the same fields otherwise you don't need it. by default ON find method the queries are combined with an AND.

> the `$and` operator allow to add constrains to the same field.

`db.movies.find({$and: [{"genre": {$ne: null}}, {"genre": {$exists: true}]).pretty()`


`db.movies.find({$and: [{"genre": 'Drama'}, {"genre": "horror"}]).pretty()`

> but if expressed as below, it will return a wrong result.
> since the last document will overwrite the first one thus return only the movies where the genre is 'horror'

`db.movies.find({"genre": 'Drama'}, {"genre": "horror"}).pretty()`

> if the queries are different the `$and` is unnecessary: this will search for all the document that have a duration of 60 **and** a genre og horror.

`db.movies.find({"duration": '60'}, {"genre": "horror"}).pretty()`

> check for **existence** of a field.

`db.users.find({age :{$exists: true, $ne: null}}).pretty()`

> working with **types**.

`db.users.find({phone :{$type: ["double", "string"]}}).pretty()`

> using **regex** to search for text patterns is not performant.
> for a word 'festival' in a summary

`db.movies.find({"summary": {&regex: /festival/ }}).pretty()`

> search for a summary that has exactly one word 'festival'

`db.movies.find({"summary": 'festival').pretty()`

> return documents in the bios collection where the array size of contribs is 4:

> returns documents in the bios collection where the array field contribs contains the element "ALGOL" **or** "Lisp":

`db.bios.find( { contribs: { $in: [ "ALGOL", "Lisp" ]} } )`

> returns documents in the bios collection where the array field contribs contains the element "ALGOL" **and** "Lisp" without taking into consideration the existence of other elements nor the order 

`db.bios.find( { contribs: { $all: [ "ALGOL", "Lisp" ] } } )`

`db.bios.find( { contribs: { $size: 4 } } )`

#### querying arrays of embedded documents.

> use the dot notation with "" as if you are working with
> embedded documents

#### using **\$size** and **\$all**

> retrieve arrays that have exactly a certain size

`db.users.find({hobbies :{$ize: 3}}).pretty()`

> \$all omit the order see the docs for more details.

#### using **\$elemMatch**

> useful since **\$and** does not retrieve the exact **document** that satisfy both conditions.

```json
hobbies: [
    {
        title: "sports",
        frequency: 3
    },
    {
        title: "fishing",
        frequency: 1
    }
];
```

> the query below will retrieve any user that has a hobby with title of sports and frequency of 3 even if they are not in the same document

`db.users.find({$and :{'hobbies.title': 'sports'},{ 'hobbies.frequency': {$gte: 3}}}).pretty()`

> to make sure that you get the exact match reformulate the query using **\$elemMatch**

`db.users.find({hobbies :{$elemMatch: {title: "sports", frequency: {$gt: 3}}}}).pretty()`

> using projection with \$elemMatch
> filter for the movies that has a genre of drama and horror.

`db.movies.find({genre: 'drama'},{genre: {$elemMatch:{$eq : 'horror'}}}).pretty()`


The following example queries for documents where the dim_cm array contains elements that in some combination satisfy the query conditions; e.g., one element can satisfy the greater than 15 condition and another element can satisfy the less than 20 condition, or a single element can satisfy both:

`db.inventory.find( { dim_cm: { $gt: 15, $lt: 20 } } )`

The following example queries for documents where the dim_cm array contains at least one element that is both greater than ($gt) 22 and less than ($lt) 30:

`db.inventory.find( { dim_cm: { $elemMatch: { $gt: 22, $lt: 30 } } } )`

#### using the cursor methods.

> 1 sort ascending -1 descending.

`db.users.find().sort({"rating.average": 1, runtime: -1}).pretty()`

> what to do if you have pagination in your app? skip the previous 10 results.

**`db.users.find().sort({"rating.average": 1, runtime: -1}).skip(10).limit(10).pretty()`**

#### more on projection

`db.movies.find({},{name: 1, _id: 0, "rating.average": 1}).pretty()`

`db.bios.find( { }, { name: 1, contribs: 1 } )`

NOTE
> Unless the _id field is explicitly excluded in the projection document _id: 0, the _id field is returned.

#### **\$slice**

> return only the first two elements form the genre array.

`db.movies.find({"average.rating": {$gt: 9}},{genre: {$slice: 2}, name: 1}).pretty()`
