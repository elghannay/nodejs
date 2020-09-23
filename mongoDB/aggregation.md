#### why using an aggregation framework.

> you may have an online shop, so from a data modeling perspective you will prioritize efficiency of data retrieval for your customer and you may have a data scientist that also to work with that data but maybe not in that format, so aggregation framework gives you the ability to format your data based on your needs.

#### \$group

> sum the population of a state.

```js
db.persons
  .aggregate([
    { $match: { gender: 'female' } },
    {
      $group: { _id: { state: '$location.state' }, totalPersons: { $sum: 1 } },
    },
  ])
  .pretty();
```

> then sort the returned output from the group stage, the sort stage must happen after the grouping, otherwise we will sort the entire documents

```js
db.persons
  .aggregate([
    { $match: { gender: 'female' } },
    {
      $group: { _id: { state: '$location.state' }, totalPersons: { $sum: 1 } },
    },
    { $sort: { totalPersons: -1 } },
  ])
  .pretty();
// sort in descending order.
```

> the **\$** refers to the field from the document and that it should take the value of that field instead.

> The $group stage has a limit of 100 megabytes of RAM. By default, if the stage exceeds this limit, $group returns an error. To allow for the handling of large datasets, set the allowDiskUse option to true.

#### \$project

> project works the same as projection in the find method.

```js
db.persons
  .aggregate([
    {
      $project: {
        _id: 0,
        name: 1,
        email: 1,
        birthdate: { $convert: { input: '$dob.date', to: 'date' } },
        // if you won't make use of the onError and onNull use
        // the shortcuts like $toDate,   birthdate: { $toDate: '$dob.date' },
        age: '$dob.age',
        location: {
          type: 'Point',
          coordinates: [
            {
              $convert: {
                input: '$location.coordinates.longitude',
                to: 'double',
                onError: 0.0,
                onNull: 0.0,
              },
            },
            {
              $convert: {
                input: '$location.coordinates.latitude',
                to: 'double',
                onError: 0.0,
                onNull: 0.0,
              },
            },
          ],
        },
      },
    },
    {
      $project: {
        gender: 1,
        email: 1,
        location: 1,
        birthdate: 1,
        age: 1,
        fullName: {
          $concat: [
            { $toUpper: { $substrCP: ['$name.first', 0, 1] } },
            {
              $substrCP: [
                '$name.first',
                1,
                { $subtract: [{ $strLenCP: '$name.first' }, 1] },
              ],
            },
            ' ',
            { $toUpper: { $substrCP: ['$name.last', 0, 1] } },
            {
              $substrCP: [
                '$name.last',
                1,
                { $subtract: [{ $strLenCP: '$name.last' }, 1] },
              ],
            },
          ],
        },
      },
    },
    {
      $group: {
        _id: { birthYear: { $isoWeekYear: '$birthdate' } },
        numPersons: { $sum: 1 },
      },
    },
    { $sort: { numPersons: -1 } },
  ])
  .pretty();
```

> with project, we can add new fields.
> IF YOU intend to format your data store it properly in the first place.
> `fullName: {$concat: ["$name.first", " ", "$name.last"]}`

# sample data for the next examples

```json
[
  {
    "name": "Max",
    "hobbies": ["Sports", "Cooking"],
    "age": 29,
    "examScores": [
      { "difficulty": 4, "score": 57.9 },
      { "difficulty": 6, "score": 62.1 },
      { "difficulty": 3, "score": 88.5 }
    ]
  },
  {
    "name": "Manu",
    "hobbies": ["Eating", "Data Analytics"],
    "age": 30,
    "examScores": [
      { "difficulty": 7, "score": 52.1 },
      { "difficulty": 2, "score": 74.3 },
      { "difficulty": 5, "score": 53.1 }
    ]
  },
  {
    "name": "Maria",
    "hobbies": ["Cooking", "Skiing"],
    "age": 29,
    "examScores": [
      { "difficulty": 3, "score": 75.1 },
      { "difficulty": 8, "score": 44.2 },
      { "difficulty": 6, "score": 61.5 }
    ]
  }
]
```

#### \$group in depth

```js
db.friends
  .aggregate([
    { $unwind: '$hobbies' }, // flattens the array.
    { $group: { _id: { age: '$age' }, allHobbies: { $push: '$hobbies' } } },
    // $push can create duplicate use $addToSet instead
  ])
  .pretty();
```

> using \$addToSet

```js
db.friends
  .aggregate([
    { $unwind: '$hobbies' },
    { $group: { _id: { age: '$age' }, allHobbies: { $addToSet: '$hobbies' } } },
  ])
  .pretty();
```

#### getting the first element of an array.

```js
db.friends
  .aggregate([
    { $project: { _id: 0, examScore: { $slice: ['$examScores', 1] } } },
  ])
  .pretty();
```

NOTE : `$slice` is different than array.prototype.slice() of js.

> Specifies the number of elements to return

- Specify a positive number n to return the first n elements.
- Specify a negative number n to return the last n elements.

> so basically in the example we are returning the first element in the array

> `["$examScores", 2, 1]` start at position two and return me the first element.

#### get the size of an array

```js
db.friends
  .aggregate([{ $project: { _id: 0, numScores: { $size: '$examScores' } } }])
  .pretty();
```

> the size operator points to the field that contains the array.

#### \$filter arrays

> \$filter Selects a subset of the array to return an array with only the elements that match the filter condition.
> filter for document in the projection phase.

```js
db.friends
  .aggregate([
    {
      $project: {
        _id: 0,
        scores: {
          $filter: {
            input: '$examScores',
            // point to a field in my document
            as: 'sc',
            cond: { $gt: ['$$sc.score', 60] },
            // one $ will only for a field called 'sc'
          },
        },
      },
    },
  ])
  .pretty();
```

> filter needs a temporary variable, in our case 'sc' that contains the values of the field ExamScore.

> we transform the arrayScore array to see return higher than 60

> **NOTE** the double \$$ refer to the temporary Variable that we've just retrieved, $gt takes an array of values that should be compared.

> **\$** refers to the values of the field, and without it we point to the field itself like in the sort example bellow.

#### sort students by their highest score.

```js
db.friends
  .aggregate([
    { $unwind: '$examScores' },
    { $project: { _id: 1, name: 1, age: 1, score: '$examScores.score' } },
    { $sort: { score: -1 } },
    {
      $group: {
        _id: '$_id',
        name: { $first: '$name' },
        maxScore: { $max: '$score' },
      },
    },
    { $sort: { maxScore: -1 } },
  ])
  .pretty();
```

#### extract useful information from your data.

```js
db.persons
  .aggregate([
    {
      $bucket: {
        groupBy: '$dob.age',
        boundaries: [18, 30, 40, 50, 60, 120],
        output: {
          numPersons: { $sum: 1 },
          averageAge: { $avg: '$dob.age' },
        },
      },
    },
  ])
  .pretty();

db.persons
  .aggregate([
    {
      $bucketAuto: {
        groupBy: '$dob.age',
        buckets: 5,
        output: {
          numPersons: { $sum: 1 },
          averageAge: { $avg: '$dob.age' },
        },
      },
    },
  ])
  .pretty();
```

> \$bucketAuto automatically group the age based on how many buckets you want to retrieve.

#### return the 10 oldest people in our list.

> when building your pipeline make sure that order of stages does matter, as in this example the order by which you skip and limit does matter.

```js
db.persons
  .aggregate([
    { $match: { gender: 'male' } },
    {
      $project: {
        _id: 0,
        gender: 1,
        name: { $concat: ['$name.first', ' ', '$name.last'] },
        birthdate: { $toDate: '$dob.date' },
      },
    },
    { $sort: { birthdate: 1 } },
    { $skip: 10 }, // skip the first 10 results
    { $limit: 10 }, // return only 10 results
  ])
  .pretty();
```

#### the \$out stage.

> in case we want to store the result of a pipeline in a new collection we can make use of the \$out operator.

`{ $out: "transformedPersons" }` this must be the last stage of your pipeline

#### using \$geoNear

> to make use of geoNear it has to be the first stage in the pipeline because it needs to use the index

> and only the first element that has direct access to the collection.

```js
// note that we run this pipeline on an extracted pipeline that used first to prepare our data.
db.transformedPersons
  .aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          // look for coordinates that are near mine.
          coordinates: [-18.4, -42.8],
        },
        maxDistance: 1000000,
        // find coordinates that are at most 10km far from me.
        num: 10,
        // add a query that runs on the entire collection instead of using match.
        query: { age: { $gt: 30 } },
        distanceField: 'distance',
        // how far are these coordinates from me.
      },
    },
  ])
  .pretty();
```
