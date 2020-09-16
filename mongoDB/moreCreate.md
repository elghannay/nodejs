#### ordered and unordered inserts.

> usually works with insertMany([ ], { ordered: true | false })

> it dictate wether you want to process the other fields in your insert or not in case of an error(duplicate key ...).pretty()`

> ordered will stop inserting at the first error while unordered will insert everything except the erroneous data.

#### insert().

> is not recommended, since it does not add automatic ids. don't use it.

#### writeConcern.

`{ w: <value>, j: <boolean>, wtimeout: <number> }`

> is an additional configuration document that get added to the insertMany() and insertOne() object.

> the j indicate that the data will be written in a todo journal so in case of server failure the data will still be written on the disk.
> this is just a safety mechanism since writing directly on the disk is resource intensive and take a long time.
>
> **w : 1** : the storage engine should have accepted that write.
>
> **w : 0** : you don't know if your write has reached the server. no acknowledgment.

> **j : true** the journal is an additional file that keep track of the data that the storage engine need to write but it not have completed yet, is a backup for the steps that the server should do.

#### importing in mongo.

`mongoimport -d moviesData -c movies --jsonArray --drop tv-shows.json`

> mongoimport command was not available by default on the system (windows PC), so first download from the official website the additional tools provided by MongoDB this includes mongoimport and others that you may not need.

> after installation copy mongoimport.exe from "C:\Program Files\MongoDB\Tools" into the bin folder "C:\Program Files\MongoDB\Server\4.4\bin"

> navigate using your terminal to the folder where the json file you want to import is located then run your mongoimport command.
