import { cloudinary } from "../config/cloudinary.js";


//Upload to cloudinary
export const uploadToCloudinary = async (
  fileBuffer,
  resourceType,
  folderName
) => {
  try {
    const uploadPromise = new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { resource_type: resourceType, folder: folderName },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        )
        .end(fileBuffer);
    });

    const result = await uploadPromise;
    console.log("Upload successful:", result.secure_url);
    return result.secure_url;
  } catch (error) {
    console.error("Upload failed:", error);
    throw new Error("Upload failed");
  }
};

// export const uploadToCloudinary = async (fileBuffer, resourceType, folderName) => {
//   try {
//     const uploadPromise = new Promise((resolve, reject) => {
//       cloudinary.uploader
//         .upload_stream(
//           { resource_type: resourceType, folder: folderName },
//           (error, result) => {
//             if (error) return reject(error);
//             resolve(result);
//           }
//         )
//         .end(fileBuffer);
//     });

//     const result = await uploadPromise;
//     console.log("Upload successful:", result.secure_url);
//     return result.secure_url;
//   } catch (error) {
//     console.error("Upload failed:", error);
//     throw new Error("Upload failed");
//   }
// };
