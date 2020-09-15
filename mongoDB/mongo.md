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

#### to update one document.

`db.products.updateOne({distance: 12000},{$set :{marker: "tobDeleted"}})`
