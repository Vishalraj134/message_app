import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    senderId: {type:mongoose.Schema.Types.ObjectId,ref: "user",required:true},
    receverId: {type:mongoose.Schema.Types.ObjectId,ref: "user",required:true},
    text: {type: String,},
    image: {type: String,},
    seen: {type: Boolean,default: false}
}, {timestamps:true});

const Message = mongoose.models.User || mongoose.model("User",messageSchema);

export default Message;