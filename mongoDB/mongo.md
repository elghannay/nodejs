#### starting the server.

> `mongod --dbpath "C:\data\db"` then run on a new powershell `mongo`

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
