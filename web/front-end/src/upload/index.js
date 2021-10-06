// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
//
//     Permission is hereby granted, free of charge, to any person obtaining a copy of
// this software and associated documentation files (the "Software"), to deal in
// the Software without restriction, including without limitation the rights to
// use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
// the Software, and to permit persons to whom the Software is furnished to do so.
//
//     THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
// FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
// COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
// IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
// CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
//
//     Author: Rafael M. Koike - koiker@amazon.com
import React, {useState} from 'react';
import {withRouter} from 'react-router-dom';
import {AppLayout, FormField, Button, Box, Cards, Link, SpaceBetween} from "@awsui/components-react";
import {appLayoutLabels} from '../labels';
import "../styles.css";
import ServiceNavigation from "../navigation";
import Container from "@awsui/components-react/container";
import Header from "@awsui/components-react/header";
import configData from "../config.json";

const FileUploader = () => {
    const [fileName, setFileName] = React.useState('');
    const [previewImage, setPreviewImage] = React.useState('');
    const [fileBinary, setFileBinary] = React.useState(null);
    const hiddenFileInput = React.useRef(null);
    const [items, setItems] = React.useState([]);

    const handleClick = () => {
        hiddenFileInput.current.click();
    };
    const handleChange = event => {
        console.log(event.target.files[0]);
        const reader = new FileReader();
        setFileName(event.target.files[0].name);
        setPreviewImage(URL.createObjectURL(event.target.files[0]));
        reader.readAsArrayBuffer(event.target.files[0]);
        reader.onload = function (e) {
            setFileBinary(e.target.result);
        };

    };
    const handleUpload = () => {
        fetch(configData.SERVER_URL + configData.API_PATH, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'image/jpeg'
            },
            body: fileBinary
        }).then(response => response.json())
            .then(data => {
                console.log(data);
                setItems(data.Results);
            });
    }
    return (
        <>
            <SpaceBetween size="xs" direction="vertical">
                <SpaceBetween direction="horizontal" size="xs">
                    <Button onClick={handleClick}>
                        Upload a file
                    </Button>
                    {fileName}
                    <input
                        type="file"
                        ref={hiddenFileInput}
                        onChange={handleChange}
                        style={{display: 'none'}}
                    />
                    <Button onClick={handleUpload}>
                        Detect Objects
                    </Button>
                </SpaceBetween>
                <Cards
                    cardDefinition={{
                        header: item => (
                            <Link fontSize="heading-m">{item.Object}</Link>
                        ),
                        sections: [
                            {
                                id: "Object",
                                header: "Object",
                                content: item => item.Object
                            },
                            {
                                id: "Confidence",
                                header: "Confidence",
                                content: item => item.Confidence
                            },
                            {
                                id: "BoundingBoxes",
                                header: "BoundingBoxes",
                                content: item => `x: ${item.BoundingBoxes.x}, y: ${item.BoundingBoxes.y}, w: ${item.BoundingBoxes.w}, h: ${item.BoundingBoxes.h}`
                            }
                        ]
                    }}
                    cardsPerRow={[
                        {cards: 1},
                        {minWidth: 500, cards: 2}
                    ]}
                    items={items}
                    loadingText="Loading resources"
                    empty={
                        <Box textAlign="center" color="inherit">
                            <b>No resources</b>
                            <Box
                                padding={{bottom: "s"}}
                                variant="p"
                                color="inherit"
                            >
                                No objects to display.
                            </Box>
                        </Box>
                    }
                    // filter={<TextFilter filteringText="asdfjkl" />}
                    header={<Header>Objects Detected</Header>}
                />
                <Box margin="xl" padding="xl">
                    <img src={previewImage} alt="" style={{flex: 1, width: undefined, height: undefined}}/>
                </Box>
            </SpaceBetween>
        </>
    );
}

const Content = () => {
    return (
        <Container
            id="serverless-storage-panel"
            header={
                <Header variant="h2">
                    Upload image for object recognition
                </Header>
            }
        >
            {
                <div>
                    <FormField
                        description='Upload only: .png, .jpg, .jpeg file'
                        label='Image upload'
                    />
                    <FileUploader></FileUploader>
                </div>
            }
        </Container>
    );
};

function UploadView() {
    const [navigationOpen, setNavigationOpen] = useState(true);

    return (
        <AppLayout
            content={<Content/>}
            headerSelector='#h'
            navigation={<ServiceNavigation/>}
            navigationOpen={navigationOpen}
            onNavigationChange={({detail}) => setNavigationOpen(detail.open)}
            ariaLabels={appLayoutLabels}
        />
    );
}

export default withRouter(UploadView);