import * as actionTypes from './actionsTypes';
import axios from 'axios';

export const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    };
};

export const authSuccess = (token, userId) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        idToken: token,
        userId: userId
    };
};

export const authFail = (error) => {
    return {
        type: actionTypes.AUTH_FAIL,
        error: error
    };
};

export const logout = () =>
{
    localStorage.removeItem('expirationDate');
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    return{
        type: actionTypes.AUTH_LOGOUT
    }
}
export const checkAuthTimeout = (expirationTimeout) =>
{
    return dispatch => {
        setTimeout(() => {
            dispatch(logout());
        },expirationTimeout*1000)
    };
};
export const auth = (email, password, isSignup) => {
    return dispatch => {
        dispatch(authStart());
        const authData ={
            email: email,
            password: password,
            returnSecureToken: true
        }
        let url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCoJqeG3DsnUUgIes2F6mHxxORQJRO-Ztc';
        if(!isSignup)
        {
            url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCoJqeG3DsnUUgIes2F6mHxxORQJRO-Ztc';
        }
        axios.post(url, authData)
            .then(response =>{
                //console.log(response);
                const expirationDate = new Date(new Date().getTime()+response.data.expiresIn*1000);
                localStorage.setItem('token', response.data.idToken);
                localStorage.setItem('expirationDate', expirationDate)
                localStorage.setItem('uderId', response.data.localId);
                dispatch(authSuccess(response.data.idToken, response.data.localId));
                dispatch(checkAuthTimeout(response.data.expiresIn));
            })
            .catch(err => {
                //console.log('hii',err);
                dispatch(authFail(err.response.data.error));
            })
    };
};


export const setAuthRedirectPath = (path) =>
{
    return{
        type: actionTypes.SET_AUTH_REDIRECT_PATH,
        path: path
    }
}

export const authCheckState = () =>
{
    return dispatch =>
    {
        const token = localStorage.getItem('token');
        if(!token){
            dispatch(logout());
        }
        else{
            const expirationDate = new Date(localStorage.getItem('expirationDate'));
            if(expirationDate <= new Date())
            {
                dispatch(logout());
            }
            else{
                const userId = localStorage.getItem('userId');
                dispatch(authSuccess(token, userId));
                dispatch(checkAuthTimeout((expirationDate.getTime()-new Date().getTime())/1000));
            }
            
        }
    }
}
//https://identitytoolkit.googleapis.com/v1/accounts:signUp?
//https://identitytoolkit.googleapis.com/v1/accounts:signUp?