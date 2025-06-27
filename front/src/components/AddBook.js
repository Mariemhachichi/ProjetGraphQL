import React, { useState } from 'react';
import { useMutation, useQuery, gql } from '@apollo/client';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';

const GET_AUTHORS = gql`
  query {
    authors {
      id
      name
    }
  }
`;

const ADD_BOOK = gql`
  mutation AddBook($title: String!, $genre: String!, $authorId: ID!) {
    addBook(title: $title, genre: $genre, authorId: $authorId) {
      id
      title
    }
  }
`;

function AddBook() {
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('');
  const [authorId, setAuthorId] = useState('');

  const { loading: loadingAuthors, error: errorAuthors, data } = useQuery(GET_AUTHORS);

  const [addBook, { loading, error }] = useMutation(ADD_BOOK, {
    onCompleted: () => {
      setTitle('');
      setGenre('');
      setAuthorId('');
    },
    refetchQueries: ['GetBooks'],
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !genre || !authorId) return;
    addBook({ variables: { title, genre, authorId } });
  };

  if (loadingAuthors) return <p>Chargement des auteurs...</p>;
  if (errorAuthors) return <Alert variant="danger">Erreur chargement des auteurs</Alert>;

  return (
    <div className="mb-4">
      <h3>Ajouter un livre</h3>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="bookTitle" className="mb-3">
          <Form.Control
            type="text"
            placeholder="Titre du livre"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={loading}
          />
        </Form.Group>

        <Form.Group controlId="bookGenre" className="mb-3">
          <Form.Control
            type="text"
            placeholder="Genre"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            disabled={loading}
          />
        </Form.Group>

        <Form.Group controlId="bookAuthor" className="mb-3">
          <Form.Select
            value={authorId}
            onChange={(e) => setAuthorId(e.target.value)}
            disabled={loading}
          >
            <option value="">Sélectionner un auteur</option>
            {data.authors.map((author) => (
              <option key={author.id} value={author.id}>
                {author.name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Button variant="primary" type="submit" disabled={loading || !title || !genre || !authorId}>
          {loading ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              /> Ajout...
            </>
          ) : (
            'Ajouter'
          )}
        </Button>
      </Form>
      {error && <Alert variant="danger" className="mt-3">Erreur lors de l'ajout</Alert>}
    </div>
  );
}

export default AddBook;
