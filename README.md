# To run the API

This assumes you have NPM and Node installed.

- If not download [NVM](https://github.com/nvm-sh/nvm).

```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
nvm install --lts
nvm use --lts
node --version # 20.11.0
npm --version # 10.2.4
```

```bash
git clone https://github.com/riivanov/armageddon.git
cd armageddon
npm install
npm start
```

# To test the API

If you want to make changes to the input of the request modify `post.json`, respectively.

If port `7891` happens to already be bound, you can modify the `PORT` variable in the file `.env`

To test the endpoint, from the project directory, you can use `curl`:

```
curl --json @post.json -X POST http://localhost:7891/
```
