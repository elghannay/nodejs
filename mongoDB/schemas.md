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