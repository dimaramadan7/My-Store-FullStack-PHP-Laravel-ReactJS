import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import './register.scss'
import { useContext, useState } from 'react';
import Api from '../../../tools/api';
import { AppContext } from '../../layout/Layout';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

export default function RegisterPage() {
    const navigate = useNavigate();

    // init app state
    const appContext = useContext(AppContext)

    // init local state
    const [state, setState] = useState({})
    const [cookie, setCookie] = useCookies('token')

    const callRegister = async () => {
        // check fields 
        if (
            (state.name == null || state.name.length == 0) ||
            (state.email == null || state.email.length == 0) ||
            (state.password == null || state.password.length == 0) ||
            (state.password_confirmation == null || state.password_confirmation.length == 0)
        ) {
            appContext.showPopup('Please Fill All the fields')
            return
        }
        // check password is same or not
        if (state.password != state.password_confirmation) {
            appContext.showPopup('Passowrds are not matched')
            return
        }
        // calling API
        const response = await Api.fetch({
            url: 'register',
            body: state,
            method: 'POST',
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
        <div className='register-page'>
            <h1> Register Page</h1>
            <Form>
                <Form.Group className="mb-3" controlId="formBasicName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" placeholder="Enter Name"
                        onChange={(e) => {
                            setState({ ...state, name: e.target.value })
                        }}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder="Enter email"
                        onChange={(e) => {
                            setState({ ...state, email: e.target.value })
                        }}
                    />
                    <Form.Text className="text-muted">
                        We'll never share your email with anyone else.
                    </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password"
                        onChange={(e) => {
                            setState({ ...state, password: e.target.value })
                        }}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPasswordConfirmation">
                    <Form.Label>Password Confirmation</Form.Label>
                    <Form.Control type="password" placeholder="Password Confirmation"
                        onChange={(e) => {
                            setState({ ...state, password_confirmation: e.target.value })
                        }}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicCheckbox">
                    <Form.Check type="checkbox" label="Agree to privacy policy" />
                </Form.Group>
                <Button onClick={(e) => {
                    e.preventDefault()
                    callRegister()
                }} variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
        </div>
    );
}

