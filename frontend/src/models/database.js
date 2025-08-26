import { openDB } from "idb";

const NameDB = "kreasiku";
const storeMessage = "messages";
const storeConverstation = "converstations";
const kreasiku = openDB(NameDB, 1, {
    upgrade(db) {
        if (!db.objectStoreNames.contains(storeMessage)) {
            db.createObjectStore(storeMessage);
        }
        if (!db.objectStoreNames.contains(storeConverstation)) {
            db.createObjectStore(storeConverstation)
        }
    }
});

export const setMessages = async (key, val) => {
    return (await kreasiku).put(storeMessage, val, key);
}
export const getMessages = async (key) => {
    return (await kreasiku).get(storeMessage, key);
}

export const setCoverstation = async (key, val) => {
    return (await kreasiku).put(storeConverstation, val, key);
}
export const getConverstation = async (key) => {
    return (await kreasiku).get(storeConverstation, key);
}
export const getConverstations = async () => {
    return (await kreasiku).getAll(storeConverstation);
}