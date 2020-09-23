### geoJson.

#### what's in this section.

> in this section you will see how to store geoJson data, and how you can query it.

> Determine the user’s current neighborhood using $geoIntersects,
> Show the number of restaurants in that neighborhood using $geoWithin, and
> Find restaurants within a specified distance of the user using \$nearSphere.

> To specify GeoJSON data, **use an embedded document** with:
> a field named type that specifies the GeoJSON object type and
> a field named coordinates that specifies the object’s coordinates.
> NOTE : If specifying latitude and longitude coordinates, list the **longitude first** and then latitude:

`db.places.insetOne(name: "california", location:{ type: "LineString", coordinates: [ 40.3, 5 ]})`

#### find out if something is near a location.

> this query allow us to find a place within a certain radius determined by min and max.
> **\$near** sort the result by proximity.
> `db.places.find(location :{$near: {$geometry:{type:"point",coordinates:[40.2, 10]}, $maxDistance: 400, $minDistance: 10}})`

> this query alone won't work without defining an index.

`db.places.createIndex(location: "2dsphere")`

#### Selects documents with geoSpatial data that exists entirely within a specified shape using \$geoWithin.

`db.places.find({location: {$geoWithin:{$geometry: {type: "polygon", coordinates: [[p1, p2, p3, p4, p1]]}}}})`

#### Determine the user’s current neighborhood using \$geoIntersects .

> we tend to answer the question, do we have an area that intersect with the point in the arguments ?

> first create a new collection that stores one area.

`db.areas.insertOne({name: "golden park", area: {type: "polygon", coordinates: [[p1, p2, p3, p4, p1]]}})`

> create an index

`db.areas.createIndex(area: "2dsphere")`

`db.areas.find({area: {$geoIntersects: {$geometry: {type: "point", coordinates: p1}}}})`

> this will either return the area or nothing if a user is not located inside the area.
