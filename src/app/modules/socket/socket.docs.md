### event: join-streaming

> client request with (join-streaming)

```json
{
  "type": "join-streaming",
  "eventId": "69846f1fc3427464c38e4427"
}
```

> client recieved (join-streaming)

```json
{
  "type": "joined-streaming",
  "eventId": "69846f1fc3427464c38e4427"
}
```

---

### event: chat-streaming

> client request with (chat-streaming)

```json
{
  "type": "chat-streaming",
  "eventId": "69846f1fc3427464c38e4427",
  "comment": "Hello from Postman!"
}
```

> client recieved (chat-streaming)

```json
{
  "type": "chat-streaming-comment",
  "message": {
    "id": "69846f1fc3427464c38e4427",
    "EventComment": [
      {
        "id": "6a62f275375155ad648d9b82",
        "comment": "Hello from Postman!",
        "createdAt": "2026-07-24T05:04:53.747Z",
        "user": {
          "id": "6a62dded69af075815dac6fd",
          "firstName": "Ruhul",
          "lastName": "Amin",
          "profileImage": "https://api.zenexcloud.com/emdadullah/uploads/users/profileImage/1784866545185-kao8p4phtdg.jpeg"
        },
        "ReplyComment": []
      }
    ]
  }
}
```

---

### event: join-streaming-free

> client request with (join-streaming-free)

```json
{
  "type": "join-streaming-free",
  "streamId": "6a61abd469af075815dac6e7"
}
```

> client recieved (join-streaming-free)

```json
{
  "type": "joined-streaming-free",
  "streamId": "6a61abd469af075815dac6e7"
}
```
