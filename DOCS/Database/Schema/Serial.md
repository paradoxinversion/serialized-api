# Serial

Represents an individual Serial story to which there can be multiple parts.

## title (String)*

The title of the serial.

## synopsis (String)*

A general intoduction to the serial.

## genre (ObjectId:Genre)*

The object id of a genre object, with which the serial will be associated with.

## nsfw (Boolean)*

Whether or not the serial is "safe for work", but more specifically whether or not it is "intended for mature audiences".

## creation_date (Date)*

The date/time the Serial is first created.

## last_modified (Date)*

The date/time the serial was last updated.

## author (ObjectId:User)*

The id of the user creating the serial. No options exist yet for co-authoring.

## slug (String)*

The name of the serial in kebab-case, to be used as part of URL when retrieving them.
