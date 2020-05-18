# Users

User Roles:
0: Reader; 1: Writer; 2: Admin

Account Status
0: Normal
1: Suspended
2: Banend

username: {
type: String,
required: true,
},
password: {
type: String,
required: true,
},
birthdate: {
type: Date,
required: true,
},
joinDate: {
type: Date,
required: true,
},
biography: {
type: String,
required: false,
},
role: {
type: Number,
required: true,
},
likes: {
type: Schema.Types.ObjectId,
ref: "Like",
},
viewNSFW: {
type: Boolean,
default: false,
},
