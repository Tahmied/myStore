import { app } from "./app.js";
import { connectDb } from "./db/mongodbConnect.js";

connectDb()
.then((e)=>{
    app.listen(process.env.PORT || 8001 , ()=> {
        console.log(`Server is connected to database and running on localhost:${process.env.PORT || 8001}`);
    })
})
.catch((err)=>{
    console.log(`Some thing went wrong in server.js while connecting to db due to ${err}`);
})