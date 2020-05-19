# Report

Represents a user-generated report against Users, or user-generated content such as Serials or Serial Parts.

## report_type (String)*
The type of resource being reported. Currently can be: user, serial, or serialPart. 

## reported_item (ObjectId)*

The id of the object being reported.

## reporting_user (ObjectId)*

The id of the user filing the report.

## extra_details (String)

Any extra information the reporting user would like to include in their report to assist moderators/adminstrators in making decisions.