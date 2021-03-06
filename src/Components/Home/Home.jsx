import React from "react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
// import Card from "../Card/Card.jsx"
import Footer from "../Footer/Footer.jsx"
import Header from '../Header/Header'
import { getMovies, signUpFunction } from "../../redux/actions/index.js";
import { Container, Row } from "react-bootstrap";
import Cartas from "../Cartas/Cartas.jsx";


// Import Swiper styles
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "./style.css";
import "swiper/css/navigation";
import SwiperCore, {
    EffectCoverflow,
    Pagination,
    Navigation
} from "swiper/core";
import { useAuth0 } from "@auth0/auth0-react";

SwiperCore.use([EffectCoverflow, Pagination, Navigation]);

// import "swiper/swiper.min.css";

export default function Home() {
    const { user, isAuthenticated } = useAuth0()

    const dispatch = useDispatch();
    // const { profileInfo } = useSelector(state => state);
    const allMovies = useSelector(state => state.pelisfiltradas);

    useEffect(() => {
        dispatch(getMovies());
    }, [dispatch])

    useEffect(() => {
        if (user) {
            // console.log('ESTE ES EL USER', user)
            dispatch(signUpFunction({
                // ...user,
                name: user.given_name ? user.given_name : null,
                surname: user.family_name ? user.family_name : null,
                username: user.nickname,
                email: user.email,
                password: user.email,
                // creator: false,
                //buscar la manera de no enviar el creator en false acá
            }))
        }
    }, [user, isAuthenticated])

    if (allMovies[0] === 'No films') {
        return (
            <>
                <Header position="sticky" />
                <div className="container">
                    <div>
                        <h1>No se ha podido encontrar la búsqueda.</h1>
                    </div>
                </div>
                <Footer />
            </>
        )
    }

    return (
        <>
            <Header position="sticky" />
            <div className="container">
                {
                    allMovies.length && allMovies[0] !== 'No films' ? (
                        <>
                            <h2 className="Title">Estrenos:</h2>
                            <Swiper
                                navigation={true}
                                effect={"coverflow"}
                                centeredSlides={true}
                                slidesPerView={window.innerWidth < 768 ? 1 : "auto"}
                                loop={true}
                                coverflowEffect={{
                                    rotate: 50,
                                    stretch: 0,
                                    depth: 100,
                                    modifier: 1,
                                    slideShadows: true
                                }}
                                pagination={{
                                    clickable: true
                                }}
                                className="mySwiper"
                            >
                                {allMovies?.map((m) => {
                                    return (
                                        <div>
                                            <SwiperSlide>
                                                <Link to={`/detail/${m.id}`}>
                                                    <img src={m.poster} alt="img not found" />
                                                </Link>
                                            </SwiperSlide>
                                        </div>
                                    );
                                })}
                            </Swiper>
                            <div>
                                <Container>
                                    <Row md={6} lg={6} className="newdiv">
                                        {
                                            allMovies ? allMovies?.map(data => {
                                                // console.log("HOME", data)

                                                let nombresGen = [];
                                                let generos = data.Genres
                                                generos.forEach(a => {
                                                    nombresGen.push(a.name)
                                                })

                                                return (
                                                    <div className="cardgrid" key={data.id}>
                                                        <Link to={`/detail/${data.id}`}>
                                                            <Cartas title={data.title}
                                                                poster={data.poster}
                                                                year={data.year}
                                                                country={data.Country.name}
                                                                genres={"Géneros: " + nombresGen.join(", ")}
                                                                rating={data.rating}
                                                                key={data.id}
                                                                duration={data.duration}
                                                                synopsis={data.synopsis} />
                                                        </Link>
                                                    </div>
                                                )
                                            }) :
                                                <img src="https://i.pinimg.com/originals/3d/80/64/3d8064758e54ec662e076b6ca54aa90e.gif" alt="not found" />
                                        }
                                    </Row>
                                </Container>
                            </div>
                        </>
                    ) : (
                        <div>
                            <h2>Cargando...</h2>
                        </div>
                    )
                }
            </div>
            <div>
                <Footer />
            </div>
        </>
    )
}
