const API = "http://127.0.0.1:8000";


export async function apiRequest(url: string, method = "GET", data?: any) {
const token = localStorage.getItem("token");


const res = await fetch(API + url, {
method,
headers: {
"Content-Type": "application/json",
Authorization: token ? `Bearer ${token}` : "",
},
body: data ? JSON.stringify(data) : undefined,
});


if (!res.ok) throw new Error("API Error");
return res.json();
}