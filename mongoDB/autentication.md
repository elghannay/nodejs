#### understanding the authentication system.

> user of your database (the admins and data scientists) are assigned roles, each role has a number of privileges consist of actions and resources that a user can get access to ,like inserting a collection in such database...

> a user in this context does not mean a customer on your shop

#### creating and Editing users.

> The first user created in the database should be a user administrator who has the privileges to manage other users. See Enable Access Control.

When adding a user, you create the user in a specific database. This database is the authentication database for the user.

A user can have privileges across different databases; that is, a user’s privileges are not limited to their authentication database. By assigning to the user roles in other databases, a user created in one database can have permissions to act on other databases. For more information on roles, see Role-Based Access Control.

`sudo mongod --auth`

> if you have already defined a user you may login to your db as `mongo -u name -p pass -authenticationDatabase admin` admin is the database that you have assigned the user initially. it could be the 'shop' DB for example.

> if it is your first time you get a localhost exception, which the ability to switch to admin database even if you haven't added any user.

> `use admin` > `db.createUser({ user: "mohamed",pwd: "elghannay", roles:["userAdminAnyDatabase"]})`
> after you created the user make sure to authenticate.

> `db.auth('mohamed','elghannay')` if the operation was successful `show dbs`

> to switch the user you should logout or just quit the terminal.
> make sure to switch first to the database that the user can have access to.(then create the user)

The localhost exception applies only when there are no users created in the MongoDB instance.

#### assigning more that one db to a user.

> one confusing thing that you should note though, always select first the db that a user has access to then try to authenticate.

`use admin`
`db.auth('max','max')` > admin login
`db.updateUser("appdev",{roles: ["readWrite",{role:"readWrite", db: "blog"}]})`

> update privileges for the appdev user, give em access to the blog database.
> to check the roles that a user has `db.getUser("appdev")`

> A user can have privileges across different databases. If a user requires privileges on multiple databases, create a single user with roles that grant applicable database privileges instead of creating the user multiple times in different databases.

#### Limit Network Exposure 

> Allow only trusted clients to access the network interfaces and ports on which MongoDB instances are available. For instance, use IP whitelisting to allow access from trusted IP addresses (see )

#### authentication vs authorization

> Although authentication and authorization are closely connected, authentication is distinct from authorization. Authentication verifies the identity of a user; authorization determines the verified user’s access to resources and operations.

#### roles 

As you already know, a role is a privilege granted to a user for making actions over resources.
The role defines the tasks that the role member is allowed to do and the resources where those tasks can be done.

Several roles provide either indirect or direct system-wide superuser access.

The following roles provide the ability to assign any user any privilege on any database, which means that users with one of these roles can assign themselves any privilege on any database:

* dbOwner role, when scoped to the admin database
* userAdmin role, when scoped to the admin database
* userAdminAnyDatabase role

* The following role provides full privileges on all resources: **root**

to get all the roles of a database, use

> `db.system.roles.find()` or `> db.getRoles()`

#### TLS SSL

To use TLS/SSL with MongoDB , you must have the TLS/SSL certificates as PEM files, which are concatenated certificate containers. Clients must have support for TLS/SSL to connect to a mongod or a mongos instance that require TLS/SSL connections.

TLS is upgraded version of SSL.
SSL and TLS are cryptographic protocols that authenticate data transfer between servers, systems, applications and users. For example, a cryptographic protocol encrypts the data that is exchanged between a web server and a user.

If you look at SSL versus TLS certificate, both perform the same task of encrypting data exchange. TLS was an update and secure version of SSL.

to generate one :
> [stackoverflow link](https://stackoverflow.com/questions/10175812how-to-create-a-self-signed-certificate-with-openssl)  

> download and install from this [link](https://slproweb.com/products/Win32OpenSSL.html)

after navigation to the bin folder of openSSL type the command found on stack overflow 

> make sure to choose carefully the Common Name, it's the host that the encryption will be active on.

NOTE: using a self generated certificates in not recommended you have to buy it from an online authorized vendor and verify your connections to their server.