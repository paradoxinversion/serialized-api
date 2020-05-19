# Serial Part

Represents an individual part of a Serial story.

## title (String)*

The title of the serial part. It doesn't need to be unique, but should be.

## content (String?)*

The content of the serial. For now, it's a string, but depending on how rich text is handled, some more complex structure may be needed.

## creation_date (Date)*

The date the serial part is created

## last_modified (Date)*

The last time the serial part was modified

## parent_serial (ObjectId:Serial)*

The id of the Serial to which the Serial Part belongs

## slug (String)*

The kebab-cased title of the Serial Part

## part_number (Number)*

The order in which the Serial Part should appear in its serial. This number should be unique for each Serial Part and must be sequential (ie, part 3 cannot be created before part 2)

## author (objectId:User)*

The object id of the user who created the serial/part.

