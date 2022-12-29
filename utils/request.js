import {
    getDownloadURL,
    ref as storageRef,
    deleteObject,
  } from "firebase/storage";
  import { storage } from "~/plugins/firebase";

export const getImageUrl = async (imageName) => {
    const PICTURE_REF = storageRef(storage, "lieux/" + imageName);
    if (PICTURE_REF) {
        return await getDownloadURL(PICTURE_REF);
     }
}

export const deleteImage = async (storageName, fileName ) => {
  const imageRef = storageRef(
    storage,
    storageName + '/' + fileName
  );
  return await deleteObject(imageRef);
}