import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';

const ADD_AUTHOR = gql`
  mutation AddAuthor($name: String!) {
    addAuthor(name: $name) {
      id
      name
    }
  }
`;

function AddAuthor() {
  const [name, setName] = useState('');

  const [addAuthor, { loading, error }] = useMutation(ADD_AUTHOR, {
    onCompleted: () => setName(''),
    refetchQueries: ['GetAuthors'], // adapte selon ta query
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) return;
    addAuthor({ variables: { name } });
  };

  return (
    <div className="mb-4">
      <h3>Ajouter un auteur</h3>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="authorName" className="mb-3">
          <Form.Control
            type="text"
            placeholder="Nom de l'auteur"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
          />
        </Form.Group>
        <Button variant="primary" type="submit" disabled={loading || !name}>
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

export default AddAuthor;
