'use client'
import { apiRequest } from "@/lib/api";
import { useEffect, useState } from "react";


export default function Profile() {
const [profile, setProfile] = useState<any>({});


useEffect(() => {
apiRequest("/users/me").then(setProfile);
}, []);


return (
<div>
<h3>Profile</h3>
<pre>{JSON.stringify(profile, null, 2)}</pre>
</div>
);
}