#### understanding the authentication system.

> user of your database (the admins and data scientists) are assigned roles, each role has a number of privileges consist of actions and resources that a user can get access to ,like inserting a collection in such database...

> a user in this context does not mean a customer on your shop

#### creating and Editing users.

`sudo mongod --auth`

> if you have already defined a user you may login to your db as `mongo -u name -p pass -authenticationDatabase admin` admin is the database that you have assigned the user initially.

> if it is your first time you get a local host exception, which the ability to switch to admin database even if you haven't added a new user.
> `use admin` > `db.createUser({ user: "mohamed",pwd: "elghannay", roles:["userAdminAnyDatabase"]})`
> after you created the user make sure to authenticate.
> `db.auth('mohamed','elghannay')` if the operation was successful `show dbs`

> to switch the user you should logout or just quit the terminal.
> make sure to switch first to the database that the user can have access to.(then create the user)

#### assigning more that one db to a user.

> one confusing thing that you should note though, always select first the db that a user has access to then try to authenticate.

`use admin`
`db.auth('max','max')` > admin login
`db.updateUser("appdev",{roles: ["readWrite",{role:"readWrite", db: "blog"}]})`

> update privileges for the appdev user, give em access to the blog database.
> to check the roles that user has `db.getUser("appdev")`
