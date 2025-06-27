import React from 'react';
import { useQuery, gql } from '@apollo/client';
import { Card, Spinner, Alert, Container, Row, Col } from 'react-bootstrap';

const GET_BOOKS = gql`
  query {
    books {
      id
      title
      genre
      author {
        name
      }
    }
  }
`;

function Books() {
  const { loading, error, data } = useQuery(GET_BOOKS);

  if (loading)
    return (
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Chargement...</span>
      </Spinner>
    );

  if (error) return <Alert variant="danger">Erreur </Alert>;

  return (
    <div className="mb-4">
      <h2 className="mb-3"> Liste des Livres</h2>
      <Container>
        <Row>
          {data.books.map((book) => (
            <Col md={6} lg={4} key={book.id} className="mb-4">
              <Card>
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    {book.genre}
                  </Card.Subtitle>
                  <Card.Text>
                    <strong>Auteur :</strong> {book.author.name}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
}

export default Books;
