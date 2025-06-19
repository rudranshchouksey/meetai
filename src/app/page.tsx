"use client";

import { authClient } from "@/lib/auth-client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function Home() {
   const { data: session } = authClient.useSession()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const onSubmit = () => {
    authClient.signUp.email({
      email,
      name,
      password,
    }, {
      onSuccess: () => {
        console.log("User created successfully");
      },
      onError: (error) => {
        console.error("Error creating user:", error);
      }
    })
  }

  const onLogin = () => {
    authClient.signIn.email({
      email,
      password,
    }, {
      onSuccess: () => {
        console.log("User created successfully");
      },
      onError: (error) => {
        console.error("Error creating user:", error);
      }
    })
  }

  if (session) {
    return (
      <div className="p-4 flex flex-col gap-y-4">
        <p>Welcome, {session.user.name}!</p>
        <Button onClick={() => authClient.signOut()}>Sign Out</Button>
      </div>
    );
  }

  return (
    <div className="p-4 flex flex-col gap-y-10">
    <div className="p-4 flex flex-col gap-y-4 background-gray-100">
      <Input placeholder="name" value={name} onChange={(e) => setName(e.target.value)}/>
      <Input placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <Input placeholder="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <Button onClick={onSubmit} className="w-full" disabled={!name || !email || !password}>
        Create User
      </Button>
    </div>
    <div className="p-4 flex flex-col gap-y-4 background-gray-100">
      <Input placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <Input placeholder="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <Button onClick={onLogin} className="w-full" disabled={!name || !email || !password}>
        Login User
      </Button>
    </div>
    </div>
  );
}
