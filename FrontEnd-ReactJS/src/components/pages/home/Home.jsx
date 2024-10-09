import { useContext, useEffect, useState } from "react";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import styles from './home.module.scss'
import { AppContext } from "../../layout/Layout";
import Api from "../../../tools/api";
import { Col, Row } from "react-bootstrap";


export default function HomePage() {
    // init app state
    const appContext = useContext(AppContext)

    // init categories & other states
    const [countcategories, setcountCategories] = useState(0)
    const [countproducts, setcountProducts] = useState(0)
    const [countorder, setcountorders] = useState(0)


    // set fetching categories from API function
    const getCountCategories = async () => {
        const response = await Api.fetch({ url: 'countCategories' })
        if (response != null)
        setcountCategories(response.count)
    }

    // set fetching products from API function
    const getCountProducts = async () => {
        const response = await Api.fetch({ url: 'countProducts' })
        if (response != null)
        setcountProducts(response.count)
    }
    const getCountOrder = async () => {
        const response = await Api.fetch({ url: 'countOrders' })
        if (response != null)
        setcountorders(response.count)
    }

    useEffect(() => {
        getCountCategories();
        getCountProducts();
        getCountOrder();
    }, [])

    return <div className={styles.home}>
        <div className={styles.countproducts}>
            <h1 className="text-center m-5">Statistics</h1>
            <Row>
                <Col xs={12} sm={6} md={4}>
                    <Card style={{ width: '18rem' }}>
                        <Card.Body className="text-center">
                            <Card.Title>{countcategories}</Card.Title>
                            <Card.Text>
                                The number of categories on the website
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xs={12} sm={6} md={4} >
                    <Card style={{ width: '18rem' }}>
                        <Card.Body className="text-center">
                            <Card.Title>{countproducts}</Card.Title>
                            <Card.Text>
                                The number of products on the website
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xs={12} sm={6} md={4}>
                    <Card style={{ width: '18rem' }}>
                        <Card.Body className="text-center">
                            <Card.Title>{countorder}</Card.Title>
                            <Card.Text>
                                The number of orders on the website
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

        </div>
    </div>
}