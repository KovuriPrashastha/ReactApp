import * as actionTypes from '../actions/actionsTypes';
import {updateObject} from '../utility';

const initialstate = {
    orders : [],
    loading : false,
    purchased:false
};

const reducer = (state = initialstate, action) =>
{
    switch(action.type)
    {
        case actionTypes.PURCHASE_INIT:
            return updateObject(state, {purchased: false})
            
        case actionTypes.PURCHASE_BURGER_START:
            return updateObject(state, {loading:true})
           
        case actionTypes.PURCHASE_BURGER_SUCCESS:
            const newOrder={
                ...action.orderData,
                purchased:true,
                id: action.orderId
            }
            return{
                ...state,
                loading: false,
                orders:state.orders.concat(newOrder)
            };
        case actionTypes.PURCHASE_BURGER_FAIL:
            return{
                ...state,
                loading: false
            };

        case actionTypes.FETCH_ORDERS_START:
            return{
                ...state,
                loading:false
            }
        case actionTypes.FETCH_ORDERS_SUCCESS:
            return{
                ...state,
                orders: action.orders,
                loading:false

            }
        
        case actionTypes.FETCH_ORDERS_FAIL:
            return{
                ...state,
                loading:false
            }
        default:
            return{
                ...state
            };
    }
}

export default reducer;

