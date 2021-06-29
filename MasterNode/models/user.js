const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: { 
        type: String,
        trim: true 
    },
    age: Number,
    image: { 
        data:{
            type: Buffer,
            default: Buffer.alloc(0)
            
        },
        contentType: {
            type: String,
            default: "none"
        },
        
    },
},
{ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },  versionKey: false });

userSchema.index({name: 1}, { unique: true });

module.exports = mongoose.model('Users', userSchema);