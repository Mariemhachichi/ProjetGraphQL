import React, { useState } from 'react';
import { useMutation, useQuery, gql } from '@apollo/client';
import { Form, Button, Spinner, Alert, Card } from 'react-bootstrap';

const GET_BOOKS = gql`
  query {
    books {
      id
      title
    }
  }
`;

const DELETE_BOOK = gql`
  mutation DeleteBook($id: ID!) {
    deleteBook(id: $id)
  }
`;

function DeleteBook() {
  const [bookId, setBookId] = useState('');

  const { data, loading, error } = useQuery(GET_BOOKS);

  const [deleteBook, { loading: loadingDelete, error: errorDelete }] = useMutation(DELETE_BOOK, {
    onCompleted: () => setBookId(''),
    refetchQueries: ['GetBooks'],
  });

  const handleDelete = (e) => {
    e.preventDefault();
    if (!bookId) return;
    deleteBook({ variables: { id: bookId } });
  };

  if (loading)
    return (
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Chargement...</span>
      </Spinner>
    );

  if (error) return <Alert variant="danger">Erreur lors du chargement des livres.</Alert>;

  return (
    <Card className="mb-4">
      <Card.Body>
        <Card.Title>Supprimer un Livre</Card.Title>

        <Form onSubmit={handleDelete}>
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

          {errorDelete && (
            <Alert variant="danger">Erreur lors de la suppression.</Alert>
          )}

          <Button variant="danger" type="submit" disabled={loadingDelete}>
            {loadingDelete ? 'Suppression...' : 'Supprimer'}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default DeleteBook;
