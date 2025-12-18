import mongoose  from "mongoose";

export const connectDb =()=>{
    main().then(()=>{
        console.log("Connected to DB");
    })
    .catch(err => console.log(err));
    
    async function main() {
      await mongoose.connect(process.env.MONGO_URI);
    }    
}


