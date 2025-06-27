import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import client from './apolloClient';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Navbar, Nav, Button } from 'react-bootstrap';

import { AuthProvider, useAuth } from './AuthContext';

// Composants
import Authors from './components/Authors';
import Books from './components/Books';
import AddAuthor from './components/AddAuthor';
import AddBook from './components/AddBook';
import UpdateBook from './components/UpdateBook';
import DeleteBook from './components/DeleteBook';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import ProtectedRoute from './components/ProtectedRoute';

// ✅ Page d'accueil
function Home() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
        <Container>
          <Navbar.Brand href="/"> Bibliothèque</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse>
            <Nav className="me-auto">
              <Nav.Link href="/">Accueil</Nav.Link>
            </Nav>
            <Button variant="danger" onClick={handleLogout}>Déconnexion</Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container>
        <h2 className="mb-4">Tableau de Bord</h2>

        <div className="row">
          <div className="col-md-6">
            <AddAuthor />
            <AddBook />
            <UpdateBook />
            <DeleteBook />
          </div>
          <div className="col-md-6">
            <Authors />
            <Books />
          </div>
        </div>
      </Container>
    </>
  );
}

// ✅ App avec AuthProvider + Router
function App() {
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ApolloProvider>
  );
}

export default App;
