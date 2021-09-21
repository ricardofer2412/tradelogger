const { Schema, model } = require("mongoose");

const commentSchema = new Schema({
    tickerId: { type: String},
    authorId: {type: Schema.Types.ObjectId, ref: 'User'},
    content: String,  
    userName: { type: String},
    postTime: String
},
{
    timestamps: true
}

)


const Comment = model("Comment", commentSchema);

module.exports = Comment;