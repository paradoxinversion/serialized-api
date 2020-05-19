# Users

Represents any users, including Administrators on the site.

## username (String)\*

The user's username. It must be unique. 

It is publicly available on the site in various places.

## password (String)\*

The user's password. It is encrypted when the user signs up and is unrecoverable if lost.

## birthdate (Date)\*

The user's date of birth, used with viewNSFW to determine what content to show to users, or other things that may have to do with legal compliance in that regard.

This is displayed on user's profiles at their discretion, requiring them to opt in.

## show_birthdate (Boolean)\*

Whether or not the user wants to show their birthdate.

If true, the user's birthdate is publicly displayed on their profile.

## joindate (Date)\*

The date the user joined the platform. 

This is publicly displayed on user's profiles.

## biography (String)

A brief summary the user writes about themselves, that is displayed on their profile.

This is pubicly displayed on user's profiles.

## role (Number)\*

The user's role. Currently, there are two:

0 - General Users (ie, readers and writers)

1 - Administrators

### Administrators
Administrators have the power to remove Users, Serials, Serial Parts, and any other user-generated content on the platform. 

## accountStatus (Number)\*

0 - Normal

1 - Suspended

2 - Banned

## viewNSFW (Boolean)

Whether or not the user has opted into viewing NSFW material. They must also be at least 18 for this to be true.
