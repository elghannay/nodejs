#### lunch mongo in a new port.

`mongod --port 27014`

#### set the database path.

`mongod --dbpath "C:\data\db"`

#### set the log path.

`mongod --logpath "C:\Program Files\MongoDB\Server\4.4\log\log.txt"`

#### using a config file.

```cfg
storage: dbPath: 'C:datadb';
systemLog: destination: file;
path: 'C:Program FilesMongoDBServer\4.4\log\log.txt';
```

#### running the config files.

`mongod -f "C:\Program Files\MongoDB\Server\4.4\bin\mongod.cfg"`

#### display help on the shell.

type `help`
