const express = require("express");
const cors = require("cors");
const fs = require("node:fs");
const { v4: uuidv4 } = require('uuid');
const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 5000;
const TOKEN = "eysckcoew2092n1d93c30ndkja";
app.post("/login", (req, res) => {
    const { email, password } = req.body;
    if (email == "suresh@gmail.com" && password == "00000") {
        res.status(200).json({
            status: "success",
            data: {
                user: {
                    email: "suresh@gmail.com"
                },
                token: TOKEN
            }
        });
    } else {
        res.status(400).json({
            status: "fail",
            message: "Please provide valid email or password",
        })
    }
});

app.get("/accounts", (req, res) => {
    const { token } = req.headers;
    if (token != TOKEN) {
        res.status(400).json({
            status: "fail",
            message: "Please provide valid token",
        });
        return;
    }
    fs.readFile(__dirname + '/accounts.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        res.status(200).json({
            status: "success",
            data: {
                accounts: JSON.parse(data)
            }
        });
    });
});

app.post("/account", (req, res) => {
    const { token } = req.headers;
    if (token != TOKEN) {
        res.status(400).json({
            status: "fail",
            message: "Please provide valid token",
        });
        return;
    }

    const { accountName, email, password, description } = req.body;
    const newAccount = { accountName, email, password, description, id: uuidv4() }
    fs.readFile(__dirname + '/accounts.json', 'utf8', (err, data) => {
        if (err) {
            res.status(400).json({
                status: "fail",
                message: "Unable to save data.",
            });
            return;
        }
        let accounts = JSON.parse(data);
        accounts.push(newAccount);

        fs.writeFile(__dirname + '/accounts.json', JSON.stringify(accounts), err => {
            if (err) {
                res.status(400).json({
                    status: "fail",
                    message: "Unable to save data.",
                });
                return
            }
            res.status(200).json({
                status: "success",
                message: "Account data saved successfully"
            });
        });
    });
});

app.put("/account/:id", (req, res) => {
    const { token } = req.headers;
    if (token != TOKEN) {
        res.status(400).json({
            status: "fail",
            message: "Please provide valid token",
        });
        return;
    }
    const { id } = req.params;
    if (!id) {
        res.status(400).json({
            status: "fail",
            message: "Please provide account id",
        });
        return;
    }
    const { accountName, email, password, description } = req.body;
    fs.readFile(__dirname + '/accounts.json', 'utf8', (err, data) => {
        if (err) {
            res.status(400).json({
                status: "fail",
                message: "Unable to save data.",
            });
            return;
        }
        let accounts = JSON.parse(data);

        accounts.forEach(account => {
            if (account.id === id) {
                account.accountName = accountName ? accountName : account.accountName;
                account.email = email ? email : account.email;
                account.password = password ? password : account.password;
                account.description = description ? description : account.description;
            }
        });

        fs.writeFile(__dirname + '/accounts.json', JSON.stringify(accounts), err => {
            if (err) {
                res.status(400).json({
                    status: "fail",
                    message: "Unable to save data.",
                });
                return
            }
            res.status(200).json({
                status: "success",
                message: "Account data saved successfully"
            });
        });
    });
});

app.listen(PORT, () => {
    console.log("App is running on port: " + PORT);
});