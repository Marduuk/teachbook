    GET /posts: Zwraca listę wszystkich postów. Nie przyjmuje żadnych parametrów.

    POST /posts: Tworzy nowy post. Przyjmuje obiekt posta w treści żądania i zwraca utworzony post.

    GET /posts/:id: Zwraca post o danym ID. :id to parametr URL oznaczający identyfikator posta.

    PUT /posts/:id: Aktualizuje post o danym ID. :id to parametr URL oznaczający identyfikator posta. Przyjmuje obiekt posta w treści żądania i zwraca zaktualizowany post.

    DELETE /posts/:id: Usuwa post o danym ID. :id to parametr URL oznaczający identyfikator posta. Zwraca usunięty post.

    POST /posts/:id/comments: Dodaje komentarz do posta o danym ID. :id to parametr URL oznaczający identyfikator posta. Przyjmuje obiekt komentarza w treści żądania i zwraca zaktualizowany post.

    GET /posts/:id/comments: Zwraca listę wszystkich komentarzy dla posta o danym ID. :id to parametr URL oznaczający identyfikator posta.