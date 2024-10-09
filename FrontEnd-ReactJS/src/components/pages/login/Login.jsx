import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import './login.scss'
import { useContext, useState } from 'react';
import Api from '../../../tools/api';
import { AppContext } from '../../layout/Layout';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
    const navigate = useNavigate();

    // init app state
    const appContext = useContext(AppContext)

    // init local state
    const [state, setState] = useState({})
    const [cookie, setCookie] = useCookies('token')

    const callLogin = async () => {
        // check fields 
        if (
            (state.email == null || state.email.length == 0) ||
            (state.password == null || state.password.length == 0)
        ) {
            appContext.showPopup('Please Fill All the fields')
            return
        }

        // calling API
        const response = await Api.fetch({
            url: 'login',
            body: state,
            method: 'PUT',
            showPopup: appContext.showPopup,
        })

        // check API Response        
        if (response != null) {
            // show message
            appContext.showPopup(response.message)

            // save token (appState - Cockies)
            if (response.token != null) {
                appContext.login(response.token, null)
                setCookie('token', response.token)

                // redirect to homepage                
                window.location.href = '/'

            }
        }
    }

    return (
        <div className='login-page'>
            <h1> Login Page</h1>
            <Form>

                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder="Enter email"
                        onChange={(e) => {
                            setState({ ...state, email: e.target.value })
                        }}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password"
                        onChange={(e) => {
                            setState({ ...state, password: e.target.value })
                        }}
                    />
                </Form.Group>

                <Button onClick={(e) => {
                    e.preventDefault()
                    callLogin()
                }} variant="primary" type="submit">
                    Login
                </Button>
            </Form>
        </div>
    );
}

