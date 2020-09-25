#### capped collection.

is a special type of collection where we limit the amount of data that we store in.  it basically delete documents to store new incoming ones.

this is useful for cashing mechanisms where you only need the most recent data.

capped collection always retrieve data by the insertion order, as opposed to normal collection you should force sorting by adding sort(_id: 1) since it's not always guaranteed

* you can sort capped collection by adding the operator `$natural`.
> ` db.cappedCollectionName.find().sort($natural: -1).pretty()`

#### mongodb transactions.

group all the requests that i send in a single session, when working with transactions you basically create a session and based on that session you can store references to your collections, then you start a transaction on the sessions and do the delete operations. once you deleted from both references you can commit your transaction.

the idea behind transaction is that the delete operations are either success of fail together. so get atomicity on operation level, more secure than the default level of atomicity offered by mongodb on a document level.
only use it when you need it, it is not performante.

Imagine if you have a sales order and inventory control system. When you make a sale it should reduce on-hand inventory. But what happens if the sales transaction works then the inventory update fails? Then the database would no longer be consistent: the inventory would not match the sales.

```js
session = db.getMongo().startSession( { readPreference: { mode: "primary" } } );

productsCollection = session.getDatabase("products").products;
salesCollection = session.getDatabase("products").sales;

session.startTransaction( { readConcern: { level: "snapshot" }, writeConcern: { w: "majority" } } );

try {
   salesCollection.insertOne( { 
        product: 123, 
        count: 4
        }
     );
   productsCollection.update(
   { product: 123 },
   { $set:
      {
        count: 96
       }
   }
);

} catch (error) {
   session.abortTransaction();
   throw error;
}

session.commitTransaction();

```