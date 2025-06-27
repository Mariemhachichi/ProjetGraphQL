import React from 'react';
import { useQuery, gql } from '@apollo/client';
import { Card, Spinner, Alert, ListGroup, Container, Row, Col } from 'react-bootstrap';

const GET_AUTHORS = gql`
  query {
    authors {
      id
      name
      books {
        title
      }
    }
  }
`;

function Authors() {
  const { loading, error, data } = useQuery(GET_AUTHORS);

  if (loading) return <Spinner animation="border" role="status"><span className="visually-hidden">Chargement...</span></Spinner>;
  if (error) return <Alert variant="danger">Erreur lors du chargement des auteurs.</Alert>;

  return (
    <div className="mb-4">
      <h2 className="mb-3">Liste des Auteurs</h2>
      <Container>
        <Row>
          {data.authors.map((author) => (
            <Col md={6} lg={4} key={author.id} className="mb-4">
              <Card>
                <Card.Body>
                  <Card.Title>{author.name}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">Livres :</Card.Subtitle>
                  {author.books.length > 0 ? (
                    <ListGroup variant="flush">
                      {author.books.map((book, index) => (
                        <ListGroup.Item key={index}>{book.title}</ListGroup.Item>
                      ))}
                    </ListGroup>
                  ) : (
                    <p>Aucun livre disponible.</p>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
}

export default Authors;
