#### what are indexes?

> they help speed up our queries, is an ordered list of fields that you choose containing all the values that are stored in a collection. the list does not contain the entire document but only some of the fields ,(that points to the entire document) it performs something called index scans
> using too many indexes can cause some performance issues since you must update your indexes whenever you make an insert(an insert take then two steps inserting in the index list and on the collection)

#### using explain.

`db.contact.explain().find("dob.age" :{$gt: 60})`

> more stats with parameters
> `db.contact.explain("executionStats").find("dob.age" :{$gt: 60})`

> `db.contact.explain("allPlansExecution").find("dob.age" :{$gt: 60})`

#### creating an index.

> 1 sort in ascending order

`db.contact.createIndex("dob.age": 1)`

> MongoDB is now able to quickly find a fitting document when you filter for its age as it has a sorted list. Sorted lists are way quicker to search because you can skip entire ranges (and don't have to look at every single document).

#### deleting an index

`db.contact.dropIndex("dob.age": 1)`

> the idea of an index is to help you get quickly a **narrow** set of data(say 10% or 20% of your data) and not the majority of your collection.

> if it's going to return the majority then you will just add an extra step to go though all of the indexes that points you back to the original collection, what a waste!

#### using compound indexes.

`db.contact.createIndex("dob.age": 1, "gender": "male")`

> this will create a compound index that can speed up queries looking for age && gender (looking for the inverse also work) or age alone since the list will store the indexes in the same order that you have in the argument.()

> while for gender mongo uses collectionScan as the winningPlan

> compound indexes can speed up queries when you want to access two related data from the datastore.

> for large set of data sorting is more efficient when it's done with indexes since indexes are already ordered, and default sorting in mongo has 32MB limit in memory.

`db.contact.explain("executionStats").find("dob.age": 35).sort({"gender" : 1})`

> sort with indexes when the in memory sorting is not even possible due to the volume of data.

> if you sort with no index, mongo will load the entire collection in memory and do the sort there, which is not always possible

#### using index configuration.

> can be helpful sometimes if you want to make sure that a field is unique, avoids duplicate inserts.

`db.contact.createIndex({"email": 1}, {unique: true})`

#### partial index

> sometimes only some set of data get queried the most so it won't be logical to index all of your fields. ex: most of your queries are targeting males above age 60.(this ensure that index won't eat a lot of your disk space)

`db.contact.createIndex({"age": 1}, {partialFilterExpression: "gender": "male"})`

> this will create an index for age and only for documents that have the gender of age.
> note that this query will be optimal only when gender is male
> like : `db.contact.find("dob.age": {gt:{60}}, {gender: 'male'})`

#### treating none existing values as null when using indexes

`db.contact.createIndex({"email": 1}, {unique: true})`

> if you were to insert two documents with no field for email you will get an error since it will be interpreted as email got inserted twice with a value of null.

> to bypass this issue you may enter :
> `db.contact.createIndex({"email": 1}, {unique: true, partialFilterExpression: {email: {$exists: true}}})`

> this literally mean that i only want to index documents where the email field exists, avoid clashing of nulls.

#### using time to live indexes

> used if you are working with self destroying session data, clean the shopping card...
> data that cleans itself.
> trigger mongodb to reevaluate the entire collection and delete any entries after TTL expires

``db.contact.createIndex({"createdAt": 1}, {expireAfterSeconds: 10})`

> does not work on compound indexes

#### understand covered queries.

> in some specific cases you can make your queries even more efficient but returning the value directly from the index itself and skipping the stage of reaching out to the original document.

> indexes stores a pointer to the document and the value of the indexed parameter.
> so totalDocsExamined can be 0

`db.customers.createIndex({name: 1})`

> covered querying + projection don't return any other field than the indexed field, whenever you work with index look for optimization opportunities wether by adding indexes, deleting them in case they slow your queries, and get yourself into the habit of reading stats and see what plans got rejected.

`db.customers.find({name: "max"}, {_id :0, name: 1})`

#### how mongoDB rejects plans.

> get the indexes `db.users.getIndexes()`, it determines the winning plan by looking for the most efficient index that you have already created, if not it tries to find what are the other approaches that can be used.

> first it looks for it available approaches to access a document and create a benchmark for them then **caches** the result so that approach can be used to access the same data.

> after a certain inserts or a index rebuild the benchmark is recreated.

#### using multi-key indexes.

> when you feel like you are retrieving an array multiple times you can define an index for it, indexing multi-key data. You should note though that it takes memory space for each value in memory, 1000 documents with an array of 5 values take 5X more space that a single index.

#### using text index.

> regex are bad for performance, thus searching for text inside your documents can be achieved using **\$text**

> define a text index :

`db.user.createIndex({description: "text"}, {default_language: "english", weights: {title: 1, description: 10}})`

> the argument ''text'' will index the keywords in that description for easy access, by default adverbs and stop marks are not included like "the a an them you..."

`db.user.find({$text: {$search: 'awesome'}})`

NOTE : you are allowed to add only one text index per document, so add a combined text index if you need to search on multiple field.

`db.user.createIndex({title: "text", description: "text"})`

#### text indexes and sorting.

`db.user.find({$text: {$search: 'awesome T-shirt'}}, {score: {$meta: "textScore"}}).sort({score: {$meta: "textScore"}}).pretty()`

> this first will search for both awesome and T-shirts in the description, and score the result based on wether the returned document contain both words or not.

#### drop text index.

> can only be done using the **index name**, get first the index name using getIndex()

`db.contact.dropIndex("index_name")`

#### excluding words from text index.

`db.user.find({$text: {$search: 'awesome -shirt'}})`

> search for entries including the word "awesome" and excluding "shirt"

#### adding your indexes in the background.

> when you index fields of your documents the collection get blocked and you will not be able to interact with
> until that task finished, on a production app that contain millions of documents this could be an incovenience,
> you can create your indexes on the background by adding one argument.

`db.contact.createIndex({"dob.age": 1}, {background: true})`
