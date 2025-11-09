import {get,post} from '../util/util';

export const getShopData = async() =>{
    return await get('/getAccessories');
}
export const buyAccessory = async(productId) => {
    return await post('/buyAccessory', { id: productId });
}