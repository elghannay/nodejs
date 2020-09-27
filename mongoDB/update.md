#### using the \$inc operator.

> increment the age by two.

`db.users.updateOne({name : 'manuel'}, {$inc: {age : 2}})`

#### $min and $max.

> min will work only if the new value is less than the existing value.

> if the age is greater than 32 it will be updated

`db.users.updateOne({name : 'manuel'}, {$min: {age : 32}})`

#### deleting a field using \$unset.

> use $unset to delete a field and $set to add it.

> delete the field from multiple documents.

`db.users.updateMany({}, {$unset: {age : ""}})`

#### renaming a field.

`db.users.updateMany({}, {$rename: {age : "total age"}})`

#### using \$upsert: true

> can be really useful if you want to insert and update at the same time.

> if maria does not exist in the DB, upsert will add a document to the collection {name, age}

`db.users.updateOne({name: 'maria'}, {$set: {age : 34}}, {$upsert: true})`

#### update matched data in arrays

> updating arrays can be a little bit complex so first select the data that you want to target using the find() method then
> update it.

`db.users.find({hobbies: {$elemMatch: {title: "sports", frequency: {$gt: 3}}}})`

> then update it, notice the use of **\$**, it select the current element returned **from** **the first document** (the filter). only refers to the first match.

`db.users.updateMany({hobbies: {$elemMatch: {title: "sports", frequency: {$gt: 3}}}}, {$set:{hobbies.$.highFrequency: true}})`

> update all documents in an array.

> notice the use of **\$[]**
> it simply mean for each element returned

`db.users.updateMany({age: {$gt: 23}}, {$inc:{hobbies.$[].frequency: 1}})`

#### **arrayFilters** determines which array elements to update.

[more info can be found here](https://docs.mongodb.com/manual/reference/method/db.collection.updateMany/#examples)

> the filter by which you update documents and the filter by which you identify array elements you want to update does not have to be the same.

> the `findAndModify()` command modifies and returns a single document.

#### add a document to an array.

`db.users.updateOne({name: "maria"}, {$push: {hobbies: {title:"sports", frequency: 4}}})`

> add multiple documents to an array sorted by frequency

`db.users.updateMany({name: "maria"}, {$push: {hobbies: {$each: [{title:"sports", frequency: 4}, {title:"fishing", frequency: 1}], $sort:{frequency: -1}}}})`

#### remove elements from an array.

> use **\$pull**

`db.users.updateOne({name: "maria"}, {$pull: {hobbies: {title:"sports", frequency: 4}}})`

> to remove the last element from an array use **\$pop**
> the value of '1' pop the first element and '-1' pop the last element.

`db.users.updateOne({name: "maria"}, {$pop: {hobbies: 1}})`

#### \$addToSet

> add only unique data to your array and avoid inserting duplicates

`db.users.updateOne({name: "maria"}, {$addToSet: {hobbies: {title:"sports", frequency: 4}}})`

> the command will insert nothing if that document already exists in the array.

#### the set operator.

The `$set` stage is an alias for `$addFields`.

$set appends new fields to existing documents. You can include one or more $set stages in an aggregation operation.

[visit the docs](https://docs.mongodb.com/manual/reference/operator/aggregation/set/#pipe._S_set)

```js
db.scores.aggregate( [
   {
     $set: {
        totalHomework: { $sum: "$homework" },
        totalQuiz: { $sum: "$quiz" }
     }
   },
   {
     $set: {
        totalScore: { $add: [ "$totalHomework", "$totalQuiz", "$extraCredit" ] } }
   }
] )
```

If the field does not exist, `$set` will add a new field with the specified value

#### Example:

```js
db.members.updateMany(
   { },
   [
      { $set: { status: "Modified", comments: [ "$misc1", "$misc2" ], lastUpdate: "$$NOW" } },
      { $unset: [ "misc1", "misc2" ] }
   ]
)
```
The $set stage:

* creates a new array field comments whose elements are the current content of the misc1 and misc2 fields and
* sets the field lastUpdate to the value of the aggregation variable NOW. The aggregation variable NOW resolves to the current datetime value and remains the same throughout the pipeline.

To access **aggregation variables**, prefix the variable with double dollar signs **$$** and enclose in quotes.

Second Stage
The $unset stage removes the misc1 and misc2 fields.

#### Use $each with $addToSet Operator

The $each modifier is available for use with the $addToSet operator and the $push operator.

Use with the $addToSet operator to add multiple values to an array <field> if the values do not exist in the <field>.

`{ $addToSet: { <field>: { $each: [ <value1>, <value2> ... ] } } }`

Use with the $push operator to append multiple values to an array <field>.

`{ $push: { <field>: { $each: [ <value1>, <value2> ... ] } } }`

A collection inventory has the following document:

`{ _id: 2, item: "cable", tags: [ "electronics", "supplies" ] }`

Then the following operation uses the $addToSet operator with the $each modifier to add multiple elements to the tags array:

```js
db.inventory.update(
   { _id: 2 },
   { $addToSet: { tags: { $each: [ "camera", "electronics", "accessories" ] } } }
 )
 ```

the resulted array. use each with addToSet whenever possible since it delete duplicates

```js
 {
  _id: 2,
  item: "cable",
  tags: [ "electronics", "supplies", "camera", "accessories" ]
}
```