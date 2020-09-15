### basic ideas.

> a database holds multiple collections where each collection can then hold multiple documents.
> a document cannot be inserted directly into a database, you need to use a collection.
> use filters and operators like \$gt to limit the number of documents you retrieve.

#### starting the server.

> `mongod --dbpath "C:\data\db"` then run on a new powershell `mongo`
> you can specifie a new port by using `--port 27017` for example.

#### stop the server.

> use `net stop MongoDB`, make sure to run terminal as admin.

#### show database

`show dbs`

#### switching to a new database.

`use shop`

#### adding a new collection.

`db.products.insertOne({name : 'pants', price:"40$"})`

#### list the collection in the db.

`db.products.find().pretty()`

#### to delete all the documents inside a collection.

`db.products.deleteMany({})`

#### to update multiple records.

`db.products.updateMany({},{$set :{marker: "tobDeleted"}})`

> without the \$set this will not work.

#### to update one document.

`db.products.updateOne({distance: 12000},{$set :{marker: "tobDeleted"}})`

#### update() vs updateMany()

> update will overwrite the data inside the documents and replaces it with
> the new passed object.
> `db.products.update({distance: 12000},{marker: "toBeDeleted"})`

> this will delete everything inside the document and replace it with marker: "toBeDeleted"

> this can be unpredictable, so stick with updateOne() and updateMany() or use replace().

#### insert many documents.

`db.products.insertMany([{},{}])`

> the data must be wrapped inside brackets.

#### finding data with a greater condition.

`db.products.find({distance:{$gt:1000}}).pretty()`

> find one will retrieve the first result.

`db.products.findOne({distance:{$gt:1000}}).pretty()`

#### find does not retrieve all the data in a collection so how can we do it?

> more efficient for bandwidth usage.
> `db.products.find().forEach((product) => { printjson(product) })`

`db.products.find().toArray()`

#### projection.

`db.products.find({},{name: 1,_id: 0}).pretty()`

#### using nested documents.

> you can have documents inside other documents and so on
> `db.products.updateMany({},{$set:{{details: 'on-time'}}})`

#### working with arrays.

`db.products.updateOne({distance: 12000},{$set :{hobbies: ["tobDeleted","goto"] }})`

#### accessing structured data.

`db.products.findOne({"status.details.responsible":"Max"}).pretty()`

> the quotation marks are important around "status.details.responsible"
> `db.products.findOne({hobbies:"sports"}).pretty()`
