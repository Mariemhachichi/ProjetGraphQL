import React, { useState } from 'react';
import { useMutation, useQuery, gql } from '@apollo/client';
import { Form, Button, Card, Alert, Spinner } from 'react-bootstrap';

const GET_BOOKS = gql`
  query {
    books {
      id
      title
    }
  }
`;

const UPDATE_BOOK = gql`
  mutation UpdateBook($id: ID!, $title: String) {
    updateBook(id: $id, title: $title) {
      id
      title
    }
  }
`;

function UpdateBook() {
  const [bookId, setBookId] = useState('');
  const [title, setTitle] = useState('');

  const { data, loading, error } = useQuery(GET_BOOKS);

  const [updateBook, { loading: loadingUpdate, error: errorUpdate }] = useMutation(UPDATE_BOOK, {
    onCompleted: () => {
      setBookId('');
      setTitle('');
    },
    refetchQueries: ['GetBooks'],
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!bookId || !title) return;
    updateBook({ variables: { id: bookId, title } });
  };

  if (loading)
    return (
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Chargement...</span>
      </Spinner>
    );

  if (error) return <Alert variant="danger">Erreur de chargement des livres.</Alert>;

  return (
    <Card className="mb-4">
      <Card.Body>
        <Card.Title>Modifier un Livre</Card.Title>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Choisir un livre</Form.Label>
            <Form.Select
              value={bookId}
              onChange={(e) => setBookId(e.target.value)}
              required
            >
              <option value="">Sélectionner un livre</option>
              {data.books.map((book) => (
                <option key={book.id} value={book.id}>
                  {book.title}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Nouveau titre</Form.Label>
            <Form.Control
              type="text"
              placeholder="Entrer le nouveau titre"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </Form.Group>

          {errorUpdate && (
            <Alert variant="danger">Erreur lors de la modification.</Alert>
          )}

          <Button variant="primary" type="submit" disabled={loadingUpdate}>
            {loadingUpdate ? 'Modification...' : 'Modifier'}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default UpdateBook;
