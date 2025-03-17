import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

 // Configuration
 cloudinary.config({ 
    cloud_name: 'ddngi6kq2', 
    api_key: '751876532825232', 
    api_secret: 'mTtNWj_I9_gBKf2t-f61vV8CqjY' 
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath) {
            return null
        }
        const uploadResponse = await cloudinary.uploader.upload(localFilePath, {
            resource_type : 'auto'
        })
        fs.unlinkSync(localFilePath)
        return uploadResponse

    } catch (err) {
        fs.unlinkSync(localFilePath)
        console.log(`error uploading file on cloudinary due to ${err}`);
        return null
    }
}

export { uploadOnCloudinary };

