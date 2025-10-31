import mongoose from "mongoose"

const walletSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
    },
    walletType:{
        type:String,
        required:true,
        trim:true,
        enum:["solana","ethereum"],
        index:true
    },
    privateKey:{
        type:String,
        required:true,
        trim:true,
        select:false    
    },
    publicKey:{
        type:String,
        required:true,
        trim:true,
        unique:true
    },
    createdAt: {
    type: Date,
    default: Date.now
  }
})

const Wallet = mongoose.models.Wallet || mongoose.model('Wallet', walletSchema);
export default Wallet;
