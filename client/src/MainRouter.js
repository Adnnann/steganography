import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EmbedImage from './components/EmbedImage';
import ExtractImage from './components/ExtractImage';
import Header from './components/Header';

const MainRouter = () => {
    return(
        <>
        <Router>
            <Header />
            <Routes>
                <Route path='/' element={<EmbedImage />}></Route>
                <Route path='/stego' element={<ExtractImage />}></Route>
            </Routes>
        </Router>
        </>
    )
}

export default MainRouter