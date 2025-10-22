import mongoose from "mongoose"

const userSchema=new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type:String,
        required:true,
        select:false
    },
    walletCounter:{
        solana:{
            type:Number,
            default:0,
            min:0
        },
        ethereum:{
            type:Number,
            default:0,
            min:0
        }
    },
    totalWallets:{
        type:Number,
        default:0,
        min:0
    },
    seedPhrase:{
        type:String,
        select:false
    },
    createdAt: {
    type: Date,
    default: Date.now
  },
})

const User = mongoose.models.User||mongoose.model('User', userSchema);
export default User;
