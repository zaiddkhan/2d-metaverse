const { default: axios } = require("axios");

function sum(a,d){
    return a+d;
}

const BACKEND_URL = "http://localhost:3000"
describe("Authentication", () => {
    test("User is able to sign up only one",async () => {
        const username = "kirat" + Math.random()
        const pass = "123456"
        const response = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username,
            pass,
            type : "admin"
        })
        expect(response.statusCode).toBe(200)
        const updatedResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username,
            pass,
            type : "admin"
        })
        expect(updatedResponse.statusCode).toBe(400)

    });

    test('Signup request fails if the username is empty',async () => {
        const username = "kirat" + Math.random()
        const pass = "123456"
        const response = await axios.post(`${BACKEND_URL}/api/v1/user/signup`, {
            pass,
            type : "admin"
        })
        expect(response.statusCode).toBe(400);
    });

    test('Signin succeeds if the username and password are correct',async () => {
        const username = "kirat" + Math.random()
        const pass = "123456"
        await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username,
            pass,
            type : "admin"
        })
        const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
            username,
            pass,
            type : "admin"
        })
        expect(response.statusCode).toBe(200)
        expect(response.body.token).toBeDefined()
    });

    test('Sign in fails if the username and password are invalid', async () => {
        const username = "kirat" + Math.random()
        const pass = "123456"
        await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username,
            pass,
            type : "admin"
        })
        const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
            username,
            password : "djdjdkdk",
            type : "admin"
        })
        expect(response.statusCode).toBe(403)
    });
});

describe('User information endpoints', () => { 
    let token = ''
    let avatarId = ''
    beforeAll(async () => {
        const username = "kirat" + Math.random()
        const pass = "123456"
        await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username,
            pass,
            type : "admin"
        })
        const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
            username,
            password : "djdjdkdk",
            type : "admin"
        })
        token = response.body.token

        const avatarResponse =await axios.post(`${BACKEND_URL}/api/v1/avatar`,{
            imageUrl : "https://buffer.com/cdn-cgi/image/w=1000,fit=contain,q=90,f=auto/library/content/images/size/w1200/2023/10/free-images.jpg",
            name : "avatar"
        });
        avatarId = avatarResponse.body.avatarId;
    });
    test("user can't update their metadata with a wrong avatar id",async () => {
        const response = await axios.post(`${BACKEND_URL}/api/v1/user/metadata`, {
             avatarId : "193038"
        },{
            headers  : {
                "authorization" : `Bearer ${token}`
            }
        });
        expect(response.statusCode).toBe(400);
    });
    test("user can update their metadata with a right avatar id",async () => {
        const response = await axios.post(`${BACKEND_URL}/api/v1/user/metadata`, {
              avatarId
        }, {
            headers  : {
                "authorization" : `Bearer ${token}`
            }
        });
        expect(response.statusCode).toBe(200);
    });

    test("user is not able to update their metadata without a auth data",async () => {
        const response = await axios.post(`${BACKEND_URL}/api/v1/user/metadata`, {
              avatarId
        });
        expect(response.statusCode).toBe(403);
    });

 });