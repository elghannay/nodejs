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

```json
db.students.insert([
  { "_id": 1, "grades": [95, 92, 90] },
  { "_id": 2, "grades": [98, 100, 102] },
  { "_id": 3, "grades": [95, 110, 100] }
])
```

```js
db.runCommand({
  findAndModify: 'students',
  query: { grades: { $gte: 100 } },
  update: { $set: { 'grades.$[element]': 100 } },
  arrayFilters: [{ element: { $gte: 100 } }],
});
```

> the filter by which you update documents and the filter by which you identify array elements you want to update does not have to be the same.

> the `findAndModify()` command modifies and returns a single document.

#### add data to an array.
