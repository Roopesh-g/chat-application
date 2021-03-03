import React from 'react'

import { BrowserRouter as Router, Route } from 'react-router-dom' // npm install -S react-router-dom

import Join from './components/join/Join'
import Chat from './components/chat/Chat'

const App = () => {
    return (
        <Router>
        {/* 1st route will take login information and pass it to chat component via query parameters */}
        <Route path="/" exact component={Join} />
        <Route path="/chat" component={Chat} />
        </Router>
    )    
};

export default App