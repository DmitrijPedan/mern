import React, {useState, useEffect, useContext} from "react";
import {useHttp} from "../hooks/http.hook";
import {useMessage} from "../hooks/message.hook";
import {AuthContext} from "../context/AuthContext";

export const AuthPage = () => {

    const auth = useContext(AuthContext);

    const message = useMessage();

    const { loading, request, error, clearErrors } = useHttp();

    const [form, setForm] = useState({
        email: '',
        password: '',
    });

    useEffect(() => {
        message(error);
        clearErrors();
    }, [error, message, clearErrors]);

    useEffect(() => {
        window.M.updateTextFields();
    }, [])

    const changeHandler = (event) => {
        setForm({...form, [event.target.name]: event.target.value});
    }

    const registerHandler = async () => {
        try {
            const data = await request('/api/auth/register', 'POST', {...form});
            message(data.message);
        } catch (e) {
            // console.log('registerHandler: ', e)
        }
    }

    const loginHandler = async () => {
        try {
            const data = await request('/api/auth/login', 'POST', {...form});
            auth.login(data.token, data.userId);
            message(data.message);
        } catch (e) {
            // console.log('registerHandler: ', e)
        }
    }

    return (
        <div className="row">
            <div className="col s6 offset-s3">
                <h3>Short link</h3>
                <div className="card blue-grey darken-1">
                    <div className="card-content white-text">
                        <span className="card-title">Authorization</span>
                        <div>

                            <div className="input-field">
                                <input
                                  name="email"
                                  onChange={changeHandler}
                                  placeholder="email" id="email" type="email" className="validate" />
                                <label htmlFor="email">Email</label>
                            </div>

                            <div className="input-field">
                                <input
                                  name="password"
                                  onChange={changeHandler}
                                  placeholder="password" id="password" type="password" className="validate" />
                                <label htmlFor="password">Password</label>
                            </div>

                        </div>
                    </div>
                    <div className="card-action">
                        <button onClick={loginHandler} disabled={loading} className="btn login-btn yellow darken-4">Login</button>
                        <button onClick={registerHandler} disabled={loading} className="btn grey darken-3">Register</button>
                    </div>
                </div>
            </div>
        </div>
    )
}