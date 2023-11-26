import mongoose, { ConnectOptions } from 'mongoose';
import { MONGO_URI } from '../config';

export default async () => {
    try {
        await mongoose.connect(
            MONGO_URI, 
            // {
            //     useNewUrlParser: true,
            //     useUnifiedtTopology: true,
            //     useCreateIndex: true
            // } as ConnectOptions
            
        )

        console.log('DB connected')
    }catch (ex) {
        console.log(ex)
    }

}
