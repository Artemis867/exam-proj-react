import React, { useCallback, useEffect, useState } from "react"

import { BellRing, Check, User, LogOut } from "lucide-react"
 
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import ProfileForm from "./ProfileForm"

interface UserData {
  username: String,
  email: String,
}

export default function Profile() {

  const navigate = useNavigate();

  const [userData, setUserData] = useState<UserData | {}>({});
  const [showProtected, setShowProtected] = useState<boolean>(true);
  const [showProfileForm, setShowProfileForm] = useState<boolean>(false);

  useEffect(() => {
    console.log('INIT');
    const username = localStorage.getItem('username');
    
    let isMounted = true;
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': token
      }

      if(!isMounted) return;
      const result = await axios.post("http://localhost:4000/user/info",{username}, {headers: headers});

      if(result.data.success == true) {
        setUserData(result.data.userData);
        setShowProtected(false);
      } else {
        setShowProtected(true);
      }
    };
    
    fetchUserData();
    return () => {
      isMounted = false;
    }
    
  }, []);

  useEffect(() => {
    console.log('[TRACK] userData');
    console.log(userData);
  }, [userData]);

  const notifications = [
    {
      title: "Your subscription is expiring soon!",
      description: "2 hours ago",
    },
    {
      title: "You can now check your location!",
      description: "2 hours ago",
    },
  ];

  const onHandleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    navigate('/');
  }

  const onUpdateUserData = useCallback((newUserData) => {
    setUserData(newUserData);
  }, [userData]);

  const protectedMarkup = (
    <div>Cannot access this page</div>
  );

  const onShowProfileForm = useCallback((toggle) => {
    setShowProfileForm(toggle);
  }, [showProfileForm]);

  const profileInfoMarkup = (
    <Card className={"w-[580px]"}>
      <CardHeader>
        <CardTitle>Welcome {userData?.username} ({userData?.email})</CardTitle>
        <CardDescription>You have 2 unread messages.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className=" flex items-center space-x-4 rounded-md border p-4">
          <BellRing />
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">
              Manage Profile
            </p>
            <p className="text-sm text-muted-foreground">
              Manage your account settings.
            </p>
            <Button className="w-full" onClick={(e) => onShowProfileForm(true)}>
              <User /> Manage Account
            </Button>
          </div>
        </div>
        <div>
          {notifications.map((notification, index) => (
            <div
              key={index}
              className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
            >
              <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">
                  {notification.title}
                </p>
                <p className="text-sm text-muted-foreground">
                  {notification.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={onHandleLogout}>
          <LogOut /> Logout
        </Button>
      </CardFooter>
    </Card>
  );

  return (
    <>
      {showProtected == true ? protectedMarkup : (<div className="flex justify-center m-5 w-[100%]">
        {!showProfileForm ? profileInfoMarkup : <ProfileForm onShowProfileForm={onShowProfileForm} userData={userData} onUpdateUserData={onUpdateUserData}/>}
      </div>)}
    </>
  )
};

