// const AWS = require('aws-sdk')
const express = require('express');
const app = express();
const path = require("path");
const fs = require('fs');
const { CognitoIdentityProviderClient, ForgotPasswordCommand, SignUpCommand, ConfirmForgotPasswordCommand } = require("@aws-sdk/client-cognito-identity-provider");
app.use(express.static(__dirname + '/'));
app.use(express.urlencoded({extended: 'false'}))
app.use(express.json())

app.get("/", (req, res) => {
    fs.readFile(__dirname + '/index.html', 'utf8', (err, text) => {
        res.send(text);
    });
})
app.get("/reset_password", (req, res) => {
    fs.readFile(__dirname + '/reset_password.html', 'utf8', (err, text) => {
        res.send(text);
    });
})
app.get("/confirm_reset_password", (req, res) => {
    fs.readFile(__dirname + '/confirm_reset_password.html', 'utf8', (err, text) => {
        res.send(text);
    });
})

app.post("/register", (req, res) => {
    const client = new CognitoIdentityProviderClient({ region: "ap-northeast-1" });
    const { username, email, password} = req.body;
    console.log(email)
    const userPoolId = 'ap-northeast-1_WlHQ6xAer';
    const clientId = '1gb3rggmrc7b7n9as47agajcp5'
    const cognitoParams = {
        UserPoolId: userPoolId,
        ClientId: clientId,
        Username: username,
        Password: password,
        UserAttributes: [
            {
            Name: "email",
            Value: email,
            }
        ],
    };

    const command = new SignUpCommand(cognitoParams);
    client.send(command).then(
        (data) => {
            res.json(data)
        },
        (error) => {
            console.log(error)
        }
    )
    // const cognitoParams = {
    //     UserPoolId: userPoolId,
    //     Username: username,
    //     UserAttributes: [
    //         {
    //         Name: "email",
    //         Value: email,
    //         },
    //         {
    //         Name: "email_verified",
    //         Value: "true",
    //         },
    // ],
    // TemporaryPassword: password || "Password@123456789",
    // };

    // const command = new AdminCreateUserCommand(cognitoParams);
    // client.send(command).then(
    //     (data) => {
    //         res.json(data)
    //     },
    //     (error) => {
    //         console.log(error)
    //     }
    // )
})

app.post("/forgot_password", (req, res) => {
    const client = new CognitoIdentityProviderClient({ region: "ap-northeast-1" });
    const { username} = req.body;
    const userPoolId = 'ap-northeast-1_WlHQ6xAer';
    const clientId = '1gb3rggmrc7b7n9as47agajcp5'
    const cognitoParams = {
        UserPoolId: userPoolId,
        ClientId: clientId,
        Username: username,
    };

    const command = new ForgotPasswordCommand(cognitoParams);
    client.send(command).then(
        (data) => {
            res.json(data)

        },
        (error) => {
            console.log(error)
        }
    )
})
app.post("/confirm_reset_password", (req, res) => {
    const client = new CognitoIdentityProviderClient({ region: "ap-northeast-1" });
    const { username, password, confirm_code} = req.body;
    const userPoolId = 'ap-northeast-1_WlHQ6xAer';
    const clientId = '1gb3rggmrc7b7n9as47agajcp5'
    const cognitoParams = {
        UserPoolId: userPoolId,
        ClientId: clientId,
        Username: username,
        Password: password,
        ConfirmationCode: confirm_code
    };

    const command = new ConfirmForgotPasswordCommand(cognitoParams);
    client.send(command).then(
        (data) => {
            res.json(data)
        },
        (error) => {
            console.log(error)
        }
    )
})
// const createUser = async (user) => {
//     try {
//       const { email, password } = user;
//       const cognitoParams = {
//         UserPoolId: userPoolId,
//         Username: email,
//         UserAttributes: [
//           {
//             Name: "email",
//             Value: email,
//           },
//           {
//             Name: "email_verified",
//             Value: "true",
//           },
//         ],
//         TemporaryPassword: password || "Password@123456789",
//       };
  
//       console.log(cognitoParams.TemporaryPassword);
  
//       let response = await COGNITO_CLIENT.adminCreateUser(
//         cognitoParams
//       ).promise();
//       console.log(JSON.stringify(response));
//       return "user created";
//     } catch (err) {
//       throw Error(err);
//     }
// };


app.listen(5000, ()=> {
    console.log("server started on port 5000")
})