import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import styles from './layout.module.scss'
import { useContext, useEffect, useState } from 'react';
import { AppContext } from './Layout';
import { Link } from 'react-router-dom';
import { useCookies } from "react-cookie";
import Api from '../../tools/api';
import Loading from '../shared/Loading';

function AppBar() {
    // init cookies
    const [cookie, setCookie] = useCookies('token')

    // init app state & token
    const appContext = useContext(AppContext)
    let token

    // init state
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(false)

    // check login state
    const checkLogin = async () => {
        // init token
        token = appContext.appState.token != null ? appContext.appState.token : cookie?.token

        // check if we have token or not        
        if (token == null || token == '') return;

        // show loading
        setLoading(true)

        // get user details
        const res = await Api.fetch({ url: 'user', token })

        // check response if success => login locally        
        if (res != null && res.email != null) {
            appContext.login(token, res)
        }
        // logout locally
        else {
            appContext.logout()
            setCookie('token', null)
        }

        // hide loading
        setLoading(false)
    }
    useEffect(() => {
        checkLogin()
    }, [])

    // logout callback
    const onLogout = async () => {
        // reset cookie        
        setCookie('token', null)

        // check token
        token = appContext.appState.token != null ? appContext.appState.token : cookie?.token
        if (token == null) return;

        // call api to remove the token
        await Api.fetch({ method: 'PUT', url: 'logout', token })

        // reset app state
        appContext.logout()

        console.log('window.location.href');//ss
        console.log(window.location.href);
        window.location.href = '/login'
        console.log(window.location.href);
    }

    return (
        <Navbar expand="lg" className={styles.appbar + ' ' + "bg-body-tertiary"}>
            <Container fluid>
                {/* <Navbar.Brand href="/">My Store</Navbar.Brand> */}
                <Link to='/' className='navbar-brand' >My Store</Link>
                <Navbar.Toggle aria-controls="navbarScroll" />
                <Navbar.Collapse id="navbarScroll">
                    <Nav
                        className="me-auto my-2 my-lg-0"
                        style={{ maxHeight: '100px' }}
                        navbarScroll
                    >
                        {loading ? <Loading /> :
                            <>
                                {appContext.appState.user == null ?
                                    <>
                                        <Link to='register' className='nav-link' >
                                            Register
                                        </Link>
                                        <Link to='login' className='nav-link' >
                                            Login
                                        </Link></>
                                    :
                                    <>
                                        <Link to='user' className='nav-link' >
                                            My Details
                                        </Link>
                                        <Link to='orders' className='nav-link' >
                                            My Orders
                                        </Link>
                                        <Link onClick={onLogout} className='nav-link' >
                                            Logout
                                        </Link>
                                    </>
                                }
                            </>
                        }
                    </Nav>
                    <Form className="d-flex">
                        <Form.Control
                            type="search"
                            placeholder="Search"
                            className="me-2"
                            aria-label="Search"
                            onChange={(e) => {
                                setSearch(e.target.value)
                            }}
                        />
                        <Button onClick={(e) => {
                            appContext.setSearch(search)
                        }} variant="outline-success">Search</Button>
                    </Form>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default AppBar;