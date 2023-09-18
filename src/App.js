import React from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import { Col, Row, Container, Button } from 'react-bootstrap';
import Image from 'react-bootstrap/Image';
import Form from 'react-bootstrap/Form';

export default function App() {
    const [images, setImages] = React.useState([]);
    const [imageSelected, setImageSelected] = React.useState('');
    const [isActiveImageButton, setIsActiveImageButton] = React.useState(false);
    const [isActiveThumb, setIsActiveThumb] = React.useState(false);
    const [topic, setTopic] = React.useState('nature');

    React.useEffect(() => {
        const fetchImageaApi = async () => {
            try {
                const res = await fetch(
                    `https://api.pexels.com/v1/search?query=${topic}&per_page=3`,

                    {
                        method: 'GET',
                        headers: {
                            authorization:
                                '563492ad6f917000010000017f488949f5c24f7cb9fc4ad4069c1050',
                        },
                    },
                );
                const data = await res.json();

                if (!hasFetchApi) {
                    setImages(data?.photos);
                    setImageSelected(data.photos.at(0).id);
                }
            } catch (error) {
                alert(error);
            }
        };

        let hasFetchApi = false;
        fetchImageaApi();
        return () => (hasFetchApi = true);
    }, []);

    const selectImg = (idImage) => setImageSelected(idImage);

    const handleThmbSelection = (idImage) => {
        setIsActiveThumb(false);
        setIsActiveImageButton(true);
        selectImg(idImage);
    };
    const handleImgButtonSelection = (idImage) => {
        setIsActiveThumb(true);
        setIsActiveImageButton(false);
        selectImg(idImage);
    };
    const handleChangeTopic = (event) => {
        const { value } = event.target;
        setTopic(value);
    };
    const mainImg = React.useMemo(() => {
        if (images.length > 0) {
            const imgSelected = images?.find((img) => img.id === imageSelected);
            const { landscape } = imgSelected?.src;
            return landscape;
        }
    }, [imageSelected, images]);

    const infoPhotographer = React.useMemo(() => {
        if (images.length > 0) {
            const imgSelected = images?.find((img) => img.id === imageSelected);
            const { photographer, photographer_url } = imgSelected;
            return { photographer, photographer_url };
        }
    }, [imageSelected, images]);
    const imagesTemplate = React.useMemo(() => {
        return images?.length > 0 ? (
            <Row style={{ padding: '0px 16px' }}>
                <Col sm="2" style={{ margin: '40 0' }}>
                    {images.map((img) => (
                        <Button
                            key={img.id}
                            variant="dark"
                            style={{
                                padding: '8px',
                                margin: '4px',
                                borderWidth:
                                    isActiveImageButton && imageSelected === img.id ? 4 : 2,
                                borderColor: '#3c2784',
                            }}
                            onClick={() => handleImgButtonSelection(img.id)}>
                            Immagine N°{img.id}
                        </Button>
                    ))}
                    <Form.Control
                        type="text"
                        placeholder="Cambia topic"
                        onChange={handleChangeTopic}
                    />
                </Col>
                <Col sm="10">
                    <div className="containerImages">
                        <div className="container-photographer">
                            <a href={infoPhotographer.photographer_url}>
                                {infoPhotographer.photographer}
                            </a>
                        </div>
                        <div className="container-main-image">
                            <Image src={mainImg} style={{ width: '100%' }}></Image>
                        </div>

                        <div className="container-thumbs">
                            {images?.map((img) => {
                                const { small } = img.src;
                                return (
                                    <div
                                        key={img.id}
                                        className="img-container"
                                        onClick={() => handleThmbSelection(img.id)}
                                        style={{
                                            borderWidth:
                                                isActiveThumb && imageSelected === img.id ? 4 : 2,
                                            borderColor: '#3c2784',
                                            borderStyle: 'solid',
                                        }}>
                                        <Image src={small} style={{ width: '100%' }}></Image>;
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </Col>
            </Row>
        ) : (
            <span className="loader"></span>
        );
    }, [images, mainImg, imageSelected, isActiveImageButton, isActiveThumb]);

    return (
        <>
            <Container fluid="md" className="main-container">
                <Row>
                    <h2 className="title">Digit test </h2>
                </Row>
                {imagesTemplate}
            </Container>
        </>
    );
}
