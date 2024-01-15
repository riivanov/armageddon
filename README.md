# To run the API

This assumes you have NPM and Node installed.

- If not download [NVM](https://github.com/nvm-sh/nvm).

```bash
git clone https://github.com/riivanov/armageddon.git

cd armageddon

npm install

npm start
```

# To test the API

If you want to make changes to the input of the request modify `post.json`, respectively.

If port `7891` happens to already be bound, you can modify the `PORT` variable in the file `.env`

To test the endpoint you can use `curl`:

```
curl --json @post.json -X POST http://localhost:7891/
```
