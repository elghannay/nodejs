#### show the stats about a collection.

`db.collectionName.stats()`

#### the limits of mongoDB.

> MongoDB has a couple of hard limits - most importantly, a single document in a collection (including all embedded documents it might have) must be <= 16mb. Additionally, you may only have 100 levels of embedded documents.

>You can find all limits (in great detail) here: [limits](https://docs.mongodb.com/manual/reference/limits/)

**insert an integer.**

`db.shop.insertOne({a:NumberInt(5)})`

> NumberInt creates a int32 value => NumberInt(55)
>NumberLong creates a int64 value => NumberLong(7489729384792)

>If you just use a number (e.g. insertOne({a: 1}), this will get added as a normal double into the database. The reason for this is that the shell is based on JS which only knows float/ double values and doesn't differ between integers and floats.

>NumberDecimal creates a high-precision double value => NumberDecimal("12.99") => This can be helpful for cases where you need (many) exact decimal places for calculations.

#### nesting or refs?

>typically you will work with multiple collection, so how are you going to store related data, do you use embedded documents or do you work with references.

> if you need to get up to date info about the author's age or address go with refs. if the data rarely changes then go with nesting. and always keep in mind that you should not hit the limit of 16mb when working with collections.

>going with nesting or just using refs depends greatly on the type of data that you are working, how often you change it(do you need the purchase price) and is duplication is fine.

#### schema validation.

> if you need to incorporate validation in your collections of data you should use 
`db.createCollection("posts")`

```js
db.runCommand({
  collMod: 'posts',
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['title', 'text', 'creator', 'comments'],
      properties: {
        title: {
          bsonType: 'string',
          description: 'must be a string and is required'
        },
        text: {
          bsonType: 'string',
          description: 'must be a string and is required'
        },
        creator: {
          bsonType: 'objectId',
          description: 'must be an objectid and is required'
        },
        comments: {
          bsonType: 'array',
          description: 'must be an array and is required',
          items: {
            bsonType: 'object',
            required: ['text', 'author'],
            properties: {
              text: {
                bsonType: 'string',
                description: 'must be a string and is required'
              },
              author: {
                bsonType: 'objectId',
                description: 'must be an objectid and is required'
              }
            }
          }
        }
      }
    }
  },
//   the logs will be stored in a log file.
  validationAction: 'warn'
});


```