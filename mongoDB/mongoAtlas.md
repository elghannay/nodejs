#### mongo atlas

clusters are a group of servers that stores your data, atlas stores your data in the cloud in replica sets, and manage the creation of clusters for you.

replica set is a cluster where each server store the same data.

When connecting to an Atlas cluster using the shell, why do we provide the hostnames for all nodes when we launch mongo?

So that if the primary node goes down, the shell can connect to other nodes in the cluster instead.

#### replica sets

A replica set in MongoDB is a group of mongod processes that maintain the same data set. Replica sets provide redundancy and high availability, and are the basis for all production deployments.

Replication provides redundancy and increases data availability. With multiple copies of data on different database servers, replication provides a level of fault tolerance against the loss of a single database server.

A replica set contains several data bearing nodes and **optionally** one arbiter node, one and only one member is deemed the primary node, while the other nodes are deemed secondary nodes.

The primary node receives all write operations. A replica set can have only one primary capable of confirming writes with { w: "majority" } write concern; although in some circumstances, another mongod instance may transiently believe itself to also be primary.

The secondaries replicate the primary’s **oplog** (operation log) and apply the operations to their data sets such that the secondaries’ data sets reflect the primary’s data set. If the primary is unavailable, an eligible secondary will hold an election to elect itself the new primary.

#### replication pros

In some cases, replication can provide increased read capacity as clients can send read operations to different servers. Maintaining copies of data in different data centers can increase data locality and availability for distributed applications. You can also maintain additional copies for dedicated purposes, such as disaster recovery, reporting, or backup.
